import { Item } from '../types';

export const PRODUCTS: Item[] = [
  { id: '1',  name: 'Leche entera UHT',     sku: 'LAC-001', category: 'lácteos',           price: 48000,  unit: 'Caja x12 (1 L)',    stock: 120 },
  { id: '2',  name: 'Queso campesino',      sku: 'LAC-014', category: 'lácteos',           price: 18500,  unit: 'Bloque 500 g',      stock: 35 },
  { id: '3',  name: 'Pechuga de pollo',     sku: 'CAR-003', category: 'carnes',            price: 7200,  unit: 'Caja 10 kg',        stock: 18 },
  { id: '4',  name: 'Carne molida de res',  sku: 'CAR-007', category: 'carnes',            price: 95000,  unit: 'Caja 10 kg',        stock: 0 },
  { id: '5',  name: 'Arroz blanco',         sku: 'GRA-002', category: 'granos',            price: 1300, unit: 'Bulto 50 kg',       stock: 60 },
  { id: '6',  name: 'Fríjol cargamanto',    sku: 'GRA-009', category: 'granos',            price: 2100, unit: 'Bulto 50 kg',       stock: 22 },
  { id: '7',  name: 'Lenteja',              sku: 'GRA-011', category: 'granos',            price: 2200,  unit: 'Bulto 25 kg',       stock: 40 },
  { id: '8',  name: 'Gaseosa cola 1.5 L',   sku: 'BEB-005', category: 'bebidas',           price: 36000,  unit: 'Paca x6',           stock: 200 },
  { id: '9',  name: 'Jugo de naranja',      sku: 'BEB-012', category: 'bebidas',           price: 29000,  unit: 'Caja x12 (300 ml)', stock: 15 },
  { id: '10', name: 'Tomate chonto',        sku: 'FYV-004', category: 'frutas y verduras', price: 65000,  unit: 'Canasta 20 kg',     stock: 12 },
  { id: '11', name: 'Papa pastusa',         sku: 'FYV-008', category: 'frutas y verduras', price: 80000,  unit: 'Bulto 50 kg',       stock: 75 },
  { id: '12', name: 'Papas fritas natural', sku: 'SNA-001', category: 'snacks',            price: 54000,  unit: 'Caja x24',          stock: 90 },
];