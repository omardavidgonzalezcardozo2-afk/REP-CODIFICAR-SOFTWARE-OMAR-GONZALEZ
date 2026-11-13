// src/services/api.ts
// Instancia Axios centralizada.
// Aquí se configura UNA sola vez la URL base, el timeout y los headers.

import axios from 'axios';

// DummyJSON es una API REST pública con productos de prueba.
// Usamos la categoría "groceries" porque encaja con la distribuidora de comida.
// Puedes cambiar la URL con la variable de entorno EXPO_PUBLIC_API_URL.
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

// Traduce un error de Axios (o de cualquier tipo) a un mensaje en español.
// Así las pantallas nunca muestran textos técnicos como "Network Error".
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Sin respuesta significa que no se pudo llegar al servidor.
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'La solicitud tardó demasiado. Revisa tu conexión e inténtalo de nuevo.';
      }
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    const status = error.response.status;

    if (status === 404) {
      return 'El producto solicitado no existe en el servidor.';
    }
    if (status >= 500) {
      return 'El servidor presentó un error. Inténtalo de nuevo más tarde.';
    }
    return `La solicitud falló con el código ${status}. Inténtalo de nuevo.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
