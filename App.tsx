/**
 * App
 * Punto de entrada visual de la aplicación.
 * Aplica el fondo del tema y renderiza la pantalla principal del catálogo.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { COLORS } from './src/theme';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      {/* style="light": íconos claros de la barra de estado sobre fondo oscuro */}
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});