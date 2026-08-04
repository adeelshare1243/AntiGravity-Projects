'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Currency, Language, eSIMPackage } from '@/types';

interface ESimContextType {
  cart: CartItem[];
  currency: Currency;
  language: Language;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
  addToCart: (pkg: eSIMPackage, qty?: number) => void;
  removeFromCart: (packageId: string) => void;
  clearCart: () => void;
}

const ESimContext = createContext<ESimContextType | undefined>(undefined);

export function ESimProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('en');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (pkg: eSIMPackage, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.package.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.package.id === pkg.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { package: pkg, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (packageId: string) => {
    setCart((prev) => prev.filter((item) => item.package.id !== packageId));
  };

  const clearCart = () => setCart([]);

  return (
    <ESimContext.Provider
      value={{
        cart,
        currency,
        language,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        setCurrency,
        setLanguage,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </ESimContext.Provider>
  );
}

export function useESim() {
  const ctx = useContext(ESimContext);
  if (!ctx) throw new Error('useESim must be used within ESimProvider');
  return ctx;
}
