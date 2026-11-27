// src/stores/offlineStore.ts
// Estado de cliente que indica si la lista visible viene de AsyncStorage.
// Es informativo: no cambia la forma de datos de useItems (sigue siendo Item[]).

import { create } from 'zustand';

interface OfflineStore {
  isFromCache: boolean;
  setFromCache: (value: boolean) => void;
}

export const useOfflineStore = create<OfflineStore>((set) => ({
  isFromCache: false,
  setFromCache: (value) => set({ isFromCache: value }),
}));
