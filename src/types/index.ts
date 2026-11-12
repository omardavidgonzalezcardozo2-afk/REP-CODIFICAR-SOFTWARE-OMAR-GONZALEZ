// src/types/index.ts
// Modelos del dominio: distribuidora de comida.
// El estado del servidor (productos) vive en TanStack Query;
// el estado del cliente (mi pedido) vive en Zustand.

import type { ImageSourcePropType } from 'react-native';

export type ProductCategory =
  | 'granos'
  | 'lacteos'
  | 'carnes'
  | 'bebidas'
  | 'verduras'
  | 'abarrotes';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // COP
  unit: string;
  category: ProductCategory;
  stock: number;
  image: ImageSourcePropType;
}

// Lo que enviamos al servidor para crear un producto.
// El id y la imagen los asigna el servidor (o los resolvemos en la capa API).
export type CreateProductPayload = Omit<Product, 'id' | 'image'>;
