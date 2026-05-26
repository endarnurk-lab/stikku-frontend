"use client";

import { supabase } from './lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Struktur data produk yang sudah dilengkapi image_url
type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url?: string; // <-- Sekarang TypeScript tidak akan protes lagi!
};

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const { addToCart, totalItems } = useCart();

  // Mengambil data dari Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Gagal mengambil data:', error);
      } else if (data) {
        setProducts(data as ProductType[]);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['Semua', 'Cute', 'Tech', 'Programming', 'Anime'];

  // Logika Filter & Pencarian Pintar
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pb-20">
      
      {/* HEADER NAVIGASI */}
<header className="mb-6 flex justify-between items-center">
  <div>
    <h1 className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">Stikku.</h1>
  </div>
  <div className="flex gap-4">
    <Link href="/custom" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2 rounded-xl font-bold hover:opacity-80 transition text-sm flex items-center">
      + Stiker Custom
    </Link>
  </div>
</header>

      {/* HERO BANNER */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-lg mb-6 md:mb-0">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-4 inline-block backdrop-blur-sm">PROMO SPESIAL</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Ekspresikan Dirimu <br/> Lewat Stiker.</h2>
          <p className="text-blue-100 text-sm md:text-base">Beli stiker ready-stock pilihan atau cetak desain komunitasmu sendiri dengan kualitas premium tahan air.</p>
        </div>
      </section>

      {/* SMART SEARCH & FILTER KATEGORI */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Katalog Produk</h3>
          
          <div className="w-full md:w-72 relative">
            <input 
              type="text" 
              placeholder="Cari nama stiker..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
      
      {/* GRID KARTU PRODUK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="group border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
              <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <span className="text-gray-400 text-sm font-medium">No Image</span>
                )}
              </div>
              
              <div className="flex-grow">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md mb-2 inline-block">
                  {product.category}
                </span>
                <h2 className="text-lg font-bold mb-1 line-clamp-1">{product.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="font-extrabold text-lg">Rp {product.price.toLocaleString('id-ID')}</span>
                <button 
                  onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, qty: 1 })}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors"
                >
                  Beli
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 text-lg">Waduh, stiker yang kamu cari tidak ditemukan 😢</p>
          </div>
        )}
      </div>

      {/* TOMBOL KERANJANG MENGAMBANG */}
      {totalItems > 0 && (
        <Link href="/checkout" className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform z-50">
          <span className="font-bold">🛒 Lanjut Bayar</span>
          <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        </Link>
      )}
    </main>
  );
}