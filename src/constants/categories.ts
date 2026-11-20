// src/constants/categories.ts
// Categorías del dominio y sus etiquetas visibles en español.
// La tupla `as const` es la única fuente de verdad de ProductCategory:
// Zod la reutiliza en el schema y el resto de la app re-exporta el tipo.

export const CATEGORIES = [
  'granos',
  'lacteos',
  'carnes',
  'bebidas',
  'verduras',
  'abarrotes',
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  granos: 'Granos',
  lacteos: 'Lácteos',
  carnes: 'Carnes',
  bebidas: 'Bebidas',
  verduras: 'Verduras',
  abarrotes: 'Abarrotes',
};
