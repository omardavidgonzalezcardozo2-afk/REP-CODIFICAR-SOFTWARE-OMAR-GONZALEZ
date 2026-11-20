// src/screens/EditScreen.tsx
// Formulario de edición reutilizando FormField, CategoryField y el mismo
// schema Zod que CreateScreen. El estado del formulario vive en RHF,
// el estado del servidor en TanStack Query y el pedido en Zustand.

import React, { useEffect } from 'react';
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
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CategoryField } from '../components/CategoryField';
import { FormField } from '../components/FormField';
import { useItemById, useUpdateItem } from '../hooks/useItems';
import type { HomeStackParamList } from '../navigation/types';
import {
  itemSchema,
  type ItemFormData,
  type ItemFormInput,
} from '../schemas/itemSchema';
import { useCartStore } from '../stores/cartStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { UpdateItemPayload } from '../types';

type EditRouteProp = RouteProp<HomeStackParamList, 'HomeEdit'>;
type EditNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeEdit'>;

// ============================================================
// PANTALLA: EditScreen
// ============================================================

export function EditScreen(): React.JSX.Element {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation<EditNavProp>();
  const { id } = route.params;

  const { data: item, isLoading, isError, error, refetch } = useItemById(id);
  const { mutate, isPending, isError: isUpdateError, error: updateError } =
    useUpdateItem();

  // Estado del cliente: reemplaza la copia si el producto ya está en el pedido.
  const updateCartItem = useCartStore((state) => state.updateItem);

  // Entrada = texto (por z.coerce), salida = datos validados y numéricos.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
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

  // Cargamos el producto en el formulario cuando llega (o cuando cambia
  // tras un refetch). keepDirtyValues evita pisar lo que escribió el usuario.
  useEffect(() => {
    if (item) {
      reset(
        {
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          unit: item.unit,
          category: item.category,
        },
        { keepDirtyValues: true },
      );
    }
  }, [item, reset]);

  const isBusy = isSubmitting || isPending;
  const canSave = isDirty && !isBusy;

  // ==========================================================
  // ESTADOS DE CARGA Y ERROR DEL DETALLE
  // ==========================================================

  if (isLoading && !item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (isError && !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>No se pudo cargar el producto</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // ==========================================================
  // ENVÍO
  // ==========================================================

  function onSubmit(data: ItemFormData): void {
    const payload: UpdateItemPayload = { ...data, id };

    mutate(payload, {
      onSuccess: (updatedItem) => {
        // El carrito es estado de cliente: se actualiza aquí, no en el hook.
        updateCartItem(updatedItem);
        navigation.goBack();
      },
      onError: (mutationError) => {
        // El banner de abajo muestra el mensaje al usuario.
        if (__DEV__) {
          console.error('[EditScreen]', mutationError.message);
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
        <Text style={styles.sectionLabel}>Datos del producto</Text>

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
          <View style={[styles.field, styles.flexItem]}>
            <FormField
              control={control}
              name="price"
              label="Precio (COP) *"
              errorMessage={errors.price?.message}
              placeholder="3989"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.flexItem]}>
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

        {/* Error visible en pantalla: funciona igual en web y en móvil. */}
        {isUpdateError && updateError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{updateError.message}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.button, !canSave && styles.buttonDisabled]}
          onPress={() => void handleSubmit(onSubmit)()}
          disabled={!canSave}
          accessibilityRole="button"
        >
          {isBusy ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Guardar cambios</Text>
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
  flexItem: {
    flex: 1,
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
  errorTitle: {
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
