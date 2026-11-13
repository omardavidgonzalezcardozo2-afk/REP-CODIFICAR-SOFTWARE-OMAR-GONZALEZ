// src/navigation/RootNavigator.tsx
// Tab Navigator (Catálogo / Mi pedido) + Stack anidado en Home.
// El Stack ahora tiene tres pantallas: lista, detalle y creación.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { useCartStore } from '../stores/cartStore';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.accent,
        headerTitleStyle: { fontWeight: 'bold' as const },
      }}
    >
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Catálogo',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('HomeCreate')}
              accessibilityLabel="Agregar producto"
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
            >
              <Ionicons name="add" size={28} color={COLORS.accent} />
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
      <HomeStack.Screen
        name="HomeCreate"
        component={CreateScreen}
        options={{ title: 'Nuevo producto', presentation: 'modal' }}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { backgroundColor: COLORS.surface },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName: keyof typeof Ionicons.glyphMap =
            route.name === 'Home'
              ? focused ? 'storefront' : 'storefront-outline'
              : focused ? 'cart' : 'cart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Catálogo' }} />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Mi pedido',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
