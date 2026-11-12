// src/screens/DetailScreen.tsx
// Detalle del producto. Usa useProductById para intentar traer
// datos frescos del servidor y mantiene el botón de "Mi pedido"
// conectado al store de Zustand.

import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { useProductById } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const { id, name } = route.params;

  const { data: item, isLoading, isError, refetch, error } = useProductById(id);

  // Selector específico: el botón se actualiza cuando cambia este producto.
  const isSaved = useCartStore((state) =>
    state.items.some((product) => product.id === id),
  );
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleToggleSave = (): void => {
    if (!item) return;

    if (isSaved) {
      removeItem(id);
    } else {
      addItem(item);
    }
  };

  // Solo mostramos el spinner si no tenemos ni siquiera datos en caché.
  if (isLoading && !item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando detalle...</Text>
      </View>
    );
  }

  if (isError && !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el detalle</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {item && (
        <Image
          source={item.image}
          style={styles.hero}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{item?.name ?? name}</Text>
        <Text style={styles.id}>ID: {id}</Text>

        {item && (
          <>
            <Text style={styles.price}>
              ${item.price.toLocaleString('es-CO')} / {item.unit}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>
              Categoría: {item.category} · Stock: {item.stock}
            </Text>
          </>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          isSaved && styles.saveButtonActive,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleToggleSave}
        disabled={!item}
        testID="save-button"
      >
        <Text
          style={[
            styles.saveButtonText,
            isSaved && styles.saveButtonTextActive,
          ]}
        >
          {isSaved ? '✓ Guardado en mi pedido' : '+ Guardar en mi pedido'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...TYPOGRAPHY.caption,
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  info: {
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  id: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginTop: SPACING.sm,
  },
  price: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
  },
  meta: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  saveButtonPressed: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  saveButtonTextActive: {
    color: COLORS.background,
  },
  errorText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.error,
    textAlign: 'center',
  },
  errorDetail: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  retryButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '600',
  },
});
