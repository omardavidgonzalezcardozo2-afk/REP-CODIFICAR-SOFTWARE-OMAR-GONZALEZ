/**
 * HomeScreen
 * Pantalla principal del catálogo de la distribuidora de alimentos.
 * Muestra un buscador y una FlatList filtrable por nombre, SKU o categoría.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ListRenderItem,
} from 'react-native';
import { Item } from '../types';
import { PRODUCTS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

// Separador entre tarjetas. Se define fuera del componente para que
// no se vuelva a crear en cada render.
const ItemSeparator = (): React.JSX.Element => <View style={styles.separator} />;

export function HomeScreen(): React.JSX.Element {
  // Texto que escribe el usuario en el buscador (input controlado)
  const [query, setQuery] = useState<string>('');

  // useMemo: el filtrado solo se recalcula cuando cambia `query`,
  // no en cada render. Busca por nombre, SKU o categoría sin distinguir
  // mayúsculas de minúsculas.
  const filteredItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(text) ||
        p.sku.toLowerCase().includes(text) ||
        p.category.toLowerCase().includes(text),
    );
  }, [query]);

  // Estado vacío: se muestra cuando la búsqueda no encuentra resultados.
  // useCallback evita recrear la función mientras `query` no cambie.
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
        <Text style={styles.emptySubText}>
          Prueba con otro nombre, un código SKU o una categoría como "lácteos".
        </Text>
      </View>
    ),
    [query],
  );

  // renderItem memorizado: dibuja una tarjeta por producto.
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={() => {}} />,
    [],
  );

  return (
    // KeyboardAvoidingView: evita que el teclado tape la lista.
    // iOS usa 'padding' y Android usa 'height'.
    <KeyboardAvoidingView
      style={styles.kvContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Pressable: tocar fuera del buscador cierra el teclado */}
      <Pressable
        style={styles.inner}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto, SKU o categoría..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            keyboardType="default"
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>

        {/* FlatList (no ScrollView): virtualiza y solo renderiza lo visible.
            keyExtractor usa el id único del producto, nunca el índice. */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </Pressable>
    </KeyboardAvoidingView>
  );
}

// Todos los valores salen de las constantes de src/theme (sin números sueltos).
const styles = StyleSheet.create({
  kvContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  listContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  separator: {
    height: 1,
  marginHorizontal: SPACING.base,
    backgroundColor: COLORS.borderLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});