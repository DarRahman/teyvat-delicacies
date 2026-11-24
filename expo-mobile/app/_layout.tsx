import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TeyvatToast } from '../components/TeyvatUI';
import { LOCAL_ASSETS } from '../data/assets';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { COLORS, FONTS } from '../theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FONTS.genshin]: LOCAL_ASSETS.fonts.genshin,
  });

  const toastMessage = useDelicaciesStore((s) => s.toastMessage);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.parchmentMid },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Gerbang Celestia',
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              title: 'Teyvat Delicacies',
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="dish/[id]"
            options={{
              title: 'Dossier Resep',
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              title: 'Checkout Pengantaran',
            }}
          />
          <Stack.Screen
            name="order/[id]"
            options={{
              title: 'Pelacakan Pesanan',
            }}
          />
        </Stack>

        <TeyvatToast message={toastMessage} topOffset={55} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.parchmentMid,
  },
});
