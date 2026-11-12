// src/hooks/useProducts.ts
// Hooks de TanStack Query para el dominio de productos.
// Las pantallas consumen estos hooks y nunca llaman a Axios directamente.

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createProduct,
  fetchProductById,
  fetchProducts,
} from '../services/productsApi';
import type { CreateProductPayload, Product } from '../types';

// Query key semántica y centralizada.
// Al invalidar esta key, TanStack Query refresca todas las queries que empiezan por ella.
export const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
  });
}

export function useProductById(id: number) {
  const queryClient = useQueryClient();

  return useQuery<Product, Error>({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await fetchProductById(id);
      } catch (error) {
        // Un producto recién creado existe en el caché local,
        // pero DummyJSON no lo persiste en el servidor.
        // Si el GET falla, devolvemos el que ya tenemos en caché.
        const cached = queryClient
          .getQueryData<Product[]>(PRODUCTS_QUERY_KEY)
          ?.find((product) => product.id === id);

        if (cached) return cached;
        throw error;
      }
    },
    // Muestra de inmediato el producto que ya está en la lista.
    initialData: () =>
      queryClient
        .getQueryData<Product[]>(PRODUCTS_QUERY_KEY)
        ?.find((product) => product.id === id),
    // En el detalle queremos intentar traer datos frescos del servidor.
    staleTime: 0,
    enabled: Number.isFinite(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductPayload>({
    mutationFn: createProduct,
    onSuccess: async (createdProduct) => {
      try {
        // 1) Invalidamos la lista: TanStack Query la marca como stale
        //    y hace refetch de la query activa.
        await queryClient.invalidateQueries({
          queryKey: PRODUCTS_QUERY_KEY,
        });
      } finally {
        // 2) Como DummyJSON simula el POST (no guarda de verdad),
        //    agregamos el producto creado al caché para que la lista
        //    se actualice en pantalla sin recargar la app.
        queryClient.setQueryData<Product[]>(
          PRODUCTS_QUERY_KEY,
          (current = []) => [
            createdProduct,
            ...current.filter((product) => product.id !== createdProduct.id),
          ],
        );
      }
    },
    onError: (error) => {
      console.error('No se pudo crear el producto:', error.message);
    },
  });
}
