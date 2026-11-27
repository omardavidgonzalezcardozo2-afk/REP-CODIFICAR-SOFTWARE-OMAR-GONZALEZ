// src/screens/HomeScreen.tsx
// Pantalla principal: catálogo cargado desde la API con useQuery.
// Maneja loading, error, vacío y pull-to-refresh.

import React, { useEffect, useMemo, useState } from 'react';
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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useItems } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import { useOfflineStore } from '../stores/offlineStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

// ============================================================
// SUB-COMPONENTE: ItemCard
// ============================================================

interface ItemCardProps {
  item: Item;
  compact: boolean;
  onPress: () => void;
}

function ItemCard({
  item,
  compact,
  onPress,
}: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.cardPressed,
      ]}
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
        {!compact ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardPrice}>
            ${item.price.toLocaleString('es-CO')} / {item.unit}
          </Text>
          {!compact ? (
            <Text style={styles.cardStock}>Existencias: {item.stock}</Text>
          ) : null}
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
  const { data, isLoading, isError, isFetching, refetch, error } = useItems();
  const { sortBy, sortOrder, compactMode, itemsPerPage } = usePreferences();
  const isFromCache = useOfflineStore((state) => state.isFromCache);
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage);

  // Al cambiar "Productos por página" volvemos a mostrar solo los primeros N.
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [itemsPerPage]);

  // Copia antes de ordenar: nunca mutamos el arreglo del caché de TanStack.
  const sortedItems = useMemo(() => {
    const copy = [...(data ?? [])];
    const direction = sortOrder === 'asc' ? 1 : -1;

    return copy.sort((a, b) => {
      if (sortBy === 'price') return (a.price - b.price) * direction;
      if (sortBy === 'stock') return (a.stock - b.stock) * direction;
      return a.name.localeCompare(b.name, 'es') * direction;
    });
  }, [data, sortBy, sortOrder]);

  const visibleItems = useMemo(
    () => sortedItems.slice(0, visibleCount),
    [sortedItems, visibleCount],
  );
  const hasMore = visibleCount < sortedItems.length;

  // ── Estado de carga (solo en el primer fetch) ──────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  // ── Estado de error sin datos en caché ────────────────────
  if (isError && !data) {
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

  const items = data ?? [];
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <ItemCard
      item={item}
      compact={compactMode}
      onPress={() =>
        navigation.navigate('HomeDetail', { id: item.id, name: item.name })
      }
    />
  );

  return (
    <View style={styles.container}>
      {isFromCache ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>
            ⚠️ Sin red — mostrando datos guardados
          </Text>
        </View>
      ) : null}
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // Pull-to-refresh: refetch vuelve a pedir la lista a la API.
        onRefresh={() => refetch()}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>
            {items.length} producto{items.length !== 1 ? 's' : ''} · $
            {total.toLocaleString('es-CO')}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay productos disponibles.</Text>
            <Pressable
              onPress={() => navigation.navigate('HomeCreate')}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Crear el primero</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <Pressable
              style={({ pressed }) => [
                styles.moreButton,
                pressed && styles.cardPressed,
              ]}
              onPress={() => setVisibleCount((count) => count + itemsPerPage)}
              accessibilityRole="button"
            >
              <Text style={styles.moreButtonText}>Ver más</Text>
            </Pressable>
          ) : undefined
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
  offlineBanner: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  offlineBannerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
    textAlign: 'center',
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
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
  cardCompact: {
    paddingVertical: SPACING.sm,
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
  moreButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  moreButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent,
    fontWeight: '600',
  },
});
