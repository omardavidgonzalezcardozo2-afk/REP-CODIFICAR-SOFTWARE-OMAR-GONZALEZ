// src/services/api.ts
// Instancia Axios centralizada.
// Aquí se configura UNA sola vez la URL base, el timeout y los headers.

import axios from 'axios';

// DummyJSON es una API REST pública con productos de prueba.
// Usamos la categoría "groceries" porque encaja con la distribuidora de comida.
// Puedes cambiarla con una variable de entorno EXPO_PUBLIC_API_URL.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de respuesta: centraliza el log de errores de red.
// En producción aquí podrías refrescar un token o redirigir al login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  },
);
