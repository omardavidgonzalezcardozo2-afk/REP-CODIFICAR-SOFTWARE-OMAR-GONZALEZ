// src/hooks/useItems.ts
// Hooks de TanStack Query para el catálogo.
// Las pantallas consumen estos hooks y nunca llaman a Axios directamente.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createItem, fetchItemById, fetchItems } from '../services/itemsApi';
import type { CreateItemPayload, Item } from '../types';

// Query key semántica y centralizada.
// Al invalidar esta key, TanStack Query refresca todas las queries que
// empiezan por ella, incluida la del detalle.
export const ITEMS_QUERY_KEY = ['products'] as const;

export function useItems() {
  return useQuery<Item[], Error>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: fetchItems,
  });
}

export function useItemById(id: number) {
  const queryClient = useQueryClient();

  return useQuery<Item, Error>({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await fetchItemById(id);
      } catch (error) {
        // Un producto recién creado existe en el caché local,
        // pero DummyJSON no lo persiste en el servidor.
        // Si el GET falla, devolvemos el que ya tenemos en caché.
        const cached = queryClient
          .getQueryData<Item[]>(ITEMS_QUERY_KEY)
          ?.find((item) => item.id === id);

        if (cached) return cached;
        throw error;
      }
    },
    enabled: Number.isFinite(id),
    // En el detalle queremos intentar traer datos frescos del servidor.
    staleTime: 0,
    // Muestra de inmediato el producto que ya está en la lista.
    placeholderData: () =>
      queryClient
        .getQueryData<Item[]>(ITEMS_QUERY_KEY)
        ?.find((item) => item.id === id),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: createItem,
    onSuccess: async (createdItem) => {
      // Guardamos la lista actual antes del refetch: así no perdemos los
      // productos que se crearon antes y que DummyJSON no persiste.
      const previousItems =
        queryClient.getQueryData<Item[]>(ITEMS_QUERY_KEY) ?? [];

      try {
        // 1) Invalidamos la lista: TanStack Query la marca como stale
        //    y hace refetch de la query activa.
        await queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
      } catch {
        // Si el refetch falla (por ejemplo, sin internet), el producto
        // recién creado igual se agrega al caché en el bloque finally.
      } finally {
        // 2) Como DummyJSON simula el POST (no guarda de verdad),
        //    agregamos el producto creado al caché para que la lista
        //    se actualice en pantalla sin recargar la app.
        queryClient.setQueryData<Item[]>(ITEMS_QUERY_KEY, (fresh = []) => {
          const freshIds = new Set(fresh.map((item) => item.id));

          // Productos que solo existen en el caché local (creados antes).
          const localOnly = previousItems.filter(
            (item) => !freshIds.has(item.id),
          );

          // Base = creados localmente + lista del servidor, sin duplicar ids.
          const base = [
            ...localOnly,
            ...fresh.filter(
              (item) => !localOnly.some((local) => local.id === item.id),
            ),
          ];

          // DummyJSON devuelve siempre el mismo id para productos nuevos.
          // Si ese id ya está ocupado, le asignamos uno local único
          // para que dos creaciones no se pisen entre sí.
          const maxId = base.reduce(
            (max, item) => Math.max(max, item.id),
            0,
          );
          const idTaken = base.some((item) => item.id === createdItem.id);
          const itemToCache = idTaken
            ? { ...createdItem, id: Math.max(maxId, createdItem.id) + 1 }
            : createdItem;

          return [
            itemToCache,
            ...base.filter((item) => item.id !== itemToCache.id),
          ];
        });
      }
    },
    onError: (error) => {
      console.error('No se pudo crear el producto:', error.message);
    },
  });
}
