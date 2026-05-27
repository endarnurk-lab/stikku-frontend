"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // JIKA MERAH, ubah menjadi: import { supabase } from '../lib/supabase'; atau '@/lib/supabase';

type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url?: string;
};

export default function AdminDashboard() {
  // === SISTEM KEAMANAN PIN ===
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const PIN_RAHASIA = '250106'; // SILAKAN GANTI PIN ANDA DI SINI

  // === STATE DATA PRODUK ===
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // === STATE FORM INPUT ===
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cute');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Ambil data dari database saat gembok terbuka
  useEffect(() => {
    if (!isLocked) {
      fetchProducts();
    }
  }, [isLocked]);

  // Fungsi Login PIN
  function handleLogin() {
    if (pinInput === PIN_RAHASIA) {
      setIsLocked(false);
    } else {
      alert('PIN Salah! Anda bukan pemilik toko.');
      setPinInput('');
    }
  }

  // Ambil Daftar Produk dari Supabase
  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    
    if (!error && data) {
      setProducts(data as ProductType[]);
    }
  }

  // Fungsi Unggah Produk (Gambar + Data)
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      alert('Pilih file gambar stiker terlebih dahulu!');
      setLoading(false);
      return;
    }

    let uploadedImageUrl = '';

    try {
      // 1. Upload Gambar ke Supabase Storage Bucket 'products'
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Gagal mengunggah gambar: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Ambil URL Publik Gambar
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      uploadedImageUrl = publicUrlData.publicUrl;

      // 3. Simpan Data ke Tabel 'products' di Database
      const { error: insertError } = await supabase.from('products').insert([
        { 
          name, 
          category, 
          description, 
          price: Number(price), 
          image_url: uploadedImageUrl 
        }
      ]);

      if (insertError) {
        alert('Gagal menyimpan ke database: ' + insertError.message);
      } else {
        alert('🎉 Hebat! Produk stiker berhasil terbit ke halaman utama!');
        // Reset Form
        setName('');
        setDescription('');
        setPrice('');
        setImageFile(null);
        // Refresh tabel biar produk baru langsung muncul
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem saat mengunggah.');
    }
    setLoading(false);
  }

  // Fungsi Hapus Produk
  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus stiker ini dari toko?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      fetchProducts();
    } else {
      alert('Gagal menghapus: ' + error.message);
    }
  }

  // ==========================================
  // 1. TAMPILAN LAYAR KUNCI (MODERN GLASS)
  // ==========================================
  if (isLocked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-slate-700">
          <div className="text-5xl mb-4 animate-bounce">🔒</div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Stikku Admin</h1>
          <p className="text-slate-400 mb-6 text-sm">Masukkan PIN rahasia untuk mengelola toko.</p>
          
          <input 
            type="password" 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value)} 
            placeholder="••••••"
            className="w-full p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-xl mb-4 text-center text-2xl tracking-[0.4em] font-bold focus:border-blue-500 focus:outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30"
          >
            Buka Dashboard
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // 2. TAMPILAN DASHBOARD UTAMA (MODERN PREMIUM)
  // ==========================================
  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER BAR */}
        <header className="mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Kontrol 🛠️</h1>
            <p className="text-slate-500 text-sm">Tambah produk stiker baru dan pantau etalase beranda Anda.</p>
          </div>
          <button 
            onClick={() => setIsLocked(true)} 
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 border border-rose-100"
          >
            Kunci Keluar 🔒
          </button>
        </header>

        {/* UTAMA: GRID 2 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM TAMBAH PRODUK */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span>✨</span> Tambah Stiker Baru
            </h2>
            
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Produk</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Sticker Pack Coding" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-sm">
                  <option value="Cute">Cute</option>
                  <option value="Tech">Tech</option>
                  <option value="Programming">Programming</option>
                  <option value="Anime">Anime</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Harga Jual (Rp)</label>
                <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">File Gambar Stiker</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-slate-600 justify-center">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Pilih berkas gambar</span>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG, JPEG up to 5MB</p>
                    {imageFile && <p className="text-xs font-bold text-emerald-600 mt-2">✓ {imageFile.name}</p>}
                  </div>
                  <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Deskripsi Produk (Opsional)</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Stiker bahan vinyl laminasi glossy tahan air..." className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-sm"></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-blue-600/10 text-sm">
                {loading ? '📦 Sedang Memproses...' : '🚀 Terbitkan Produk'}
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: TABEL MONITORING LIVE PRODUK */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span>🛍️</span> Katalog Live di Beranda ({products.length})
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4">Gambar</th>
                    <th className="p-4">Nama Stiker</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Belum ada produk yang diunggah.</td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="p-4">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image_url} alt={product.name} className="w-14 h-14 object-cover rounded-xl border shadow-sm bg-slate-100" />
                          ) : (
                            <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{product.name}</td>
                        <td className="p-4">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-blue-100">{product.category}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">Rp {product.price.toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDelete(product.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-rose-100">
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}