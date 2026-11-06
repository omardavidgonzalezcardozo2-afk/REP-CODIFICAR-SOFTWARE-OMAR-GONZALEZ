import type { Item } from '../types';

export const ITEMS: Item[] = [
  { id: '1', name: 'Arroz Premium', description: 'Arroz blanco de grano largo, bulto de 25 kg para restaurantes.', price: 9800, unit: 'bulto 25 kg', category: 'granos', stock: 40, image: require('../../assets/products/arroz.jpg') },
  { id: '2', name: 'Frijol Cargamanto', description: 'Frijol rojo seleccionado, ideal para bandeja paisa.', price: 750, unit: 'kg', category: 'granos', stock: 120, image: require('../../assets/products/frijol.jpg') },
  { id: '3', name: 'Leche Entera', description: 'Leche entera UHT en caja de 12 bolsas de 1 litro.', price: 3600, unit: 'caja', category: 'lacteos', stock: 60, image: require('../../assets/products/leche.jpg') },
  { id: '4', name: 'Queso Campesino', description: 'Queso fresco campesino por kilo, refrigerado.', price: 2200, unit: 'kg', category: 'lacteos', stock: 35, image: require('../../assets/products/queso.jpg') },
  { id: '5', name: 'Pechuga de Pollo', description: 'Pechuga sin hueso congelada, empaque de 10 kg.', price: 9500, unit: 'caja 10 kg', category: 'carnes', stock: 25, image: require('../../assets/products/pollo.jpg') },
  { id: '6', name: 'Carne Molida', description: 'Carne de res molida, tipo especial.', price: 2400, unit: 'kg', category: 'carnes', stock: 50, image: require('../../assets/products/carne.jpg') },
  { id: '7', name: 'Gaseosa 1.5 L', description: 'Paca de 12 gaseosas de 1.5 litros, sabores surtidos.', price: 4800, unit: 'paca', category: 'bebidas', stock: 80, image: require('../../assets/products/gaseosa.jpg') },
  { id: '8', name: 'Tomate Chonto', description: 'Tomate chonto fresco, canastilla de 20 kg.', price: 5200, unit: 'canastilla', category: 'verduras', stock: 30, image: require('../../assets/products/tomate.jpg') },
];
