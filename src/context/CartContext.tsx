"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Product = { id: string; name: string; price: number; image_url: string };
type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (id: string) => void; // FITUR BARU: Kurangi 1
  removeFromCart: (id: string) => void;   // FITUR BARU: Hapus total
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Menambah barang (atau nambah qty jika sudah ada)
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Mengurangi kuantitas barang (minimal 1)
  const decreaseQuantity = (id: string) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  // Menghapus barang dari keranjang sepenuhnya
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("Gunakan useCart di dalam CartProvider");
  return context;
};