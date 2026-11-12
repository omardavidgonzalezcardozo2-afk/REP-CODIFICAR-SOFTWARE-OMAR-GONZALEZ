// src/navigation/RootNavigator.tsx
// Tab Navigator (Catálogo / Mi pedido) + Stack anidado en Home.
// El Stack ahora tiene tres pantallas: lista, detalle y creación.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { CreateProductScreen } from '../screens/CreateProductScreen';
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
              onPress={() => navigation.navigate('CreateProduct')}
              accessibilityLabel="Agregar producto"
              hitSlop={8}
            >
              <Text style={{ color: COLORS.accent, fontSize: 26, fontWeight: '300' }}>
                +
              </Text>
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
        name="CreateProduct"
        component={CreateProductScreen}
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
              ? focused
                ? 'storefront'
                : 'storefront-outline'
              : focused
                ? 'cart'
                : 'cart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Catálogo' }}
      />
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
