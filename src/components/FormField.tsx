// src/components/FormField.tsx
// Campo de texto reutilizable para los formularios de la app.
// Usa Controller de React Hook Form porque TextInput no se puede enlazar
// con el patrón de inputs del DOM (no hay atributo `name` ni eventos nativos
// equivalentes). Tipado con genéricos reales, sin atajos de tipado.

import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// ============================================================
// TIPOS
// ============================================================

interface FormFieldProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformed,
> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<TFieldValues, TContext, TTransformed>;
  name: FieldPath<TFieldValues>;
  label: string;
  errorMessage?: string;
}

// ============================================================
// COMPONENTE
// ============================================================

export function FormField<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformed = TFieldValues,
>({
  control,
  name,
  label,
  errorMessage,
  style,
  ...inputProps
}: FormFieldProps<TFieldValues, TContext, TTransformed>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...inputProps}
            style={[styles.input, !!errorMessage && styles.inputError, style]}
            value={value == null ? '' : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={COLORS.textMuted}
          />
        )}
      />

      {/* Reservamos el espacio para que el layout no salte al mostrar errores. */}
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
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    minHeight: 18,
  },
});
