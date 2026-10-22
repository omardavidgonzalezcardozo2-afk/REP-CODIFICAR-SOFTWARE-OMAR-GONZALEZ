/**
 * ItemCard
 * Tarjeta reutilizable que muestra un producto de la distribuidora:
 * nombre, SKU, presentación, precio, stock y categoría.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  // Estilo dinámico: el color del stock depende de la cantidad disponible.
  // 0 = agotado (rojo), 20 o menos = poco stock (naranja), más = normal (verde).
  const stockColor =
    item.stock === 0
      ? COLORS.error
      : item.stock <= 20
        ? COLORS.warning
        : COLORS.success;
  const stockLabel = item.stock === 0 ? 'Agotado' : `Stock: ${item.stock}`;

  // Precio en COP con separador de miles (ej. $48.000)
  const priceLabel = `$${item.price.toLocaleString('es-CO')}`;

  return (
    <Pressable
      // Array de estilos: el estilo base + el de "presionado" solo mientras se toca
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Text style={styles.itemName}>{item.name}</Text>

      <Text style={styles.fieldText}>
        SKU: {item.sku} · {item.unit}
      </Text>

      <View style={styles.row}>
        <Text style={styles.price}>{priceLabel}</Text>
        {/* Estilo en línea solo para el color dinámico del stock */}
        <Text style={[styles.fieldText, { color: stockColor }]}>
          {stockLabel}
        </Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.category}</Text>
      </View>
    </Pressable>
  );
}

// Todos los valores salen de src/theme (sin números ni colores sueltos).
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  itemName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  fieldText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
    textTransform: 'capitalize',
  },
});