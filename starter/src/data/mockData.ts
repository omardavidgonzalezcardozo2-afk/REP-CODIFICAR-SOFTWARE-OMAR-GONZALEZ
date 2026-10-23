// src/data/mockData.ts
// Datos de prueba del catálogo de una distribuidora de alimentos.
// Los precios están en pesos colombianos (COP) y corresponden a la
// unidad de venta mayorista indicada en cada producto.

import type { Item } from '../types';

export const PRODUCT_IMAGES: Record<string, number> = {
  // Imagen principal del producto (se carga localmente con require)
  '1': require('../../assets/products/arroz.jpg'),
  '2': require('../../assets/products/aceite.jpg'),
  '3': require('../../assets/products/leche.jpg'),
  '4': require('../../assets/products/atun.jpg'),
  '5': require('../../assets/products/huevos.jpg'),
  '6': require('../../assets/products/azucar.jpg'),
  '7': require('../../assets/products/pasta.jpg'),
  '8': require('../../assets/products/panela.jpg'),
};

// ============================================
// LISTA PRINCIPAL DE ELEMENTOS
// ============================================

export const ITEMS: Item[] = [
  {
    id: '1',
    name: 'Arroz Diana Premium 25 kg',
    description:
      'Arroz blanco de grano largo, ideal para restaurantes y tiendas de barrio.',
    category: 'Granos',
    price: 132000,
    unit: 'Bulto 25 kg',
    stock: 45,
    supplier: 'Arroz Diana S.A.S.',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['1'],
  },
  {
    id: '2',
    name: 'Aceite de girasol Premier 1 L',
    description:
      'Aceite vegetal para cocina, presentación de litro en caja por seis botellas.',
    category: 'Aceites',
    price: 54000,
    unit: 'Caja x 6 botellas',
    stock: 30,
    supplier: 'Aceites del Valle S.A.S.',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['2'],
  },
  {
    id: '3',
    name: 'Leche UHT Alquería entera 1 L',
    description:
      'Leche entera ultrapasteurizada, larga vida, en caja de doce unidades.',
    category: 'Lácteos',
    price: 66000,
    unit: 'Caja x 12',
    stock: 18,
    supplier: 'Alquería S.A.',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['3'],
  },
  {
    id: '4',
    name: 'Atún Van Camp\'s en agua 170 g',
    description:
      'Atún en lata listo para consumo, caja de veinticuatro unidades.',
    category: 'Enlatados',
    price: 84000,
    unit: 'Caja x 24',
    stock: 60,
    supplier: 'Van Camp\'s Colombia',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['4'],
  },
  {
    id: '5',
    name: 'Huevos AA cubeta x 30',
    description:
      'Huevos frescos tamaño AA, empacados en cubeta para distribución.',
    category: 'Huevos y proteínas',
    price: 17500,
    unit: 'Cubeta x 30',
    stock: 24,
    supplier: 'Avícola San Isidro',
    requiresRefrigeration: true,
    image: PRODUCT_IMAGES['5'],
  },
  {
    id: '6',
    name: 'Azúcar Manuelita 25 kg',
    description:
      'Azúcar refinada para panaderías, restaurantes y tiendas.',
    category: 'Endulzantes',
    price: 125000,
    unit: 'Bulto 25 kg',
    stock: 12,
    supplier: 'Ingenio Manuelita S.A.',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['6'],
  },
  {
    id: '7',
    name: 'Pasta Doria espagueti 500 g',
    description:
      'Espagueti de sémola de trigo, caja de veinte paquetes de 500 gramos.',
    category: 'Pastas',
    price: 46000,
    unit: 'Caja x 20',
    stock: 8,
    supplier: 'Pastas Doria S.A.',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['7'],
  },
  {
    id: '8',
    name: 'Panela pulverizada 25 kg',
    description:
      'Panela granulada de caña, insumo para bebidas y repostería.',
    category: 'Endulzantes',
    price: 98000,
    unit: 'Bulto 25 kg',
    stock: 22,
    supplier: 'Panela del Occidente',
    requiresRefrigeration: false,
    image: PRODUCT_IMAGES['8'],
  },
];

// ============================================
// LISTA DE FAVORITOS
// ============================================
// Subconjunto de productos que representan los pedidos frecuentes
// de los clientes de la distribuidora.

export const FAVORITES: Item[] = [
  ITEMS[0], // Arroz Diana Premium 25 kg
  ITEMS[2], // Leche UHT Alquería entera 1 L
  ITEMS[5], // Azúcar Manuelita 25 kg
];
