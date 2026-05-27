"use client";

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Jika merah, ganti jadi '@/lib/supabase'

type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
};

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data produk saat website pertama kali dibuka
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false }); // Menampilkan yang paling baru di atas

      if (!error && data) {
        setProducts(data as ProductType[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (productName: string) => {
    alert(`Yeay! ${productName} siap masuk keranjang (Fitur Keranjang akan kita buat di tahap selanjutnya!)`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION (Bagian Atas) */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Selamat Datang di Stikku! ✨</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Temukan koleksi stiker premium untuk laptop, buku, dan gadget kesayanganmu.
        </p>
      </div>

      {/* ETALASE PRODUK */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Koleksi Terbaru 🚀</h2>
        </div>

        {/* JIKA SEDANG LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-slate-500 font-medium animate-pulse">Memuat stiker keren...</p>
          </div>
        ) : products.length === 0 ? (
          /* JIKA BELUM ADA PRODUK */
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-slate-700">Belum ada stiker</h3>
            <p className="text-slate-500">Pemilik toko belum mengunggah stiker apa pun.</p>
          </div>
        ) : (
          /* GRID PRODUK */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                {/* Gambar Produk */}
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  {/* Badge Kategori */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* Detail Produk */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
                    {product.description || "Stiker premium berkualitas tinggi."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-blue-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product.name)}
                      className="bg-slate-900 hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Tambah ke Keranjang"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}