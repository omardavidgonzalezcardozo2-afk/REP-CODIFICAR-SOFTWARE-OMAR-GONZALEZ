// src/storage/itemsCache.ts
// Caché del catálogo en AsyncStorage para poder mostrar productos sin red.
// Solo datos públicos del dominio (Item): jamás secretos ni credenciales.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

import { CATEGORIES, type ProductCategory } from '../constants/categories';
import type { Item } from '../types';

export const ITEMS_CACHE_KEY = '@distribuidora/items_cache_v1';

const FALLBACK_IMAGE: ImageSourcePropType = require('../../assets/products/arroz.jpg');

function isProductCategory(value: string): value is ProductCategory {
  return (CATEGORIES as readonly string[]).includes(value);
}

function hasUri(image: unknown): image is { uri: string } {
  if (typeof image !== 'object' || image === null) return false;
  const uri = (image as { uri?: unknown }).uri;
  return typeof uri === 'string' && uri.length > 0;
}

// Valida cada objeto leído y garantiza que siempre haya una imagen mostrable.
function toCachedItem(value: unknown): Item | null {
  if (typeof value !== 'object' || value === null) return null;

  const candidate = value as Partial<Item>;
  if (
    typeof candidate.id !== 'number' ||
    typeof candidate.name !== 'string' ||
    typeof candidate.description !== 'string' ||
    typeof candidate.price !== 'number' ||
    typeof candidate.unit !== 'string' ||
    typeof candidate.category !== 'string' ||
    !isProductCategory(candidate.category) ||
    typeof candidate.stock !== 'number'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    description: candidate.description,
    price: candidate.price,
    unit: candidate.unit,
    category: candidate.category,
    stock: candidate.stock,
    image: hasUri(candidate.image) ? candidate.image : FALLBACK_IMAGE,
  };
}

export async function saveItemsCache(items: Item[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_CACHE_KEY, JSON.stringify(items));
  } catch {
    // Si no hay espacio o el almacenamiento falla, la app sigue funcionando
    // con TanStack Query: la caché local es solo un respaldo.
  }
}

export async function loadItemsCache(): Promise<Item[] | null> {
  try {
    const raw = await AsyncStorage.getItem(ITEMS_CACHE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed
      .map(toCachedItem)
      .filter((item): item is Item => item !== null);
  } catch {
    return null;
  }
}

export async function clearItemsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ITEMS_CACHE_KEY);
  } catch {
    // No hay nada que hacer si no se puede borrar el respaldo.
  }
}
