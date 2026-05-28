"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useCart } from '../context/CartContext';

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
  
  // STATE BARU: Untuk menyimpan teks pencarian & kategori terpilih
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const { addToCart } = useCart(); 

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (!error && data) setProducts(data as ProductType[]);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // FITUR: Mengambil daftar kategori unik secara otomatis dari produk yang ada
  const categories = ['Semua', ...Array.from(new Set(products.map(p => p.category)))];

  // FITUR: Menyaring produk berdasarkan kolom pencarian DAN tombol kategori
  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION & KOTAK PENCARIAN */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Selamat Datang di Stikku! ✨</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Temukan koleksi stiker premium untuk laptop, buku, dan gadget kesayanganmu.
        </p>
        
        {/* Kolom Pencarian */}
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Cari stiker favoritmu..." 
            className="w-full py-4 pl-12 pr-4 rounded-full text-slate-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-4 top-4 text-xl">🔍</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TOMBOL KATEGORI HORIZONTAL */}
        {!loading && products.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat, index) => (
              <button 
                key={index}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* TAMPILAN PRODUK */}
        {loading ? (
          <div className="flex justify-center h-40"><p className="text-slate-500 font-medium animate-pulse">Memuat stiker keren...</p></div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700">Belum ada stiker</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* JIKA PENCARIAN TIDAK DITEMUKAN */
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🕵️‍♂️</div>
            <h3 className="text-xl font-bold text-slate-700">Stiker tidak ditemukan</h3>
            <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  {/* Badge Kategori di Pojok Gambar */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{product.description || "Stiker premium berkualitas tinggi."}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-blue-600">Rp {product.price.toLocaleString('id-ID')}</span>
                    
                    <button 
                      onClick={() => addToCart(product)}
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