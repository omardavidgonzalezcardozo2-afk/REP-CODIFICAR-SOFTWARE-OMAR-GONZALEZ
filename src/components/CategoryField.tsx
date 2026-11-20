// src/components/CategoryField.tsx
// Selector de categoría (chips) reutilizable, conectado al formulario
// con Controller. Mismo patrón genérico que FormField, sin atajos de tipado.

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import {
  CATEGORIES,
  CATEGORY_LABELS,
  type ProductCategory,
} from '../constants/categories';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// ============================================================
// TIPOS
// ============================================================

interface CategoryFieldProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformed,
> {
  control: Control<TFieldValues, TContext, TTransformed>;
  name: FieldPath<TFieldValues>;
  label: string;
  errorMessage?: string;
}

// ============================================================
// COMPONENTE
// ============================================================

export function CategoryField<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformed = TFieldValues,
>({
  control,
  name,
  label,
  errorMessage,
}: CategoryFieldProps<TFieldValues, TContext, TTransformed>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={styles.chips}>
            {CATEGORIES.map((option) => {
              const selected = value === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => onChange(option satisfies ProductCategory)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {CATEGORY_LABELS[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />

      {/* Espacio reservado para el error de Zod. */}
      <Text style={styles.error}>{errorMessage ?? ''}</Text>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.card,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.background,
    fontWeight: '700',
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    minHeight: 18,
  },
});
