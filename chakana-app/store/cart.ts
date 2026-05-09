import { useEffect, useState } from 'react';

export interface CartEntry {
  id: string;
  title: string;
  type: string;
  price: number; // in Aurios
  qty: number;
  image: ReturnType<typeof require>;
}

// ── Module-level store ────────────────────────────────────────
const state = { items: [] as CartEntry[] };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export const cartStore = {
  getItems:  ()         => state.items,
  getCount:  ()         => state.items.reduce((s, i) => s + i.qty, 0),
  getTotal:  ()         => state.items.reduce((s, i) => s + i.price * i.qty, 0),
  getQty:    (id: string) => state.items.find(i => i.id === id)?.qty ?? 0,

  add(entry: Omit<CartEntry, 'qty'>) {
    const existing = state.items.find(i => i.id === entry.id);
    if (existing) existing.qty += 1;
    else state.items.push({ ...entry, qty: 1 });
    notify();
  },

  remove(id: string) {
    const existing = state.items.find(i => i.id === id);
    if (!existing) return;
    if (existing.qty > 1) existing.qty -= 1;
    else state.items = state.items.filter(i => i.id !== id);
    notify();
  },

  clear() {
    state.items = [];
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// ── Hook ─────────────────────────────────────────────────────
export function useCart() {
  const [, rerender] = useState(0);
  useEffect(() => cartStore.subscribe(() => rerender(n => n + 1)), []);
  return cartStore;
}
