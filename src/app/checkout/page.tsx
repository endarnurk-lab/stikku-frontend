"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const sendToWhatsApp = () => {
    if (!nama || !wa) {
      alert("Mohon isi Nama dan Nomor WhatsApp terlebih dahulu!");
      return;
    }

    const orderDetails = cart.map(item => `• ${item.qty}x ${item.name}`).join('\n');
    const message = `Halo Admin Stikku! Saya ingin memesan stiker:\n\n*Nama:* ${nama}\n*WhatsApp:* ${wa}\n\n*Pesanan:*\n${orderDetails}\n\n*Total:* Rp ${subTotal.toLocaleString('id-ID')}`;
    
    const waUrl = `https://wa.me/6289519528951?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-6">Selesaikan Pesanan</h1>
        
        {/* FORM IDENTITAS */}
        <div className="space-y-4 mb-6">
          <input 
            type="text" placeholder="Nama Lengkap" 
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setNama(e.target.value)}
          />
          <input 
            type="text" placeholder="Nomor WhatsApp" 
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setWa(e.target.value)}
          />
        </div>
        
        {/* RINGKASAN */}
        <div className="space-y-4 mb-8 border-t pt-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.qty}x {item.name}</span>
              <span className="font-bold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between text-xl font-black pt-2">
            <span>Total</span>
            <span className="text-blue-600">Rp {subTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button 
          onClick={sendToWhatsApp}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition"
        >
          Pesan via WhatsApp 💬
        </button>
      </div>
    </main>
  );
}