// src/hooks/usePreferences.ts
// Preferencias del catálogo persistidas en MMKV.
// Los hooks de MMKV suscriben la UI: cada cambio se ve al instante,
// por eso la pantalla de Ajustes no necesita botón de guardar.

import { useCallback } from 'react';
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

import { storage } from '../storage/mmkv';

// Todas las claves en un solo lugar: evita strings sueltos y errores de tipeo.
export const PREFERENCE_KEYS = {
  sortBy: 'pref_sortBy',
  sortOrder: 'pref_sortOrder',
  compactMode: 'pref_compactMode',
  itemsPerPage: 'pref_itemsPerPage',
} as const;

export type SortBy = 'name' | 'price' | 'stock';
export type SortOrder = 'asc' | 'desc';
export type ItemsPerPage = 5 | 10 | 20;

const SORT_BY_VALUES: readonly SortBy[] = ['name', 'price', 'stock'];
const SORT_ORDER_VALUES: readonly SortOrder[] = ['asc', 'desc'];
const ITEMS_PER_PAGE_VALUES: readonly ItemsPerPage[] = [5, 10, 20];

const DEFAULT_SORT_BY: SortBy = 'name';
const DEFAULT_SORT_ORDER: SortOrder = 'asc';
const DEFAULT_COMPACT_MODE = false;
const DEFAULT_ITEMS_PER_PAGE: ItemsPerPage = 10;

// Si el valor leído no pertenece a la lista permitida, usamos el default.
function isAllowed<T extends string | number>(
  value: string | number | undefined,
  allowed: readonly T[],
): value is T {
  return value !== undefined && (allowed as readonly (string | number)[]).includes(value);
}

export function usePreferences() {
  const [storedSortBy, setStoredSortBy] = useMMKVString(
    PREFERENCE_KEYS.sortBy,
    storage,
  );
  const [storedSortOrder, setStoredSortOrder] = useMMKVString(
    PREFERENCE_KEYS.sortOrder,
    storage,
  );
  const [storedCompactMode, setStoredCompactMode] = useMMKVBoolean(
    PREFERENCE_KEYS.compactMode,
    storage,
  );
  const [storedItemsPerPage, setStoredItemsPerPage] = useMMKVNumber(
    PREFERENCE_KEYS.itemsPerPage,
    storage,
  );

  const sortBy = isAllowed<SortBy>(storedSortBy, SORT_BY_VALUES)
    ? storedSortBy
    : DEFAULT_SORT_BY;
  const sortOrder = isAllowed<SortOrder>(storedSortOrder, SORT_ORDER_VALUES)
    ? storedSortOrder
    : DEFAULT_SORT_ORDER;
  const compactMode = storedCompactMode ?? DEFAULT_COMPACT_MODE;
  const itemsPerPage = isAllowed<ItemsPerPage>(
    storedItemsPerPage,
    ITEMS_PER_PAGE_VALUES,
  )
    ? storedItemsPerPage
    : DEFAULT_ITEMS_PER_PAGE;

  // Setters tipados: la UI solo puede escribir valores válidos.
  const setSortBy = useCallback(
    (value: SortBy) => setStoredSortBy(value),
    [setStoredSortBy],
  );
  const setSortOrder = useCallback(
    (value: SortOrder) => setStoredSortOrder(value),
    [setStoredSortOrder],
  );
  const setCompactMode = useCallback(
    (value: boolean) => setStoredCompactMode(value),
    [setStoredCompactMode],
  );
  const setItemsPerPage = useCallback(
    (value: ItemsPerPage) => setStoredItemsPerPage(value),
    [setStoredItemsPerPage],
  );

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  };
}
