"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type CartLine = {
  variantId: string;
  slug: string;
  title: string;
  color: string;
  size: string;
  price: number;
  gradient: string;
  silhouette: string;
  qty: number;
  maxQty: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[]; // product slugs
  cartOpen: boolean;
};

type ShopContextValue = ShopState & {
  addToCart: (line: Omit<CartLine, "qty"> & { qty: number }) => void;
  removeFromCart: (variantId: string) => void;
  setCartQty: (variantId: string, qty: number) => void;
  toggleWishlist: (slug: string) => void;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
  cartSubtotal: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);
const STORAGE_KEY = "rlb-shop-state";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>({ cart: [], wishlist: [], cartOpen: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, cart: parsed.cart || [], wishlist: parsed.wishlist || [] }));
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    } catch {
      // storage may be unavailable (private browsing) — cart still works in-memory
    }
  }, [state.cart, state.wishlist, hydrated]);

  const value = useMemo<ShopContextValue>(() => {
    const addToCart: ShopContextValue["addToCart"] = (line) => {
      setState((s) => {
        const existing = s.cart.find((l) => l.variantId === line.variantId);
        const cart = existing
          ? s.cart.map((l) => (l.variantId === line.variantId ? { ...l, qty: Math.min(l.maxQty, l.qty + line.qty) } : l))
          : [...s.cart, line];
        return { ...s, cart, cartOpen: true };
      });
    };
    const removeFromCart = (variantId: string) => setState((s) => ({ ...s, cart: s.cart.filter((l) => l.variantId !== variantId) }));
    const setCartQty = (variantId: string, qty: number) =>
      setState((s) => ({
        ...s,
        cart: s.cart.map((l) => (l.variantId === variantId ? { ...l, qty: Math.max(1, Math.min(l.maxQty, qty)) } : l)),
      }));
    const toggleWishlist = (slug: string) =>
      setState((s) => ({
        ...s,
        wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug],
      }));
    const openCart = () => setState((s) => ({ ...s, cartOpen: true }));
    const closeCart = () => setState((s) => ({ ...s, cartOpen: false }));

    return {
      ...state,
      addToCart,
      removeFromCart,
      setCartQty,
      toggleWishlist,
      openCart,
      closeCart,
      cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
      cartSubtotal: state.cart.reduce((sum, l) => sum + l.price * l.qty, 0),
    };
  }, [state]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
