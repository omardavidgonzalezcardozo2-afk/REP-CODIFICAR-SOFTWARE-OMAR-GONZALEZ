// src/schemas/itemSchema.ts
// Schema Zod del formulario de productos de la distribuidora.
// Es la única fuente de verdad: los tipos del formulario se inferen de aquí
// (sin interfaces manuales que puedan quedar desincronizadas).

import { z } from 'zod';

import { CATEGORIES } from '../constants/categories';

// ============================================================
// SCHEMA
// ============================================================

export const itemSchema = z.object({
  name: z.string().trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'Máximo 80 caracteres'),
  description: z.string().trim().max(500, 'Máximo 500 caracteres'),
  price: z.coerce
    .number({ message: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor que 0'),
  stock: z.coerce
    .number({ message: 'Las existencias deben ser un número' })
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  unit: z.string().trim()
    .min(1, 'La unidad es obligatoria')
    .max(30, 'Máximo 30 caracteres'),
  category: z.enum(CATEGORIES, { message: 'Selecciona una categoría' }),
});

// Tipo inferido del schema: única fuente de verdad (sin interfaz manual).
export type ItemFormData = z.infer<typeof itemSchema>;

// Tipo de entrada del formulario: los campos z.coerce reciben texto del
// TextInput, así que `price` y `stock` llegan como texto (`unknown` en Zod 4).
export type ItemFormInput = z.input<typeof itemSchema>;
