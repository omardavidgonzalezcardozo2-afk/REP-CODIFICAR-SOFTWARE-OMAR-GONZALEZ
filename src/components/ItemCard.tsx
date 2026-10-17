import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  const [added, setAdded] = useState<boolean>(false);

  function handlePress(): void {
    setAdded(!added);
    onPress(item);
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <View style={styles.row}>
          <Text style={styles.cardPrice}>${item.price.toLocaleString('es-CO')}</Text>
          <Text style={styles.cardStock}>Stock: {item.stock}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            added && styles.buttonAdded,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>
            {added ? '✓ Agregado al pedido' : 'Agregar al pedido'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 16,
    gap: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8b949e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3fb950',
  },
  cardStock: {
    fontSize: 13,
    color: '#8b949e',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#238636',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonAdded: {
    backgroundColor: '#1f6feb',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});