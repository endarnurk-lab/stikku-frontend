"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url?: string;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cute');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (!error && data) setProducts(data as ProductType[]);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = '';

    // Logika unggah gambar ke Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Gagal unggah gambar: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // Ambil URL publik gambar yang berhasil diunggah
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      uploadedImageUrl = publicUrlData.publicUrl;
    }

    // Masukkan data produk beserta URL gambar ke tabel database
    const { error } = await supabase.from('products').insert([
      { name, category, description, price: Number(price), image_url: uploadedImageUrl }
    ]);

    if (error) {
      alert('Gagal menambah produk: ' + error.message);
    } else {
      alert('Produk berhasil ditambahkan!');
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      fetchProducts();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus stiker ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
          <p className="text-gray-500">Kelola katalog stiker & gambar di sini.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
            <h2 className="text-xl font-bold mb-4">Tambah Stiker Baru</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Stiker</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="Cute">Cute</option>
                  <option value="Tech">Tech</option>
                  <option value="Programming">Programming</option>
                  <option value="Anime">Anime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File Gambar Stiker</label>
                <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg"></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Menyimpan & Mengunggah...' : '+ Tambah Produk'}
              </button>
            </form>
          </div>

          {/* Tabel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Daftar Produk ({products.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Gambar</th>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>
                        )}
                      </td>
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{product.category}</span>
                      </td>
                      <td className="p-3">Rp {product.price.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}