// src/screens/CreateScreen.tsx
// Formulario para crear un producto con React Hook Form + Zod.
// La validación la hace el resolver: no se guarda en estado local.
// Demuestra useMutation + estados isPending/error.

import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CategoryField } from '../components/CategoryField';
import { FormField } from '../components/FormField';
import { useCreateItem } from '../hooks/useItems';
import { itemSchema, type ItemFormData, type ItemFormInput } from '../schemas/itemSchema';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { CreateItemPayload } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeCreate'>;

// ============================================================
// PANTALLA: CreateScreen
// ============================================================

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();
  const { mutate, isPending, isError, error } = useCreateItem();

  // Con z.coerce.number() el tipo de entrada del formulario es texto
  // (`unknown` en Zod 4) y el tipo validado es numérico. Por eso usamos
  // los tres parámetros de useForm: entrada, contexto y salida.
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormInput, unknown, ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '0',
      unit: 'unidad',
      category: 'abarrotes',
    },
  });

  const isBusy = isSubmitting || isPending;

  // ==========================================================
  // ENVÍO
  // ==========================================================

  function onSubmit(data: ItemFormData): void {
    const payload: CreateItemPayload = {
      ...data,
      // Si el usuario deja la descripción vacía, conservamos el valor
      // por defecto que ya tenía la app en la Semana 5.
      description: data.description || 'Producto disponible para distribución.',
    };

    mutate(payload, {
      onSuccess: () => navigation.goBack(),
      onError: (mutationError) => {
        // El banner de abajo muestra el mensaje al usuario; en desarrollo
        // además lo registramos para depurar.
        if (__DEV__) {
          console.error('[CreateScreen]', mutationError.message);
        }
      },
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Datos del nuevo producto</Text>

        <FormField
          control={control}
          name="name"
          label="Nombre *"
          errorMessage={errors.name?.message}
          placeholder="Ej. Arroz Premium"
          returnKeyType="next"
          autoCapitalize="words"
        />

        <FormField
          control={control}
          name="description"
          label="Descripción"
          errorMessage={errors.description?.message}
          placeholder="Descripción del producto…"
          multiline
          numberOfLines={3}
          style={styles.multiline}
          textAlignVertical="top"
        />

        <View style={styles.row}>
          <View style={[styles.field, styles.flex]}>
            <FormField
              control={control}
              name="price"
              label="Precio (COP) *"
              errorMessage={errors.price?.message}
              placeholder="3989"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.flex]}>
            <FormField
              control={control}
              name="stock"
              label="Existencias"
              errorMessage={errors.stock?.message}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <FormField
          control={control}
          name="unit"
          label="Unidad *"
          errorMessage={errors.unit?.message}
          placeholder="kg, caja, unidad…"
        />

        <CategoryField
          control={control}
          name="category"
          label="Categoría"
          errorMessage={errors.category?.message}
        />

        {/* Los errores se muestran en pantalla para que funcionen también en web. */}
        {isError && error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error.message}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.button, isBusy && styles.buttonDisabled]}
          onPress={() => void handleSubmit(onSubmit)()}
          disabled={isBusy}
          accessibilityRole="button"
        >
          {isBusy ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Crear producto</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  field: {
    gap: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  multiline: {
    minHeight: 88,
    paddingTop: SPACING.sm,
  },
  errorBanner: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  errorBannerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.background,
  },
  cancel: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  cancelText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
});
