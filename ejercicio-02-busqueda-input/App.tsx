import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ListRenderItem,
} from 'react-native';

interface Contact {
  id: string;
  name: string;
  phone: string;
  category: 'familia' | 'trabajo' | 'amigos';
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Ana García', phone: '555-0101', category: 'familia' },
  { id: '2', name: 'Bruno Martínez', phone: '555-0102', category: 'trabajo' },
  { id: '3', name: 'Carmen López', phone: '555-0103', category: 'amigos' },
  { id: '4', name: 'Diego Rodríguez', phone: '555-0104', category: 'trabajo' },
  { id: '5', name: 'Elena Sánchez', phone: '555-0105', category: 'familia' },
  { id: '6', name: 'Felipe Torres', phone: '555-0106', category: 'amigos' },
  { id: '7', name: 'Gabriela Moreno', phone: '555-0107', category: 'trabajo' },
  { id: '8', name: 'Héctor Jiménez', phone: '555-0108', category: 'familia' },
  { id: '9', name: 'Isabel Ruiz', phone: '555-0109', category: 'amigos' },
  { id: '10', name: 'Javier Herrera', phone: '555-0110', category: 'trabajo' },
  { id: '11', name: 'Karen Díaz', phone: '555-0111', category: 'familia' },
  { id: '12', name: 'Luis Álvarez', phone: '555-0112', category: 'amigos' },
  { id: '13', name: 'María Romero', phone: '555-0113', category: 'trabajo' },
  { id: '14', name: 'Nicolás Vargas', phone: '555-0114', category: 'amigos' },
  { id: '15', name: 'Olivia Castro', phone: '555-0115', category: 'familia' },
  { id: '16', name: 'Pedro Guerrero', phone: '555-0116', category: 'trabajo' },
  { id: '17', name: 'Quintín Reyes', phone: '555-0117', category: 'amigos' },
  { id: '18', name: 'Rosa Mendoza', phone: '555-0118', category: 'familia' },
];

const CATEGORY_COLOR: Record<Contact['category'], string> = {
  familia: '#3fb950',
  trabajo: '#61DAFB',
  amigos: '#f0883e',
};

export default function App(): React.JSX.Element {
  // PASO 1: estado del buscador (input controlado)
  const [query, setQuery] = useState<string>('');

  // PASO 2: filtrado con useMemo (sin importar mayúsculas/minúsculas).
  // Solo se recalcula cuando cambia `query`.
  const filteredContacts = useMemo(() => {
    if (!query.trim()) return CONTACTS;
    const lower = query.toLowerCase();
    return CONTACTS.filter(
      (c) => c.name.toLowerCase().includes(lower) || c.phone.includes(lower),
    );
  }, [query]);

  // PASO 3: mensaje cuando la búsqueda no encuentra nada
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
        <Text style={styles.emptySubText}>Intenta con otro nombre o número</Text>
      </View>
    ),
    [query],
  );

  // Cómo se dibuja cada contacto
  const renderItem: ListRenderItem<Contact> = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [
          styles.contactItem,
          pressed && styles.contactItemPressed,
        ]}
      >
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: CATEGORY_COLOR[item.category] + '33' },
          ]}
        >
          <Text
            style={[styles.categoryText, { color: CATEGORY_COLOR[item.category] }]}
          >
            {item.category}
          </Text>
        </View>
      </Pressable>
    ),
    [],
  );

  // PASO 4: KeyboardAvoidingView evita que el teclado tape la lista
  // (iOS usa 'padding', Android usa 'height') y tocar fuera cierra el teclado.
  return (
    <KeyboardAvoidingView
      style={styles.kvContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

          <View style={styles.searchContainer}>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar contacto por nombre o número..."
                placeholderTextColor="#8b949e"
                value={query}
                onChangeText={setQuery}
                keyboardType="default"
                returnKeyType="search"
                onSubmitEditing={Keyboard.dismiss}
              />
              {/* Botón para limpiar la búsqueda (funciona en iOS y Android) */}
              {query.length > 0 && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => setQuery('')}
                  accessibilityLabel="Limpiar búsqueda"
                >
                  <Text style={styles.clearText}>✕</Text>
                </Pressable>
              )}
            </View>
          </View>

          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kvContainer: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: '#e6edf3',
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#21262d',
  },
  clearText: {
    color: '#e6edf3',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0d1117',
  },
  contactItemPressed: {
    backgroundColor: '#161b22',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e6edf3',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#8b949e',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  separator: {
    height: 1,
    backgroundColor: '#21262d',
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#e6edf3',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8b949e',
    textAlign: 'center',
  },
});