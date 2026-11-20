// src/stores/cartStore.ts
// Estado del CLIENTE: los productos que el usuario agregó a su pedido.
// No guardamos aquí productos del servidor ni estados de carga:
// eso es responsabilidad de TanStack Query.

import { create } from 'zustand';

import type { Item } from '../types';

interface CartStore {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
  isItemSaved: (id: number) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    if (get().items.some((savedItem) => savedItem.id === item.id)) return;
    set((state) => ({ items: [...state.items, item] }));
  },

  // Si el producto editado ya está en el pedido, reemplazamos su copia
  // para que "Mi pedido" muestre los datos nuevos (precio, unidad, etc.).
  updateItem: (item) =>
    set((state) => ({
      items: state.items.map((savedItem) =>
        savedItem.id === item.id ? item : savedItem,
      ),
    })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  clearAll: () => set({ items: [] }),

  isItemSaved: (id) => get().items.some((item) => item.id === id),
}));
