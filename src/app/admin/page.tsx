"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Pastikan path import supabase Anda benar

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // State untuk form input
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fungsi Login
  const handleLogin = () => {
    if (pin === '123456') { // Ganti PIN Anda di sini
      setIsUnlocked(true);
    } else {
      alert('PIN Salah!');
    }
  };

  // Fungsi Tambah Produk
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
        alert("Pilih gambar dulu!");
        setLoading(false);
        return;
    }

    // 1. Upload Gambar ke Storage
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);

    if (uploadError) {
        alert("Gagal upload gambar: " + uploadError.message);
        setLoading(false);
        return;
    }

    // 2. Ambil URL Gambar
    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
    
    // 3. Simpan ke database
    const { error } = await supabase.from('products').insert([
        { name, price: Number(price), image_url: publicUrlData.publicUrl }
    ]);

    if (error) {
        alert("Gagal simpan data: " + error.message);
    } else {
        alert("Produk berhasil ditambahkan!");
        setName('');
        setPrice('');
        setImageFile(null);
    }
    setLoading(false);
  };

  // Tampilan Gembok (PIN)
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
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

  // Tampilan Dashboard (Setelah Login)
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button onClick={() => setIsUnlocked(false)} className="text-red-500 font-bold">Keluar 🔒</button>
      </div>

      {/* FORM INPUT PRODUK */}
      <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-2xl shadow border space-y-4">
        <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
        <input required type="text" placeholder="Nama Stiker" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        <input required type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <input required type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded" />
        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">
            {loading ? "Mengunggah..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
}