import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';

/**
 * Bottom Tab Navigator - Teyvat Delicacies (Expo Router)
 * 
 * Memenuhi Ketentuan Penerapan Expo Router Soal 4:
 * 3. Tab Navigation: Menggunakan Tab Navigator dengan menu Beranda, Katalog, Keranjang, Profil.
 * 4. Nested Navigation: Berada di dalam tumpukan Root Stack Navigator.
 */
export default function TabLayout() {
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
      {/* 1. Halaman Beranda */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="◆" color={color} focused={focused} />
          ),
        }}
      />

      {/* 2. Halaman Katalog Makanan */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarLabel: 'Katalog',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="✦" color={color} focused={focused} />
          ),
        }}
      />

      {/* 3. Halaman Keranjang Belanja */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarLabel: 'Keranjang',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="◈" color={color} focused={focused} />
          ),
        }}
      />

      {/* 4. Halaman Profil Pengguna */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="❖" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color, focused }: { label: string; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Text style={[styles.iconText, { color }]}>{label}</Text>
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
