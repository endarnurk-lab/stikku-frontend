"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = { id: string; name: string; price: number; qty: number; };
type CartContextType = { 
  cart: CartItem[]; 
  addToCart: (item: CartItem) => void; 
  totalItems: number; 
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  return (
    <CartContext.Provider value={{ cart, addToCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider belum membungkus aplikasi!');
  return context;
}