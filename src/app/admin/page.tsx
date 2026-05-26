"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // <--- INI YANG KURANG

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function AdminDashboard() {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');

  const handleLogin = () => {
    if (pin === '123456') {
      setIsLocked(false);
      fetchData();
    } else {
      alert('PIN Salah!');
    }
  };

  async function fetchData() {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  }

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="mb-4 font-bold">Area Admin Terkunci</h1>
        <input 
          type="password" 
          placeholder="Masukkan PIN" 
          onChange={(e) => setPin(e.target.value)} 
          className="border p-2 mb-4 rounded" 
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded">
          Masuk
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6 flex gap-2">
        <input placeholder="Nama" onChange={(e) => setName(e.target.value)} className="border p-1" />
        <input placeholder="Harga" type="number" onChange={(e) => setPrice(e.target.value)} className="border p-1" />
        <input placeholder="Deskripsi" onChange={(e) => setDesc(e.target.value)} className="border p-1" />
        <button onClick={async () => {
          await supabase.from('products').insert([{ name, price: Number(price), description: desc }]);
          fetchData();
        }} className="bg-green-600 text-white px-4 py-2 rounded">Tambah</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Harga</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">Rp {p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}