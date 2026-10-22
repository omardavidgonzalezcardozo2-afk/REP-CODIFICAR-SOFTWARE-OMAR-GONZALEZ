// Tipos del dominio: distribuidora de alimentos

export type ProductCategory =
  | 'lácteos'
  | 'carnes'
  | 'granos'
  | 'bebidas'
  | 'frutas y verduras'
  | 'snacks';

export interface Item {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  /** Precio por unidad de venta, en COP */
  price: number;
  /** Presentación: caja, bulto, etc. */
  unit: string;
  stock: number;
}