"use client";
import { useState } from 'react';
import { supabase } from './../lib/supabase';

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleLogin = () => {
    if (pin === '123456') setIsUnlocked(true);
    else alert('PIN Salah!');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Pilih gambar dulu!");

    const fileName = `${Date.now()}_${imageFile.name}`;
    await supabase.storage.from('products').upload(fileName, imageFile);
    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
    
    await supabase.from('products').insert([
      { name, price: Number(price), image_url: publicUrlData.publicUrl }
    ]);
    alert("Produk berhasil diunggah!");
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <input type="password" placeholder="PIN" onChange={(e) => setPin(e.target.value)} className="border p-2 mb-2" />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2">Masuk</button>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Dashboard Admin</h1>
      
      {/* INI ADALAH FORM UPLOAD */}
      <form onSubmit={handleAddProduct} className="flex flex-col gap-4 max-w-sm">
        <input type="text" placeholder="Nama Stiker" onChange={(e) => setName(e.target.value)} className="border p-2" />
        <input type="number" placeholder="Harga" onChange={(e) => setPrice(e.target.value)} className="border p-2" />
        
        {/* INI TOMBOL UPLOADNYA */}
        <label>Pilih Gambar:</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="border p-2" />
        
        <button type="submit" className="bg-green-600 text-white p-3 font-bold">Unggah Produk</button>
      </form>
    </div>
  );
}