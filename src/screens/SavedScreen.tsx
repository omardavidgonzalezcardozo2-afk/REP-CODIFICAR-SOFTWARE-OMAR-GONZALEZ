// src/screens/SavedScreen.tsx
// Segunda pestaña: "Mi pedido".
// Lee el estado de cliente desde Zustand (no desde TanStack Query).

import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';

import { useCartStore } from '../stores/cartStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Product } from '../types';

interface SavedItemProps {
  item: Product;
  onRemove: () => void;
}

function SavedItem({ item, onRemove }: SavedItemProps): React.JSX.Element {
  return (
    <View style={styles.card}>
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
        <Text style={styles.cardDescription} numberOfLines={1}>
          ${item.price.toLocaleString('es-CO')} / {item.unit}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.removeButton, pressed && { opacity: 0.6 }]}
        onPress={onRemove}
        accessibilityLabel={`Quitar ${item.name} de mi pedido`}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </Pressable>
    </View>
  );
}

export function SavedScreen(): React.JSX.Element {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearAll = useCartStore((state) => state.clearAll);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <SavedItem item={item} onRemove={() => removeItem(item.id)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.sectionLabel}>
                {items.length} producto{items.length !== 1 ? 's' : ''} · Total $
                {total.toLocaleString('es-CO')}
              </Text>
              <Pressable onPress={clearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Limpiar todo</Text>
              </Pressable>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Tu pedido está vacío</Text>
            <Text style={styles.emptySubtitle}>
              Ve al catálogo y agrega productos a tu pedido.
            </Text>
          </View>
        }
      />
    </View>
  );
}

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
  clearButton: {
    padding: SPACING.xs,
  },
  clearButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
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
  thumbnail: {
    width: 48,
    height: 48,
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
    color: COLORS.success,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 52,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
