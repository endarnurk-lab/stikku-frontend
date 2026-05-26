"use client";
import { useState } from 'react';

export default function AdminLock() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleLogin = () => {
    if (pin === '123456') { // PIN ANDA
      setIsUnlocked(true);
    } else {
      alert('PIN Salah!');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Gembok Admin</h1>
        <input 
          type="password" 
          className="p-2 border rounded mb-4" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          placeholder="Masukkan PIN"
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded">Buka</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1>Selamat Datang Admin</h1>
      {/* Tambahkan isi dashboard asli Anda di sini nanti */}
    </div>
  );
}