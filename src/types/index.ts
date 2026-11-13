// src/types/index.ts
// Modelos del dominio: distribuidora de comida.
// El estado del servidor (catálogo) vive en TanStack Query;
// el estado del cliente (mi pedido) vive en Zustand.

import type { ImageSourcePropType } from 'react-native';

export type ProductCategory =
  | 'granos'
  | 'lacteos'
  | 'carnes'
  | 'bebidas'
  | 'verduras'
  | 'abarrotes';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number; // COP
  unit: string;
  category: ProductCategory;
  stock: number;
  image: ImageSourcePropType;
}

// Datos que enviamos al servidor para crear un producto.
// El id y la imagen los resuelve la capa de red.
export type CreateItemPayload = Omit<Item, 'id' | 'image'>;
