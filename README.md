# Semana 06 — Formularios con React Hook Form + Zod

Evolución de la app de la **distribuidora de alimentos** de la Semana 05.
Conserva la navegación Tab + Stack, el tema, el carrito ("Mi pedido"), las
traducciones al español, las imágenes, el pull-to-refresh y el catálogo desde
DummyJSON. Ahora los formularios usan **React Hook Form + Zod**, y se agregó
la edición de productos.

## 🎯 Qué cambió respecto a la Semana 05

| Semana 05 | Semana 06 |
|---|---|
| `CreateScreen` con `useState` y validación manual | `useForm` + `zodResolver` + errores inline |
| Sin schema de validación | `src/schemas/itemSchema.ts` (Zod, única fuente de verdad) |
| Tipos del formulario duplicados en `types/` | `ItemFormData = z.infer<typeof itemSchema>` |
| `TextInput` controlado a mano | `FormField` reutilizable con `Controller` |
| Chips de categoría con `useState` | `CategoryField` reutilizable con `Controller` |
| `Alert.alert` para errores (no funciona en web) | Banner de error en pantalla |
| Solo crear productos | Crear **y editar** (`EditScreen`, `useUpdateItem`) |
| `ItemFormData` no existía | `CreateItemPayload` y `UpdateItemPayload` se infieren del schema |
| Sin persistencia de ediciones | `Map<number, Item>` en `itemsApi.ts` (DummyJSON no guarda el PUT) |

Dependencias nuevas (versiones del curso): `react-hook-form@7.81.0`,
`zod@4.4.3`, `@hookform/resolvers@5.4.0`. Expo se actualizó de `58.0.25` a
`58.0.26` (mismo SDK 58) porque es el parche que recomiendan las herramientas
de Expo; no se bajó ninguna versión.

## 🧩 La regla de las tres capas

| Capa | Tecnología | Qué guarda |
|---|---|---|
| **Estado del servidor** | TanStack Query v5 | Catálogo, detalle, loading, error, caché, mutaciones |
| **Estado del cliente** | Zustand | "Mi pedido": productos que el usuario agregó |
| **Estado del formulario** | React Hook Form + Zod | Valores, errores, `isDirty`, `isSubmitting` |

Las tres capas están separadas: el hook de edición actualiza la caché de
TanStack Query, y es la pantalla `EditScreen` (no el hook) la que llama a
`updateItem` del store de Zustand.

## 🌐 API usada

- Base URL: `https://dummyjson.com` (variable `EXPO_PUBLIC_API_URL`)
- Lista: `GET /products/category/groceries?limit=30`
- Detalle: `GET /products/:id`
- Crear: `POST /products/add`
- Editar: `PUT /products/:id`

`itemsApi.ts` traduce nombres y descripciones al español, convierte precios a
COP (`COP_PER_USD = 400`), infiere categoría y unidad y resuelve la imagen.
DummyJSON **no persiste** ni el `POST` ni el `PUT`: por eso el caché se completa
con `setQueryData` al crear y las ediciones se guardan en un `Map` en memoria.

## 🗂️ Estructura de carpetas

```
src/
├── components/
│   ├── FormField.tsx       # NUEVO: TextInput + Controller + error inline
│   └── CategoryField.tsx   # NUEVO: chips de categoría + Controller + error
├── schemas/
│   └── itemSchema.ts       # NUEVO: Zod + ItemFormData / ItemFormInput
├── services/
│   ├── api.ts              # Instancia Axios + getApiErrorMessage
│   └── itemsApi.ts         # Endpoints + Map de ediciones + updateItem
├── hooks/
│   └── useItems.ts         # useItems, useItemById, useCreateItem, useUpdateItem
├── constants/
│   └── categories.ts       # CATEGORIES como tupla + ProductCategory
├── navigation/
│   ├── types.ts            # Incluye HomeEdit
│   └── RootNavigator.tsx   # Tab + Stack (lista, detalle, crear, editar)
├── screens/
│   ├── HomeScreen.tsx      # Catálogo + pull-to-refresh
│   ├── DetailScreen.tsx    # Detalle + guardar + editar
│   ├── CreateScreen.tsx    # MODIFICADO: RHF + Zod
│   ├── EditScreen.tsx      # NUEVO: RHF + Zod + reset
│   └── SavedScreen.tsx     # Mi pedido (Zustand)
├── stores/
│   └── cartStore.ts        # Carrito + updateItem
├── types/
│   ├── index.ts            # Item + payloads inferidos del schema
│   └── env.d.ts            # Tipado de EXPO_PUBLIC_API_URL
└── theme/
    └── index.ts            # Colores, tipografía y espaciados
```

## ▶️ Cómo ejecutar

```bash
pnpm install
pnpm start
```

- **Web local:** presiona `w` en el menú de Expo, o ejecuta `pnpm web`.
  Abre `http://localhost:8081`.
- **Celular con Expo Go:** escanea el QR con Expo Go (SDK 58, coincide con el
  proyecto). El celular y el computador deben estar en la misma red wifi.
  Si la red bloquea la conexión, usa `pnpm start --tunnel`.

Los errores de los formularios se muestran en un banner en pantalla, así que
funcionan igual en web y en móvil (no se usa `Alert.alert`).

## ✅ Checklist del instructor

- [x] Schema Zod en `src/schemas/itemSchema.ts` adaptado a la distribuidora
- [x] Al menos 2 campos y un numérico con `z.coerce.number()`
- [x] `ItemFormData = z.infer<typeof itemSchema>` (sin interfaz duplicada)
- [x] `FormField` genérico y reutilizable (`Controller` + `TextInput` + error)
- [x] `CategoryField` reutilizable con `Controller` y error de Zod
- [x] `CreateScreen` con `useForm` + `zodResolver` + `useCreateItem`
- [x] `onSuccess` del create navega atrás con `goBack()`
- [x] Errores inline bajo cada campo inválido al enviar
- [x] Botón deshabilitado y `ActivityIndicator` con `isSubmitting`/`isPending`
- [x] Todos los campos del dominio en ambos formularios
- [x] `EditScreen` con `defaultValues` y `reset` (`keepDirtyValues: true`)
- [x] `EditScreen` deshabilitado si `!isDirty || isSubmitting || isPending`
- [x] `useUpdateItem` con `setQueryData` en lista y detalle
- [x] Persistencia de ediciones con `Map<number, Item>`
- [x] `updateItem` en Zustand llamado desde `EditScreen`
- [x] Errores de mutación en pantalla (sin `Alert.alert`)
- [x] Sin `any`, sin `eslint-disable`, sin `register` y sin `useState` para validar
- [x] TypeScript estricto sin errores, web y Expo Go

## 🧠 Apuntes para estudiar

1. **`Controller` vs `register`**: `register` está pensado para inputs del DOM
   y devuelve props como `name`, `onChange` y `ref`. React Native no tiene DOM:
   `TextInput` usa `onChangeText` (un `string`, no un evento) y no acepta `ref`
   de la misma forma. `Controller` es el puente oficial: entrega `value`,
   `onChange`, `onBlur` y `name` ya adaptados, y funciona igual en nativo y web.
2. **¿Por qué `z.coerce.number()`?**: los `TextInput` siempre entregan texto.
   Con `z.number()` un precio `"3989"` fallaría por ser string. `z.coerce`
   convierte antes de validar, así que `"3989"` pasa a `3989` y `"abc"` produce
   el mensaje "El precio debe ser un número". El schema valida y transforma en
   un solo paso.
3. **¿Por qué `z.infer` y no una interfaz manual?**: si escribimos a mano la
   interfaz y luego cambiamos una regla del schema, los dos archivos se
   desincronizan y TypeScript no avisa. Con `ItemFormData = z.infer<typeof
   itemSchema>` el tipo siempre refleja las reglas vigentes. `z.input` describe
   lo que recibe el formulario (texto por `coerce`) y `z.infer` lo que sale
   validado (números).
4. **¿Por qué el `Map` de ediciones locales?**: DummyJSON responde al `PUT`
   con el producto original y no guarda nada. Si solo hiciéramos
   `invalidateQueries`, el refetch traería el precio viejo y la edición
   desaparecería. Al guardar cada edición en `Map<number, Item>` dentro de
   `itemsApi.ts` y aplicarla en `fetchItems`/`fetchItemById`, el cambio
   sobrevive a cualquier recarga de la lista o del detalle durante la sesión.

## Semana 07 — Persistencia local

El dominio sigue siendo una **distribuidora de comida**: el catálogo de
productos, "Mi pedido" y el PIN de acceso a bodega. La Semana 07 agrega una
tercera pestaña, **Ajustes**, y persistencia local sin cambiar el modelo `Item`
(`name`, `description`, `price`, `unit`, `category`, `stock`, `image`).

### Qué se guarda y dónde

| Almacenamiento | Qué guarda | Por qué |
|---|---|---|
| **MMKV** (`react-native-mmkv` v4, `createMMKV`) | Preferencias del catálogo: ordenar por nombre/precio/existencias, orden ascendente/descendente, modo compacto y productos por página (5/10/20) | Es síncrono y muy rápido; los hooks `useMMKVString` / `useMMKVBoolean` / `useMMKVNumber` actualizan la UI en tiempo real, sin botón de guardar |
| **AsyncStorage** | Respaldo del catálogo (`@distribuidora/items_cache_v1`) con los `Item` traídos de DummyJSON | Permite mostrar la lista cuando falla la red. TanStack Query sigue siendo la fuente de verdad en línea; AsyncStorage solo es el respaldo offline |
| **SecureStore** (`expo-secure-store`) | PIN de acceso de bodega (`warehouse_pin`) | Es un dato sensible: el PIN se guarda cifrado en Keychain/Keystore. **Nunca** se guarda en MMKV ni en AsyncStorage, y la app solo comprueba si existe o si coincide, sin mostrarlo |

La dependencia `react-native-nitro-modules` acompaña a MMKV v4 (motor Nitro).
Toda la lógica de almacenamiento vive en `src/storage/`, `src/hooks/` y
`src/stores/`; las pantallas solo consumen hooks.

### Archivos nuevos

```
src/
├── storage/
│   ├── mmkv.ts           # Instancia createMMKV({ id: 'app-storage' })
│   └── itemsCache.ts     # saveItemsCache / loadItemsCache / clearItemsCache
├── hooks/
│   ├── usePreferences.ts # Preferencias MMKV con defaults y setters tipados
│   └── useSecureCode.ts  # PIN en SecureStore (hasCode / save / verify / remove)
├── stores/
│   └── offlineStore.ts   # isFromCache para avisar que la lista viene del respaldo
└── screens/
    └── SettingsScreen.tsx # Pestaña "Ajustes": preferencias + seguridad
```

Modified: `src/hooks/useItems.ts` (fallback a caché dentro del `queryFn`),
`src/screens/HomeScreen.tsx` (orden, modo compacto, paginación "Ver más" y
banner offline), `src/navigation/types.ts`, `src/navigation/RootNavigator.tsx`,
`package.json` (script `tsc`), `.gitignore` y este README. Catálogo, detalle,
creación, edición, carrito, traducciones, imágenes y estilos de la Semana 06
quedan intactos.

### Build nativo y comprobación de tipos

```bash
pnpm install
pnpm exec tsc --noEmit   # o: pnpm tsc

pnpm expo run:android    # genera y abre android/ (ignorado por git)
pnpm expo run:ios        # genera y abre ios/ (ignorado por git)
```

MMKV/Nitro y SecureStore necesitan código nativo: **no funcionan en Expo Go**.
Por eso el build se hace con `pnpm expo run:android` o `pnpm expo run:ios`.

### Cómo probar offline

1. Con la app recién abierta y con internet, entra al catálogo: `fetchItems()`
   guarda la lista en AsyncStorage (`saveItemsCache`).
2. Activa el modo avión del dispositivo (o corta el wifi) y haz pull-to-refresh
   en el catálogo. `useItems` intenta la API, falla y lee `loadItemsCache()`.
3. Debe aparecer el banner **"⚠️ Sin red — mostrando datos guardados"** y la
   lista con los mismos productos. Si no hay caché, se mantiene el error de red.
4. En **Ajustes** cambia el orden, el modo compacto y los productos por página;
   comprueba que el catálogo reacciona al instante y que los valores siguen
   después de cerrar y reabrir la app.
5. En **Seguridad**, guarda un PIN de 4 o más dígitos, verifícalo con otro
   valor (debe decir "PIN incorrecto") y elimínalo. El PIN nunca se muestra.
