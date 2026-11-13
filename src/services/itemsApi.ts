// src/services/itemsApi.ts
// Funciones que hablan con la API y traducen la respuesta del servidor
// (DTO) al modelo de nuestro dominio (Item).
//
// Así los hooks y las pantallas no conocen detalles como "title" o
// "thumbnail": solo trabajan con "name" e "image".
//
// Además, el catálogo de DummyJSON viene en inglés: aquí lo traducimos
// al español con un diccionario por título, para que la app quede 100%
// en español sin depender de otro servicio.

import type { ImageSourcePropType } from 'react-native';

import { apiClient, getApiErrorMessage } from './api';
import type { CreateItemPayload, Item, ProductCategory } from '../types';

// DummyJSON devuelve precios pequeños (estilo dólar).
// Los pasamos a COP para que la demo sea coherente con el dominio.
// Nota: usamos 400 (no 4.000) para que los precios queden en la escala
// pedida: un producto de 39.890 pasa a valer 3.989.
const COP_PER_USD = 400;

// ============================================================
// DTO: forma exacta en la que responde DummyJSON
// ============================================================

interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail?: string;
}

interface ApiProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

// ============================================================
// Traducción del catálogo al español
// ============================================================

interface SpanishContent {
  name: string;
  description: string;
}

// Diccionario por título normalizado (sin tildes y en minúsculas).
// Los 27 productos de la categoría "groceries" de DummyJSON.
const SPANISH_CONTENT: Record<string, SpanishContent> = {
  apple: {
    name: 'Manzana',
    description:
      'Manzanas frescas y crujientes, ideales para comer entre comidas o incorporar en diversas recetas.',
  },
  'beef steak': {
    name: 'Bistec de res',
    description:
      'Bistec de res de alta calidad, ideal para asar o cocinar al término de tu preferencia.',
  },
  'cat food': {
    name: 'Comida para gatos',
    description:
      'Comida nutritiva para gatos, formulada para cubrir las necesidades alimenticias de tu felino.',
  },
  'chicken meat': {
    name: 'Pollo',
    description:
      'Carne de pollo fresca y tierna, apta para diversas preparaciones culinarias.',
  },
  'cooking oil': {
    name: 'Aceite de cocina',
    description:
      'Aceite de cocina versátil, ideal para freír, saltear y muchas otras aplicaciones culinarias.',
  },
  cucumber: {
    name: 'Pepino',
    description:
      'Pepinos frescos e hidratantes, ideales para ensaladas, pasabocas o como acompañamiento refrescante.',
  },
  'dog food': {
    name: 'Comida para perros',
    description:
      'Comida para perros especialmente formulada para aportar los nutrientes esenciales a tu mascota.',
  },
  eggs: {
    name: 'Huevos',
    description:
      'Huevos frescos, un ingrediente versátil para hornear, cocinar o preparar el desayuno.',
  },
  'fish steak': {
    name: 'Filete de pescado',
    description:
      'Filete de pescado de calidad, adecuado para asar, hornear o sellar en sartén.',
  },
  'green bell pepper': {
    name: 'Pimiento verde',
    description:
      'Pimiento verde fresco y vibrante, perfecto para dar color y sabor a tus platos.',
  },
  'green chili pepper': {
    name: 'Ají verde',
    description:
      'Ají verde picante, ideal para dar un toque de picor a tus recetas favoritas.',
  },
  'honey jar': {
    name: 'Frasco de miel',
    description:
      'Miel pura y natural en un práctico frasco, perfecta para endulzar bebidas o rociar sobre los alimentos.',
  },
  'ice cream': {
    name: 'Helado',
    description:
      'Helado cremoso y delicioso, disponible en varios sabores para darte un gusto.',
  },
  juice: {
    name: 'Jugo',
    description:
      'Jugo de frutas refrescante, lleno de vitaminas y perfecto para mantenerte hidratado.',
  },
  kiwi: {
    name: 'Kiwi',
    description:
      'Kiwi rico en nutrientes, perfecto para comer entre comidas o dar un toque tropical a tus platos.',
  },
  lemon: {
    name: 'Limón',
    description:
      'Limones ácidos y aromáticos, versátiles para cocinar, hornear o preparar bebidas refrescantes.',
  },
  milk: {
    name: 'Leche',
    description:
      'Leche fresca y nutritiva, un básico para diversas recetas y el consumo diario.',
  },
  mulberry: {
    name: 'Mora',
    description:
      'Moras dulces y jugosas, perfectas para comer entre comidas o agregar a postres y cereales.',
  },
  'nescafe coffee': {
    name: 'Café Nescafé',
    description:
      'Café de calidad Nescafé, disponible en varias mezclas para una taza rica y satisfactoria.',
  },
  potatoes: {
    name: 'Papas',
    description:
      'Papas versátiles y ricas en almidón, ideales para asar, hacer puré o como guarnición.',
  },
  'protein powder': {
    name: 'Proteína en polvo',
    description:
      'Proteína en polvo rica en nutrientes, ideal para complementar tu dieta con proteínas esenciales.',
  },
  'red onions': {
    name: 'Cebolla roja',
    description:
      'Cebollas rojas sabrosas y aromáticas, perfectas para dar profundidad a tus platos salados.',
  },
  rice: {
    name: 'Arroz',
    description:
      'Arroz de alta calidad, un básico de varias cocinas y una base versátil para muchos platos.',
  },
  'soft drinks': {
    name: 'Gaseosas',
    description:
      'Gaseosas surtidas en varios sabores, perfectas para bebidas refrescantes.',
  },
  strawberry: {
    name: 'Fresa',
    description:
      'Fresas dulces y jugosas, ideales para comer entre comidas, en postres o en batidos.',
  },
  'tissue paper box': {
    name: 'Caja de pañuelos',
    description:
      'Caja de pañuelos prácticos para el uso diario, con hojas suaves y absorbentes.',
  },
  water: {
    name: 'Agua',
    description:
      'Agua embotellada pura y refrescante, esencial para mantenerte hidratado durante todo el día.',
  },
};

// Quita tildes y pasa a minúsculas para comparar títulos de forma segura.
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Devuelve el nombre y la descripción en español. Si el producto no está
// en el diccionario (por ejemplo, uno creado por el usuario), conserva
// el texto original.
function translateContent(apiProduct: ApiProduct): SpanishContent {
  const translated = SPANISH_CONTENT[normalize(apiProduct.title)];

  return (
    translated ?? {
      name: apiProduct.title,
      description: apiProduct.description,
    }
  );
}

// ============================================================
// Imágenes
// ============================================================
// Prioridad: la imagen remota del producto (thumbnail), porque DummyJSON
// tiene una foto distinta y correcta para cada uno. Las imágenes locales
// de la Semana 4 quedan como respaldo cuando el servidor no envía imagen
// (por ejemplo, en un producto recién creado).

const LOCAL_IMAGES: ReadonlyArray<{
  pattern: RegExp;
  source: ImageSourcePropType;
}> = [
  { pattern: /rice|arroz|grain|grano/i, source: require('../../assets/products/arroz.jpg') },
  { pattern: /bean|frijol/i, source: require('../../assets/products/frijol.jpg') },
  { pattern: /beef|steak|meat|carne|fish|pescado/i, source: require('../../assets/products/carne.jpg') },
  { pattern: /chicken|pollo/i, source: require('../../assets/products/pollo.jpg') },
  { pattern: /milk|cheese|ice cream|mascarpone|leche|queso|yogur/i, source: require('../../assets/products/leche.jpg') },
  { pattern: /egg|honey|protein|huevo|miel|proteina/i, source: require('../../assets/products/queso.jpg') },
  { pattern: /soft drink|juice|water|coffee|gaseosa|jugo|agua|cafe|\btea\b/i, source: require('../../assets/products/gaseosa.jpg') },
  { pattern: /apple|tomato|pepper|cucumber|onion|potato|lemon|kiwi|strawberry|fruit|vegetable|berry|tomate|cebolla|papa|limon|fruta|verdura/i, source: require('../../assets/products/tomate.jpg') },
];

// Último recurso: una imagen local para que la tarjeta nunca quede vacía.
const FALLBACK_IMAGE: ImageSourcePropType = require('../../assets/products/arroz.jpg');

function resolveImage(
  apiProduct: ApiProduct,
  spanishName: string,
): ImageSourcePropType {
  // 1) Imagen remota: corresponde exactamente al producto.
  if (apiProduct.thumbnail) return { uri: apiProduct.thumbnail };

  // 2) Sin imagen remota: buscamos una local por palabra clave.
  const text = normalize(`${apiProduct.title} ${spanishName}`);
  const localImage = LOCAL_IMAGES.find(({ pattern }) => pattern.test(text));
  if (localImage) return localImage.source;

  // 3) Último recurso.
  return FALLBACK_IMAGE;
}

// ============================================================
// Mapeo de categorías y unidades
// ============================================================

function inferCategory(englishTitle: string, spanishName: string): ProductCategory {
  const text = normalize(`${englishTitle} ${spanishName}`);

  if (/milk|cheese|ice cream|mascarpone|leche|queso|yogur|helado/.test(text)) {
    return 'lacteos';
  }
  if (/beef|steak|chicken|fish|meat|carne|pollo|pescado|bistec|filete/.test(text)) {
    return 'carnes';
  }
  if (/juice|water|soft drink|coffee|gaseosa|jugo|agua|cafe|\btea\b/.test(text)) {
    return 'bebidas';
  }
  if (/apple|tomato|pepper|cucumber|onion|potato|lemon|kiwi|strawberry|fruit|vegetable|berry|manzana|tomate|pimiento|pepino|cebolla|papa|limon|fresa|fruta|verdura|aji/.test(text)) {
    return 'verduras';
  }
  if (/rice|bean|oil|egg|honey|protein|grain|arroz|frijol|aceite|huevo|miel|proteina/.test(text)) {
    return 'granos';
  }

  // Categoría por defecto cuando no podemos inferirla.
  return 'abarrotes';
}

function inferUnit(englishTitle: string, spanishName: string): string {
  const text = normalize(`${englishTitle} ${spanishName}`);

  if (/milk|juice|water|soft drink|oil|leche|jugo|agua|gaseosa|aceite/.test(text)) {
    return 'botella';
  }
  if (/rice|bean|potato|onion|apple|fruit|vegetable|arroz|frijol|papa|cebolla|manzana|fruta|verdura|tomate|pepino|limon/.test(text)) {
    return 'kg';
  }
  return 'unidad';
}

function mapFetchedItem(apiProduct: ApiProduct): Item {
  const content = translateContent(apiProduct);

  return {
    id: apiProduct.id,
    name: content.name,
    description: content.description,
    price: Math.round(apiProduct.price * COP_PER_USD),
    unit: inferUnit(apiProduct.title, content.name),
    category: inferCategory(apiProduct.title, content.name),
    stock: apiProduct.stock,
    image: resolveImage(apiProduct, content.name),
  };
}

// ============================================================
// Endpoints
// ============================================================

export async function fetchItems(): Promise<Item[]> {
  try {
    const { data } = await apiClient.get<ApiProductsResponse>(
      '/products/category/groceries',
      { params: { limit: 30 } },
    );

    return data.products.map(mapFetchedItem);
  } catch (error) {
    // Convertimos el error técnico en un mensaje entendible en español.
    throw new Error(getApiErrorMessage(error));
  }
}

export async function fetchItemById(id: number): Promise<Item> {
  try {
    const { data } = await apiClient.get<ApiProduct>(`/products/${id}`);
    return mapFetchedItem(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createItem(payload: CreateItemPayload): Promise<Item> {
  try {
    // El servidor espera "title"; nuestro dominio usa "name".
    const { data } = await apiClient.post<ApiProduct>('/products/add', {
      title: payload.name,
      description: payload.description,
      price: payload.price, // Ya viene en COP: no se vuelve a convertir.
      stock: payload.stock,
      category: payload.category,
      thumbnail: '',
    });

    // DummyJSON simula el POST y devuelve siempre el mismo id.
    // La corrección de ids repetidos se hace en useCreateItem, que sí
    // tiene acceso al caché de la lista.
    return {
      id: data.id,
      name: payload.name,
      description: payload.description,
      price: data.price,
      stock: data.stock,
      category: payload.category,
      unit: payload.unit,
      // Producto nuevo sin thumbnail: usamos una imagen local por palabra clave.
      image: resolveImage(
        { ...data, title: data.title || payload.name },
        payload.name,
      ),
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
