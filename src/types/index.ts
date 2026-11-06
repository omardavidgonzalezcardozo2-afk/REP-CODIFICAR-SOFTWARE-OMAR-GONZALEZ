import type { ImageSourcePropType } from 'react-native';

export type ProductCategory = 'granos' | 'lacteos' | 'carnes' | 'bebidas' | 'verduras';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number; // COP
  unit: string;
  category: ProductCategory;
  stock: number;
  image: ImageSourcePropType;
}
