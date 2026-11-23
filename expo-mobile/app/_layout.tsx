import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root Layout Navigator - Teyvat Delicacies (Expo Router)
 * 
 * Memenuhi Ketentuan Penerapan Expo Router Soal 4:
 * 1. File-Based Routing: file _layout.tsx sebagai pembungkus navigasi utama.
 * 2. Stack Navigation: Stack Navigator untuk mengatur tumpukan halaman.
 * 4. Nested Navigation: Tumpukan bertingkat antara Tabs dan Stack.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#ECE5D8" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ECE5D8' },
          animation: 'slide_from_right',
        }}
      >
        {/* Main Tab Navigation (Beranda, Katalog, Keranjang, Profil) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Detail Makanan dengan Parameter ID */}
        <Stack.Screen
          name="dish/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />

        {/* Simulasi Checkout */}
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />

        {/* Status & Konfirmasi Pesanan */}
        <Stack.Screen
          name="order/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}
