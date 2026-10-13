'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  quantity: number;
  image: string;
  variationId?: number;
  variationName?: string;
  sku?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number, variationId?: number) => void;
  updateQuantity: (id: number, variationId: number | undefined, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  tierSavings: number;
  calculateTotal: (shippingFee?: number, paymentMethod?: string) => {
    subtotal: number;
    tierSavings: number;
    cashAppDiscount: number;
    shipping: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biotech_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed reading cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('biotech_cart', JSON.stringify(items));
      } catch (e) {
        console.warn('Failed saving cart to localStorage', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.variationId === item.variationId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    setIsOpen(true);
  };

  const removeItem = (id: number, variationId?: number) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.variationId === variationId))
    );
  };

  const updateQuantity = (id: number, variationId: number | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, variationId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.variationId === variationId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Calculate volume discount:
  // 5-9 units: 5% off
  // 10+ units: 10% off
  let subtotal = 0;
  let tierSavings = 0;

  for (const item of items) {
    const rawPrice = item.price * item.quantity;
    let discountPct = 0;
    if (item.quantity >= 10) {
      discountPct = 0.10;
    } else if (item.quantity >= 5) {
      discountPct = 0.05;
    }
    const savings = rawPrice * discountPct;
    tierSavings += savings;
    subtotal += (rawPrice - savings);
  }

  const calculateTotal = (shippingFee = 11.25, paymentMethod = 'creditcard') => {
    let finalSub = subtotal;
    let cashAppDiscount = 0;
    if (paymentMethod === 'cashapp') {
      cashAppDiscount = finalSub * 0.04; // 4% off on CashApp
    }
    const total = Math.max(0, finalSub - cashAppDiscount + shippingFee);

    return {
      subtotal: Number(finalSub.toFixed(2)),
      tierSavings: Number(tierSavings.toFixed(2)),
      cashAppDiscount: Number(cashAppDiscount.toFixed(2)),
      shipping: shippingFee,
      total: Number(total.toFixed(2)),
    };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        itemCount,
        subtotal,
        tierSavings,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
