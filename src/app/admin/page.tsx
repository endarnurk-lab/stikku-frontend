"use client";
import { useState } from 'react';

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Jika PIN benar, buka gembok
  const handleLogin = () => {
    if (pin === '123456') { // Ganti PIN Anda di sini
      setIsUnlocked(true);
    } else {
      alert('PIN Salah!');
    }
  };

  // Tampilan Gembok (Sebelum Login)
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4">🔐 Area Admin</h1>
          <input 
            type="password" 
            className="w-full p-3 border rounded-xl mb-4 text-center text-xl" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            placeholder="Masukkan PIN"
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Masuk</button>
        </div>
      </div>
    );
  }

  // Tampilan Dashboard (Setelah Login - FORM TAMBAH PRODUK MUNCUL DI SINI)
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button onClick={() => setIsUnlocked(false)} className="text-red-500 font-bold">Keluar 🔒</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
        {/* Tambahkan form input produk Anda di sini */}
        <p className="text-gray-500">Silakan masukkan detail stiker di bawah...</p>
      </div>
    </div>
  );
}