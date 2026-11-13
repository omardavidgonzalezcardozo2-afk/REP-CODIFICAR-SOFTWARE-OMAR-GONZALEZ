// src/constants/categories.ts
// Categorías del dominio y sus etiquetas visibles en español.

import type { ProductCategory } from '../types';

export const CATEGORIES: ProductCategory[] = [
  'granos',
  'lacteos',
  'carnes',
  'bebidas',
  'verduras',
  'abarrotes',
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  granos: 'Granos',
  lacteos: 'Lácteos',
  carnes: 'Carnes',
  bebidas: 'Bebidas',
  verduras: 'Verduras',
  abarrotes: 'Abarrotes',
};
