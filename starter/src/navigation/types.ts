// src/navigation/types.ts
// Define los tipos de parámetros para cada navigator.
// Esto habilita autocompletado y verificación en tiempo de compilación.

import type { NavigatorScreenParams } from '@react-navigation/native';

// ============================================
// TAB NAVIGATOR — pantallas de nivel raíz
// ============================================

export type RootTabParamList = {
  // Pestaña principal con Stack interno (lista → detalle).
  // NavigatorScreenParams permite navegar a una pantalla del Stack
  // desde fuera de la pestaña (por ejemplo: Home → HomeDetail).
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  // Pestaña secundaria de pedidos frecuentes
  Favorites: undefined;
};

// ============================================
// STACK NAVIGATOR — anidado dentro de la pestaña Home
// ============================================

export type HomeStackParamList = {
  // Pantalla de lista (sin params)
  HomeList: undefined;
  // Pantalla de detalle — recibe todos los datos del producto
  HomeDetail: {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    stock: number;
    supplier: string;
    requiresRefrigeration: boolean;
    image?: number;
  };
};
