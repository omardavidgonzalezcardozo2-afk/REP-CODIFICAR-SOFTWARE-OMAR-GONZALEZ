// src/screens/DetailScreen.tsx
// Pantalla de detalle — recibe los datos del producto seleccionado via params.
// Los params llegan del Stack Navigator cuando se llama navigate('HomeDetail', {...}).

import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

// Formatea el precio en pesos colombianos: 132000 → "$ 132.000 COP"
function formatPrice(value: number): string {
  return `$ ${value.toLocaleString('es-CO')} COP`;
}

export function DetailScreen(): React.JSX.Element {
  // useRoute devuelve los params pasados desde HomeScreen
  const route = useRoute<RouteProp<HomeStackParamList, 'HomeDetail'>>();
  const {
    id,
    name,
    category,
    price,
    unit,
    stock,
    supplier,
    requiresRefrigeration,
    image,
  } = route.params;

  // Regla de negocio: menos de 20 unidades se considera stock bajo
  const isLowStock = stock < 20;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Imagen del producto */}
      {image ? (
        <Image source={image} style={styles.heroImage} resizeMode="cover" />
      ) : (
        <View style={styles.heroPlaceholder}>
          <Text style={styles.heroPlaceholderText}>
            {category.slice(0, 2).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Título del producto */}
      <Text style={styles.name}>{name}</Text>

      {/* Badge con el ID */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>ID: {id}</Text>
      </View>

      {/* Campos del dominio — mismo patrón label/value */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Categoría</Text>
        <Text style={styles.fieldValue}>{category}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Precio de venta</Text>
        <Text style={styles.priceValue}>{formatPrice(price)}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Unidad de venta</Text>
        <Text style={styles.fieldValue}>{unit}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Stock disponible</Text>
        <Text style={styles.fieldValue}>{stock} unidades</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Proveedor</Text>
        <Text style={styles.fieldValue}>{supplier}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Refrigeración</Text>
        <Text style={styles.fieldValue}>
          {requiresRefrigeration
            ? 'Sí, requiere cadena de frío'
            : 'No requiere refrigeración'}
        </Text>
      </View>

      {/* Aviso visual: cadena de frío */}
      {requiresRefrigeration && (
        <View style={[styles.notice, styles.noticeInfo]}>
          <Ionicons name="snow" size={20} color={COLORS.info} />
          <Text style={[styles.noticeText, styles.noticeTextInfo]}>
            Mantener entre 2 °C y 8 °C durante el almacenamiento y el
            transporte.
          </Text>
        </View>
      )}

      {/* Aviso visual: stock bajo */}
      {isLowStock && (
        <View style={[styles.notice, styles.noticeWarning]}>
          <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
          <Text style={[styles.noticeText, styles.noticeTextWarning]}>
            Stock bajo: quedan {stock} unidades. Conviene reabastecer con{' '}
            {supplier}.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.md,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
  },
  heroPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroPlaceholderText: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    letterSpacing: 2,
  },
  name: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.accent,
  },
  field: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  priceValue: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
  },
  noticeInfo: {
    backgroundColor: 'rgba(88, 166, 255, 0.12)',
    borderColor: COLORS.info,
  },
  noticeWarning: {
    backgroundColor: 'rgba(240, 136, 62, 0.12)',
    borderColor: COLORS.warning,
  },
  noticeText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: 19,
  },
  noticeTextInfo: {
    color: COLORS.info,
  },
  noticeTextWarning: {
    color: COLORS.warning,
  },
});
