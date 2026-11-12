// src/screens/HomeScreen.tsx
// Pantalla principal: lista de productos cargada desde la API con useQuery.
// Maneja loading, error, vacío y pull-to-refresh.

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProducts } from '../hooks/useProducts';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Product } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

// ============================================================
// SUB-COMPONENTE: ProductCard
// ============================================================

interface ProductCardProps {
  item: Product;
  onPress: () => void;
}

function ProductCard({ item, onPress }: ProductCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      testID={`item-card-${item.id}`}
    >
      <Image
        source={item.image}
        style={styles.thumbnail}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardPrice}>
            ${item.price.toLocaleString('es-CO')} / {item.unit}
          </Text>
          <Text style={styles.cardStock}>Stock: {item.stock}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

// ============================================================
// PANTALLA: HomeScreen
// ============================================================

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { data, isLoading, isError, isFetching, refetch, error } = useProducts();

  // ── Estado de carga (solo en el primer fetch) ──────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  // ── Estado de error ────────────────────────────────────────
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>❌ No se pudo cargar el catálogo</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const products = data ?? [];
  const total = products.reduce((sum, product) => sum + product.price, 0);

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard
      item={item}
      onPress={() =>
        navigation.navigate('HomeDetail', { id: item.id, name: item.name })
      }
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // Pull-to-refresh: refetch vuelve a pedir la lista a la API.
        onRefresh={() => refetch()}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.sectionLabel}>
              {products.length} producto{products.length !== 1 ? 's' : ''} · $
              {total.toLocaleString('es-CO')}
            </Text>
            <Pressable
              onPress={() => navigation.navigate('CreateProduct')}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay productos disponibles.</Text>
            <Pressable
              onPress={() => navigation.navigate('CreateProduct')}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Crear el primero</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  addButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.background,
    fontWeight: '700',
  },
  separator: {
    height: SPACING.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  cardPressed: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  cardTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  cardDescription: {
    ...TYPOGRAPHY.caption,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  cardPrice: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  cardStock: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  chevron: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textMuted,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
