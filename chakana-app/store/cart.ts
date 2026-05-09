import { create } from 'zustand';

export interface CartEntry {
  id: string;
  businessId: string;
  title: string;
  type: string;
  price: number; // in USD
  qty: number;
  image?: string | ReturnType<typeof require> | null;
}

interface CartState {
  items: CartEntry[];
  add: (entry: Omit<CartEntry, 'qty'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  add: (entry) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === entry.id);
      if (existing) {
        return { items: s.items.map((i) => i.id === entry.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { items: [...s.items, { ...entry, qty: 1 }] };
    }),

  remove: (id) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === id);
      if (!existing) return s;
      if (existing.qty > 1) {
        return { items: s.items.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i) };
      }
      return { items: s.items.filter((i) => i.id !== id) };
    }),

  clear: () => set({ items: [] }),
}));

// Derived selectors
export const useCartItems  = () => useCartStore((s) => s.items);
export const useCartCount  = () => useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
export const useCartTotal  = () => useCartStore((s) => s.items.reduce((t, i) => t + i.price * i.qty, 0));
export const useItemQty    = (id: string) => useCartStore((s) => s.items.find((i) => i.id === id)?.qty ?? 0);
