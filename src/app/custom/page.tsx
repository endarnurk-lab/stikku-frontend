"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CustomCreator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [material, setMaterial] = useState('Vinyl Standard');
  const [quantity, setQuantity] = useState(10);

  const basePrice = material === 'Holografik' ? 5000 : 2500;
  const totalPrice = basePrice * quantity;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <main className="min-h-screen p-8 bg-white text-gray-900">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Custom Creator.</h1>
          <p className="text-gray-600">Wujudkan desain stiker impianmu.</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Kembali ke Katalog
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Area Preview */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-[300px]" />
              <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6">X</button>
            </div>
          ) : (
            <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
              Unggah Gambar
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {/* Panel Pengaturan */}
        <div className="bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Spesifikasi</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bahan Stiker</label>
              <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full p-3 rounded-lg border">
                <option value="Vinyl Standard">Vinyl Standard</option>
                <option value="Holografik">Holografik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Jumlah (Pcs)</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-3 rounded-lg border" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">Estimasi Harga</p>
            <p className="text-3xl font-bold text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>

          <button className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </main>
  );
}