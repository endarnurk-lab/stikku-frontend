"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Product = { id: string; name: string; price: number; image_url: string };
type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Memori untuk teks notifikasi

  // Fungsi untuk memunculkan notifikasi yang hilang sendiri dalam 3 detik
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); 
  };

  // Menambah barang
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Panggil notifikasi saat berhasil ditambah
    showToast(`✨ ${product.name} berhasil ditambahkan!`); 
  };

  // Mengurangi kuantitas
  const decreaseQuantity = (id: string) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  // Menghapus barang
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    // Panggil notifikasi saat barang dihapus
    showToast(`🗑️ Barang dihapus dari keranjang`); 
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, totalItems }}>
      {children}
      
      {/* UI NOTIFIKASI TOAST (Muncul melayang di pojok kanan bawah) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-[9999] flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-xl">🛒</span>
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("Gunakan useCart di dalam CartProvider");
  return context;
};