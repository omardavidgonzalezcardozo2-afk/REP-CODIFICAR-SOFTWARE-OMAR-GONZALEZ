// App.tsx — Semana 05: Networking y TanStack Query
// QueryClientProvider en la raíz + navegación.
//
// Regla importante:
//   - Estado del servidor (catálogo, loading, error) → TanStack Query
//   - Estado del cliente (mi pedido) → Zustand

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';

// Una sola instancia de QueryClient por app.
// Se crea fuera del componente para que no se recree en cada render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
