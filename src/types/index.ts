// src/types/index.ts
// Modelos del dominio: distribuidora de comida.
// El estado del servidor (catálogo) vive en TanStack Query;
// el estado del cliente (mi pedido) vive en Zustand;
// el estado del formulario vive en React Hook Form + Zod.

import type { ImageSourcePropType } from 'react-native';

import type { ProductCategory } from '../constants/categories';
import type { ItemFormData } from '../schemas/itemSchema';

// Re-exportamos el tipo para que los imports existentes no cambien.
export type { ProductCategory };

// ============================================================
// MODELO DEL SERVIDOR / DOMINIO
// ============================================================

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

// ============================================================
// PAYLOADS DE LOS FORMULARIOS (tipos inferidos del schema)
// ============================================================

// Datos validados que enviamos al servidor para crear un producto.
// El id y la imagen los resuelve la capa de red.
export type CreateItemPayload = ItemFormData;

// Para editar necesitamos además el id del producto existente.
export type UpdateItemPayload = ItemFormData & { id: number };
