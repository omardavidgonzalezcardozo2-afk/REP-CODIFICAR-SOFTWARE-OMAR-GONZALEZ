// src/services/productsApi.ts
// Funciones que hablan con la API y traducen la respuesta
// del servidor (DTO) al modelo de nuestro dominio (Product).
//
// Así los hooks y las pantallas no conocen detalles como "title"
// o "thumbnail": solo trabajan con "name" e "image".

import type { ImageSourcePropType } from 'react-native';

import { apiClient } from './api';
import type { CreateProductPayload, Product, ProductCategory } from '../types';

// DummyJSON devuelve precios pequeños (estilo dólar).
// Los convertimos a COP para que la demo sea coherente con el dominio.
const COP_PER_USD = 4_000;

// ============================================================
// DTO: forma exacta en la que responde DummyJSON
// ============================================================

interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
}

interface ApiProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

// ============================================================
// Imágenes locales de la semana 4 (fallback si la API no trae imagen)
// ============================================================

const LOCAL_IMAGES: ReadonlyArray<{
  pattern: RegExp;
  source: ImageSourcePropType;
}> = [
  { pattern: /rice|grain/i, source: require('../../assets/products/arroz.jpg') },
  { pattern: /bean/i, source: require('../../assets/products/frijol.jpg') },
  { pattern: /beef|steak|meat/i, source: require('../../assets/products/carne.jpg') },
  { pattern: /chicken/i, source: require('../../assets/products/pollo.jpg') },
  { pattern: /milk|cheese|ice cream|mascarpone/i, source: require('../../assets/products/leche.jpg') },
  { pattern: /egg|honey|protein/i, source: require('../../assets/products/queso.jpg') },
  { pattern: /soft drink|juice|water|coffee|tea/i, source: require('../../assets/products/gaseosa.jpg') },
  { pattern: /apple|tomato|pepper|cucumber|onion|potato|lemon|kiwi|strawberry|fruit|vegetable/i, source: require('../../assets/products/tomate.jpg') },
];

function resolveImage(apiProduct: ApiProduct): ImageSourcePropType {
  const localImage = LOCAL_IMAGES.find(({ pattern }) =>
    pattern.test(apiProduct.title),
  );

  if (localImage) return localImage.source;
  if (apiProduct.thumbnail) return { uri: apiProduct.thumbnail };

  // Último recurso: una imagen local para que la tarjeta nunca quede vacía.
  return require('../../assets/products/arroz.jpg');
}

// ============================================================
// Mapeo de categorías y unidades
// ============================================================

function inferCategory(title: string): ProductCategory {
  if (/milk|cheese|ice cream|mascarpone/i.test(title)) return 'lacteos';
  if (/beef|steak|chicken|fish|meat/i.test(title)) return 'carnes';
  if (/juice|water|soft drink|coffee|tea/i.test(title)) return 'bebidas';
  if (/apple|tomato|pepper|cucumber|onion|potato|lemon|kiwi|strawberry|fruit|vegetable/i.test(title)) {
    return 'verduras';
  }
  if (/rice|bean|oil|egg|honey|protein|grain/i.test(title)) return 'granos';
  return 'abarrotes';
}

function inferUnit(title: string): string {
  if (/milk|juice|water|soft drink|oil/i.test(title)) return 'botella';
  if (/rice|bean|potato|onion|apple|fruit|vegetable/i.test(title)) return 'kg';
  return 'unidad';
}

function mapFetchedProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    description: apiProduct.description,
    price: Math.round(apiProduct.price * COP_PER_USD),
    unit: inferUnit(apiProduct.title),
    category: inferCategory(apiProduct.title),
    stock: apiProduct.stock,
    image: resolveImage(apiProduct),
  };
}

// ============================================================
// Endpoints
// ============================================================

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<ApiProductsResponse>(
    '/products/category/groceries',
    { params: { limit: 30 } },
  );

  return data.products.map(mapFetchedProduct);
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<ApiProduct>(`/products/${id}`);
  return mapFetchedProduct(data);
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  // El servidor espera "title"; nuestro dominio usa "name".
  const { data } = await apiClient.post<ApiProduct>('/products/add', {
    title: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    category: payload.category,
    thumbnail: '',
  });

  return {
    id: data.id,
    name: data.title ?? payload.name,
    description: data.description ?? payload.description,
    // El precio enviado ya está en COP, no lo volvemos a convertir.
    price: typeof data.price === 'number' ? data.price : payload.price,
    stock: typeof data.stock === 'number' ? data.stock : payload.stock,
    category: payload.category,
    unit: payload.unit,
    image: resolveImage(data),
  };
}
