"use client";

import { useState } from 'react';
// Pastikan folder lib ada di folder src, sehingga alamatnya adalah ../../lib/supabase
import { supabase } from './../lib/supabase'; 

type ProductType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url?: string;
};

export default function AdminDashboard() {
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [products, setProducts] = useState<ProductType[]>([]);
  
  // Fungsi untuk buka gembok
  const handleLogin = () => {
    if (pinInput === '123456') { // Ganti PIN Anda di sini
      setIsLocked(false);
      fetchProducts();
    } else {
      alert('PIN Salah!');
    }
  };

  // Ambil data produk
  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data as ProductType[]);
  }

  // Tampilan layar kunci
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">🔒 Area Admin</h1>
          <input 
            type="password" 
            className="w-full p-3 border rounded-lg mb-4 text-center text-xl tracking-widest" 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value)} 
            placeholder="Masukkan PIN"
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            Buka Gembok
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Dashboard asli
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Selamat Datang, Admin</h1>
      <button onClick={() => setIsLocked(true)} className="mb-4 bg-red-500 text-white px-4 py-2 rounded">
        Keluar (Kunci)
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-lg">
            <h2 className="font-bold">{p.name}</h2>
            <p>Rp {p.price.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}