"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
};

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single(); // Mengambil 1 data spesifik

      if (!error && data) {
        setProduct(data as ProductType);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse text-lg">Membuka detail stiker...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-5xl mb-4">🕵️‍♂️</div>
        <h1 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h1>
        <Link href="/" className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
          <span>←</span> Kembali ke Koleksi
        </Link>

        {/* Kartu Detail Produk */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Bagian Kiri: Gambar Besar */}
          <div className="md:w-1/2 bg-slate-100 relative aspect-square md:aspect-auto">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="w-full h-full absolute inset-0 flex items-center justify-center text-slate-400">No Image</div>
            )}
          </div>

          {/* Bagian Kanan: Informasi Produk */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col">
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1 rounded-full w-max mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="w-16 h-1 bg-slate-200 mb-6 rounded-full"></div>
            
            <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
              {product.description || "Stiker premium berkualitas tinggi dengan daya rekat kuat dan tahan air. Cocok untuk laptop, jurnal, dan gadget kesayangan Anda."}
            </p>
            
            <div className="mt-auto">
              <p className="text-sm text-slate-500 mb-1">Harga Stiker</p>
              <div className="text-4xl font-black text-slate-900 mb-6">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3 text-lg"
              >
                <span>🛒</span> Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}