"use client";
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Toko */}
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter hover:scale-105 transition-transform">
          STIKKU.
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            Area Admin
          </Link>
          
          {/* Ikon Keranjang */}
          <button className="relative bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-all cursor-pointer">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}