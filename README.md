# Semana 05 — Networking y TanStack Query v5

Evolución del proyecto de la **distribuidora de comida** de la Semana 04.
La app conserva la navegación Tab + Stack, el tema y el carrito ("Mi pedido")
en Zustand, y ahora carga el catálogo desde una API REST real.

La rama local `week-4-backup` conserva el estado anterior como respaldo.

## 🎯 Qué cambió respecto a la Semana 04

| Semana 04 | Semana 05 |
|---|---|
| Productos locales en `src/data/mockData.ts` | Productos desde una API REST real con Axios |
| Datos estáticos | `useQuery` con caché, loading, error y refetch |
| Solo lista + detalle | Lista + detalle + pantalla de creación |
| Sin creación de productos | `useMutation` + `invalidateQueries` |
| Zustand para el carrito | Zustand sigue para el carrito (estado de cliente) |

La regla que se aplica en este proyecto:

- **Estado del servidor** (catálogo, loading, error, caché) → **TanStack Query**
- **Estado del cliente** (mi pedido) → **Zustand**

## 🌐 API usada

- Base URL: `https://dummyjson.com`
- Lista: `GET /products/category/groceries?limit=30`
- Detalle: `GET /products/:id`
- Crear: `POST /products/add`

### Catálogo en español, imágenes y precios

- **Nombres y descripciones en español**: `itemsApi.ts` traduce los 27 productos
  de `groceries` con un diccionario (`SPANISH_CONTENT`) indexado por el título.
  Si un producto no está en el diccionario (por ejemplo, uno creado por el
  usuario), se conserva el texto original.
- **Imágenes correctas por producto**: se usa el `thumbnail` remoto que envía
  DummyJSON, de modo que cada producto muestra su propia foto (helado → helado,
  manzana → manzana, etc.). Las imágenes locales de `assets/products/` quedan
  solo como respaldo cuando el servidor no envía imagen.
- **Escala de precios**: `COP_PER_USD = 400`, es decir, el precio de la API se
  divide entre 10 respecto a la escala anterior (`39.890` → `3.989`). Los
  productos creados desde el formulario ya se envían en COP y no se convierten.
- **Errores en español**: `getApiErrorMessage` en `api.ts` traduce los errores
  de Axios (sin conexión, timeout, 404, 5xx) a mensajes entendibles.

DummyJSON es una API de práctica: el `POST` simula la creación y **no guarda**
el producto en el servidor. Por eso, además de invalidar la query, el hook
`useCreateItem` agrega el producto creado al caché con `setQueryData` para que
la lista se actualice sin recargar la app.

Además, DummyJSON devuelve siempre el mismo id para los productos nuevos
(verificado con `POST /products/add`). Si ese id ya existe en el caché, el hook
le asigna un id local único (máximo id + 1) para que dos creaciones no se pisen.
Los productos creados localmente se conservan al invalidar la lista.

> Es esperado ver un `404 /products/:id` en la consola al abrir el detalle de
> un producto recién creado: el servidor de práctica no lo guardó y la app usa
> el dato del caché como respaldo.

Puedes cambiar la URL base con una variable de entorno:

```bash
EXPO_PUBLIC_API_URL=https://tu-api.com
```

## 🗂️ Arquitectura

```
src/
├── services/
│   ├── api.ts              # Instancia Axios (baseURL, timeout, interceptor)
│   └── itemsApi.ts         # Endpoints + mapeo DTO → Item
├── hooks/
│   └── useItems.ts         # useItems, useItemById, useCreateItem
├── constants/
│   └── categories.ts       # Categorías y etiquetas en español
├── navigation/
│   ├── types.ts            # Tipos de navegación
│   └── RootNavigator.tsx   # Tab + Stack (lista, detalle, crear)
├── screens/
│   ├── HomeScreen.tsx      # useQuery + loading/error/empty + pull-to-refresh
│   ├── DetailScreen.tsx    # useItemById + botón de mi pedido
│   ├── CreateScreen.tsx    # useMutation + formulario
│   └── SavedScreen.tsx     # Mi pedido desde Zustand
├── stores/
│   └── cartStore.ts        # Estado de cliente (Zustand)
├── types/
│   ├── index.ts            # Item y CreateItemPayload
│   └── env.d.ts            # Tipado de EXPO_PUBLIC_API_URL
└── theme/
    └── index.ts            # Colores, tipografía y espaciados
```

## ▶️ Cómo ejecutar

```bash
pnpm install
pnpm start
```

Luego abre el simulador, Expo Go o la versión web.

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
- [x] Detalle con `useItemById` y reintentar
- [x] Catálogo, descripciones y mensajes 100% en español
- [x] Imágenes remotas correctas para cada producto
- [x] Precios en la escala solicitada (`39.890` → `3.989`)
- [x] Sin `any` y con TypeScript estricto

## 🧠 Apuntes para estudiar

1. **`queryKey`**: es el identificador de la caché. Si dos pantallas usan
   `['products']`, comparten los mismos datos.
2. **`staleTime`**: cuánto tiempo los datos se consideran frescos. Mientras
   estén frescos, TanStack Query no vuelve a pedirlos. En el detalle usamos `0`
   para intentar traer siempre la versión más reciente.
3. **`invalidateQueries`**: marca la query como obsoleta y, si está activa,
   dispara un refetch automático.
4. **`setQueryData`**: actualiza la caché manualmente. Se usa para reflejar
   de inmediato un cambio que el servidor de práctica no persiste.
5. **`placeholderData`**: muestra datos del caché mientras llega la respuesta
   del detalle, sin bloquear la pantalla con un spinner.
6. **`isLoading` vs `isFetching`**: `isLoading` es el primer fetch sin datos;
   `isFetching` también incluye refetches y pull-to-refresh.
