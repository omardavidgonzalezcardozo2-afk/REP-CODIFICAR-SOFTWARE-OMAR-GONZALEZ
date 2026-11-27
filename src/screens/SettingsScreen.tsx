// src/screens/SettingsScreen.tsx
// Tercera pestaña: "Ajustes".
// Preferencias del catálogo en MMKV (cambios en tiempo real) y PIN de bodega
// en SecureStore (nunca se muestra el valor guardado).

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  usePreferences,
  type ItemsPerPage,
  type SortBy,
  type SortOrder,
} from '../hooks/usePreferences';
import { useSecureCode } from '../hooks/useSecureCode';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// ============================================================
// SELECTOR REUTILIZABLE
// ============================================================

interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface OptionSelectorProps<T extends string | number> {
  label: string;
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
}

function OptionSelector<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionSelectorProps<T>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              style={({ pressed }) => [
                styles.optionButton,
                active && styles.optionButtonActive,
                pressed && styles.optionPressed,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.optionText,
                  active && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const SORT_OPTIONS: ReadonlyArray<Option<SortBy>> = [
  { value: 'name', label: 'Nombre' },
  { value: 'price', label: 'Precio' },
  { value: 'stock', label: 'Existencias' },
];

const ORDER_OPTIONS: ReadonlyArray<Option<SortOrder>> = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' },
];

const ITEMS_PER_PAGE_OPTIONS: ReadonlyArray<Option<ItemsPerPage>> = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
];

// ============================================================
// PANTALLA: SettingsScreen
// ============================================================

export function SettingsScreen(): React.JSX.Element {
  const {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();
  const { hasCode, isLoading, saveCode, verifyCode, removeCode } =
    useSecureCode();

  const [pin, setPin] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function showMessage(text: string, error = false): void {
    setMessage(text);
    setIsError(error);
  }

  async function handleSavePin(): Promise<void> {
    if (!/^\d{4,}$/.test(pin)) {
      showMessage('El PIN debe tener al menos 4 dígitos.', true);
      return;
    }

    const saved = await saveCode(pin);
    setPin('');
    showMessage(saved ? 'PIN guardado' : 'No se pudo guardar el PIN', !saved);
  }

  async function handleVerifyPin(): Promise<void> {
    const valid = await verifyCode(pin);
    setPin('');
    showMessage(valid ? 'PIN correcto' : 'PIN incorrecto', !valid);
  }

  async function handleRemovePin(): Promise<void> {
    const removed = await removeCode();
    setPin('');
    showMessage(removed ? 'PIN eliminado' : 'No se pudo eliminar el PIN', !removed);
  }

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
        <Text style={styles.sectionLabel}>Preferencias del catálogo</Text>
        <View style={styles.card}>
          <OptionSelector<SortBy>
            label="Ordenar por"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
          <OptionSelector<SortOrder>
            label="Orden"
            options={ORDER_OPTIONS}
            value={sortOrder}
            onChange={setSortOrder}
          />
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.fieldLabel}>Modo compacto</Text>
              <Text style={styles.fieldHint}>
                Muestra solo el nombre y el precio en cada tarjeta.
              </Text>
            </View>
            <Switch
              value={compactMode}
              onValueChange={setCompactMode}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.textPrimary}
              ios_backgroundColor={COLORS.border}
              accessibilityLabel="Modo compacto"
            />
          </View>
          <OptionSelector<ItemsPerPage>
            label="Productos por página"
            options={ITEMS_PER_PAGE_OPTIONS}
            value={itemsPerPage}
            onChange={setItemsPerPage}
          />
        </View>

        <Text style={[styles.sectionLabel, styles.securityTitle]}>Seguridad</Text>
        <View style={styles.card}>
          <Text style={styles.fieldHint}>
            {isLoading
              ? 'Comprobando PIN guardado…'
              : hasCode
                ? 'Ya hay un PIN de bodega configurado.'
                : 'Aún no hay un PIN de bodega configurado.'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>PIN de bodega (mínimo 4 dígitos)</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="number-pad"
              placeholder="••••"
              placeholderTextColor={COLORS.textMuted}
              accessibilityLabel="PIN de bodega"
            />
          </View>

          {message ? (
            <View
              style={[
                styles.messageBanner,
                isError && styles.messageBannerError,
              ]}
            >
              <Text
                style={[styles.messageText, isError && styles.messageTextError]}
              >
                {message}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => void handleSavePin()}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => void handleVerifyPin()}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Verificar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDanger]}
              onPress={() => void handleRemovePin()}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
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
  securityTitle: {
    marginTop: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  field: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  fieldHint: {
    ...TYPOGRAPHY.caption,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  optionButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    ...TYPOGRAPHY.caption,
  },
  optionTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  switchText: {
    flex: 1,
    gap: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body,
  },
  messageBanner: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  messageBannerError: {
    borderColor: COLORS.error,
  },
  messageText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
  },
  messageTextError: {
    color: COLORS.error,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '700',
  },
});
