# Semana 05 — Networking y TanStack Query v5

Proyecto de la **distribuidora de comida** construido sobre la base de la Semana 04.
La rama `week-4` se conserva intacta como respaldo.

## 🎯 Qué cambió respecto a la Semana 04

| Semana 04 | Semana 05 |
|---|---|
| Productos locales en `src/data/mockData.ts` | Productos desde una API REST real con Axios |
| Datos estáticos | `useQuery` con caché, loading, error y refetch |
| Solo lista + detalle | Lista + detalle + pantalla de creación |
| Sin creación de productos | `useMutation` + `invalidateQueries` |
| Zustand para el carrito | Zustand sigue para el carrito (estado de cliente) |

La regla que se aplica en este proyecto:

- **Estado del servidor** (productos, loading, error, caché) → **TanStack Query**
- **Estado del cliente** (mi pedido) → **Zustand**

## 🌐 API usada

- Base URL: `https://dummyjson.com`
- Lista: `GET /products/category/groceries?limit=30`
- Detalle: `GET /products/:id`
- Crear: `POST /products/add`

DummyJSON es una API de práctica: el `POST` simula la creación y **no guarda**
el producto en el servidor. Por eso, además de invalidar la query, el hook
`useCreateProduct` agrega el producto creado al caché con `setQueryData`
para que la lista se actualice sin recargar la app.

Puedes cambiar la URL base con una variable de entorno:

```bash
EXPO_PUBLIC_API_URL=https://tu-api.com
```

## 🗂️ Arquitectura

```
src/
├── services/
│   ├── api.ts              # Instancia Axios (baseURL, timeout, interceptor)
│   └── productsApi.ts      # Endpoints + mapeo DTO → Product
├── hooks/
│   └── useProducts.ts      # useProducts, useProductById, useCreateProduct
├── navigation/
│   ├── types.ts            # Tipos de navegación
│   └── RootNavigator.tsx   # Tab + Stack (lista, detalle, crear)
├── screens/
│   ├── HomeScreen.tsx      # useQuery + loading/error/empty + pull-to-refresh
│   ├── DetailScreen.tsx    # useProductById + botón de mi pedido
│   ├── CreateProductScreen.tsx # useMutation + formulario
│   └── SavedScreen.tsx     # Mi pedido desde Zustand
├── stores/
│   └── cartStore.ts        # Estado de cliente (Zustand)
├── types/
│   └── index.ts            # Product y CreateProductPayload
└── theme/
    └── index.ts            # Colores, tipografía y espaciados
```

## ▶️ Cómo ejecutar

```bash
pnpm install
pnpm start
```

Luego abre el simulador o Expo Go.

## ✅ Checklist del proyecto

- [x] `QueryClientProvider` en `App.tsx`
- [x] Instancia Axios con `baseURL` en `src/services/api.ts`
- [x] `useQuery` con `queryKey` semántico (`['products']`)
- [x] Loading con `ActivityIndicator`
- [x] Error con mensaje y botón "Reintentar"
- [x] Empty state con `ListEmptyComponent`
- [x] `useMutation` para crear producto
- [x] `invalidateQueries` en `onSuccess`
- [x] Pull-to-refresh con `refetch`
- [x] Detalle con `useProductById`
- [x] Sin `any` y con TypeScript estricto

## 🧠 Apuntes para estudiar

1. **`queryKey`**: es el identificador de la caché. Si dos pantallas usan
   `['products']`, comparten los mismos datos.
2. **`staleTime`**: cuánto tiempo los datos se consideran frescos. Mientras
   estén frescos, TanStack Query no vuelve a pedirlos.
3. **`invalidateQueries`**: marca la query como obsoleta y, si está activa,
   dispara un refetch automático.
4. **`setQueryData`**: actualiza la caché manualmente. Se usa para reflejar
   de inmediato un cambio que el servidor de práctica no persiste.
5. **`isLoading` vs `isFetching`**: `isLoading` es el primer fetch sin datos;
   `isFetching` también incluye refetches y pull-to-refresh.
