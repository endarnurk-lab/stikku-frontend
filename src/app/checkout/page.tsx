"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  // MENGAMBIL FUNGSI BARU DARI CART CONTEXT
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const sendToWhatsApp = () => {
    if (!nama || !wa) {
      alert("Mohon isi Nama Lengkap dan Nomor WhatsApp terlebih dahulu.");
      return;
    }

    const orderDetails = cart.map(item => `- ${item.quantity}x ${item.name}`).join('\n');
    const message = `Halo Admin Stikku! Saya ingin memesan stiker:\n\n*Nama:* ${nama}\n*WhatsApp:* ${wa}\n\n*Pesanan:*\n${orderDetails}\n\n*Total:* Rp ${subTotal.toLocaleString('id-ID')}`;
    
    const waUrl = `https://wa.me/6289519528951?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Keranjangnya Masih Kosong</h1>
          <p className="text-gray-500 mb-6">Yuk pilih stiker favoritmu dulu!</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-6">Selesaikan Pesanan</h1>
        
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 border rounded-xl focus:border-blue-500 focus:outline-none bg-slate-50"
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nomor WhatsApp"
            className="w-full p-3 border rounded-xl focus:border-blue-500 focus:outline-none bg-slate-50"
            onChange={(e) => setWa(e.target.value)}
          />
        </div>

        <div className="space-y-4 mb-8 border-t border-slate-100 pt-4">
          {/* DAFTAR PRODUK DENGAN TOMBOL KELOLA */}
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="font-bold text-slate-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Tombol Plus Minus */}
                <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 transition-colors font-bold">-</button>
                  <span className="w-8 text-center text-sm font-bold text-slate-700">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 transition-colors font-bold">+</button>
                </div>

                {/* Tombol Hapus */}
                <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors text-sm font-semibold flex items-center gap-1">
                  <span>🗑️</span> Hapus
                </button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between text-xl font-black pt-2 mt-4">
            <span>Total</span>
            <span className="text-blue-600">Rp {subTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button 
          onClick={sendToWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30"
        >
          Kirim Pesanan via WhatsApp
        </button>
      </div>
    </main>
  );
}