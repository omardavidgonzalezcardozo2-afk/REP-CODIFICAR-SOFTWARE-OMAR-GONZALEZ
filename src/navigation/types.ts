// src/navigation/types.ts
// Tipos de parámetros para los navigators del proyecto.

export type RootTabParamList = {
  Home: undefined;
  Saved: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: number;
    name: string;
  };
  CreateProduct: undefined;
};
