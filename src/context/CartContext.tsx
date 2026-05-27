"use client";
import { createContext, useContext, useState } from 'react';

// Tipe data untuk produk di keranjang
type Product = { id: string; name: string; price: number; image_url: string };
type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  totalItems: number;
};

// Membuat wadah penyimpanan
const CartContext = createContext<CartContextType | undefined>(undefined);

// Wadah Utama yang akan membungkus aplikasi
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fungsi menambah barang
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`🛒 Berhasil menambahkan ${product.name} ke keranjang!`);
  };

  // Menghitung total barang di ikon keranjang
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

// Alat bantu untuk memanggil keranjang
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("Gunakan useCart di dalam CartProvider");
  return context;
};