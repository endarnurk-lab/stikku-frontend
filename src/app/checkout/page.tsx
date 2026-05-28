"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

// Memberitahu TypeScript bahwa Midtrans 'snap' itu ada
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: object) => void;
    };
  }
}

export default function CheckoutPage() {
  const { cart, decreaseQuantity, addToCart, removeFromCart } = useCart();
  const [nama, setNama] = useState('');
  const [loadingPay, setLoadingPay] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // EFEK SAMPING: Memuat script Midtrans secara aman tanpa error JSX Next.js
  // EFEK SAMPING: Memuat script Midtrans secara aman tanpa error JSX Next.js
  useEffect(() => {
    // SAYA MENGHAPUS KATA 'sandbox.' DI BAWAH INI
    const snapScript = "https://app.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Bersihkan saat pindah halaman
    }
  }, []);

  const handlePayment = async () => {
    if (!nama) {
      alert("Mohon isi Nama Anda terlebih dahulu.");
      return;
    }

    setLoadingPay(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: nama, total: subTotal }),
      });

      const data = await response.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function() {
            setIsSuccess(true);
            setLoadingPay(false);
          },
          onPending: function() {
            alert("Menunggu pembayaran Anda...");
            setLoadingPay(false);
          },
          onError: function() {
            alert("Pembayaran gagal. Silakan coba lagi.");
            setLoadingPay(false);
          },
          onClose: function() {
            setLoadingPay(false);
          }
        });
      } else {
        alert("Gagal terhubung ke sistem pembayaran.");
        setLoadingPay(false);
      }
    } catch {
      alert("Terjadi kesalahan sistem.");
      setLoadingPay(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg border max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black mb-2 text-green-600">Pembayaran Berhasil!</h1>
          <p className="text-gray-500 mb-8">Terima kasih, <b>{nama}</b>. Pesanan stiker digital Anda sudah siap diunduh.</p>
          
          <div className="space-y-4">
            <a href="https://drive.google.com/drive/folders/CONTOH_LINK_ANDA" target="_blank" rel="noreferrer" className="block w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
              📥 Download File Stiker Sekarang
            </a>
            <Link href="/" className="block w-full bg-slate-100 text-slate-600 px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Keranjangnya Masih Kosong</h1>
          <Link href="/" className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-6">Selesaikan Pesanan</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Nama Pembeli</label>
          <input type="text" placeholder="Masukkan nama Anda..." className="w-full p-4 border rounded-xl focus:border-blue-500 focus:outline-none bg-slate-50" onChange={(e) => setNama(e.target.value)} />
        </div>

        <div className="space-y-4 mb-8 border-t border-slate-100 pt-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="font-bold text-slate-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 font-bold">-</button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-8 h-8 font-bold">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-rose-500 text-sm font-semibold">🗑️ Hapus</button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between text-xl font-black pt-2 mt-4">
            <span>Total Bayar</span>
            <span className="text-blue-600">Rp {subTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loadingPay}
          className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg ${loadingPay ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-600 shadow-slate-900/20'}`}
        >
          {loadingPay ? 'Memproses Sistem Bank...' : '🔒 Bayar Sekarang'}
        </button>
      </div>
    </main>
  );
}