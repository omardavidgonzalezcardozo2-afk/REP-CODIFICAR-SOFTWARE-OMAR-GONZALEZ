// src/types/index.ts
// Define los tipos de datos del dominio.
// Dominio: distribuidora de alimentos (venta mayorista a tiendas y restaurantes).

// ============================================
// INTERFACE PRINCIPAL DEL DOMINIO
// ============================================

export interface Item {
  // Identificador interno del producto en el catálogo
  id: string;
  // Nombre comercial del producto
  name: string;
  // Descripción general del producto
  description: string;

  // Categoría del producto (Granos, Lácteos, Aceites, etc.)
  category: string;
  // Precio de venta por unidad de venta, en pesos colombianos (COP)
  price: number;
  // Unidad en la que se vende al por mayor (ej. 'Bulto 25 kg', 'Caja x12')
  unit: string;
  // Unidades disponibles en bodega
  stock: number;
  // Proveedor que surte el producto
  supplier: string;
  // Indica si el producto debe mantenerse en cadena de frío
  requiresRefrigeration: boolean;
  // Ruta de imagen local del producto
  image?: number;
}
