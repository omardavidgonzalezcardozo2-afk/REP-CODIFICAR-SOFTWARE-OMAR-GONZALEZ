// src/types/env.d.ts
// Expo inyecta process.env en tiempo de build.
// Declaramos solo la variable que usamos para no depender de @types/node.

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};
