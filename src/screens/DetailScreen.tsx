// src/screens/DetailScreen.tsx
// Pantalla de detalle: muestra la información completa de un ítem
// y permite guardarlo / quitarlo usando el store de Zustand.
// Esta pantalla demuestra cómo acceder al store desde cualquier screen.

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

import { ITEMS } from '../data/mockData';
import { useCartStore } from '../stores/cartStore';
import type { Item } from '../types';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

// ============================================================
// PANTALLA: DetailScreen
// ============================================================

export function DetailScreen(): React.JSX.Element {
    const route = useRoute<DetailRouteProp>();
  const { id, name } = route.params;

  const item: Item | undefined = ITEMS.find((i) => i.id === id);

  // Se suscribe al dato (no a la función isItemSaved) para que el botón se actualice
  const isSaved = useCartStore((state) => state.items.some((i) => i.id === id));
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleToggleSave = (): void => {
    if (isSaved) {
      removeItem(id);
    } else if (item) {
      addItem(item);
    }
  };
  return (
    <View style={styles.container}>
      {/* Imagen del ítem */}
      {item && (
        <Image
          source={item.image}
          style={styles.hero}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}

      {/* Información principal */}
      <View style={styles.info}>
        <Text style={styles.title}>{name}</Text>
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
      

      {/* ──────────────────────────────────────────────────── */}
      {/* BOTÓN GUARDAR / QUITAR — conectado al store Zustand  */}
      {/* ──────────────────────────────────────────────────── */}
      {/* Este botón demuestra el estado compartido entre pantallas:
          al guardar aquí, el badge del Tab "Guardados" se actualiza
          automáticamente sin necesidad de pasar props ni callbacks. */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          isSaved && styles.saveButtonActive,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleToggleSave}
        testID="save-button"
      >
        <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
          {isSaved ? '★  Guardado' : '☆  Guardar'}
        </Text>
      </Pressable>
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
    padding: SPACING.lg,
    gap: SPACING.lg,
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
  price: { ...TYPOGRAPHY.h3, color: COLORS.success },
  meta: { ...TYPOGRAPHY.caption, marginTop: SPACING.sm },
  saveButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: 'auto',
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
});
