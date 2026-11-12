// src/screens/CreateProductScreen.tsx
// Formulario para crear un producto.
// Demuestra useMutation + invalidateQueries + estados isPending/error.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCreateProduct } from '../hooks/useProducts';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { ProductCategory } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'CreateProduct'>;

const CATEGORIES: ProductCategory[] = [
  'granos',
  'lacteos',
  'carnes',
  'bebidas',
  'verduras',
  'abarrotes',
];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  granos: 'Granos',
  lacteos: 'Lácteos',
  carnes: 'Carnes',
  bebidas: 'Bebidas',
  verduras: 'Verduras',
  abarrotes: 'Abarrotes',
};

export function CreateProductScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();
  const { mutate, isPending, isError, error } = useCreateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [unit, setUnit] = useState('unidad');
  const [category, setCategory] = useState<ProductCategory>('abarrotes');
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(): void {
    const parsedPrice = Number(price.replace(',', '.'));
    const parsedStock = Number(stock);

    if (!name.trim()) {
      setFormError('El nombre del producto es obligatorio.');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError('El precio debe ser un número mayor que cero.');
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setFormError('El stock debe ser un número igual o mayor que cero.');
      return;
    }

    setFormError(null);

    mutate(
      {
        name: name.trim(),
        description: description.trim() || 'Producto disponible para distribución.',
        price: parsedPrice,
        stock: parsedStock,
        unit: unit.trim() || 'unidad',
        category,
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: (mutationError) =>
          Alert.alert('No se pudo crear el producto', mutationError.message),
      },
    );
  }

  const canSubmit = name.trim().length > 0 && price.trim().length > 0 && !isPending;

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

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Arroz Premium"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción del producto…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>
              Precio (COP) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="9800"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.flex]}>
            <Text style={styles.fieldLabel}>Stock</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Unidad</Text>
          <TextInput
            style={styles.input}
            value={unit}
            onChangeText={setUnit}
            placeholder="kg, caja, unidad…"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Categoría</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((option) => {
              const selected = category === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
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
        </View>

        {formError && <Text style={styles.errorText}>{formError}</Text>}
        {isError && <Text style={styles.errorText}>{error.message}</Text>}

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
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
  fieldLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  required: {
    color: COLORS.error,
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
  multiline: {
    minHeight: 88,
    paddingTop: SPACING.sm,
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
  errorText: {
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
