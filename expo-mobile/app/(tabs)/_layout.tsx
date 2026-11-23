import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';

export default function TabLayout() {
  const cart = useDelicaciesStore((s) => s.cart);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFE7A5',
        tabBarInactiveTintColor: '#A7ADC0',
        tabBarStyle: {
          backgroundColor: '#1E2435',
          borderTopColor: '#C8A86B40',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon symbol="◆" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarLabel: 'Katalog',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon symbol="✦" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarLabel: 'Keranjang',
          tabBarBadge: totalCartCount > 0 ? totalCartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#C24B38',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon symbol="◈" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon symbol="❖" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ symbol, color, focused }: { symbol: string; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Text style={[styles.iconText, { color }]}>{symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    transform: [{ scale: 1.15 }],
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
