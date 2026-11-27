// src/storage/mmkv.ts
// Instancia única de MMKV para las preferencias de la app.
// MMKV es síncrono y muy rápido: ideal para ajustes que cambian en vivo.
// NUNCA se guardan aquí secretos (PIN, tokens ni contraseñas):
// esos datos van en SecureStore.

import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'app-storage' });
