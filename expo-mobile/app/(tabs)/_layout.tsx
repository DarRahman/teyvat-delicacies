import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Home, ShoppingBag, User, UtensilsCrossed } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import { CHROME_BAR_GRADIENT, COLORS, FONTS } from '../../theme/tokens';

function TabIconWithIndicator({
  focused,
  badgeCount,
  children,
}: {
  focused: boolean;
  badgeCount?: number;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.activeTopBar} />}
      <View style={styles.iconInner}>
        {children}
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const cart = useDelicaciesStore((s) => s.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabBarHeight = 64 + Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.goldBright,
        tabBarInactiveTintColor: COLORS.navInactive,
        tabBarLabelStyle: {
          fontFamily: FONTS.genshin,
          fontSize: 10,
          marginBottom: Math.max(insets.bottom, 6),
        },
        tabBarStyle: {
          height: tabBarHeight,
          borderTopWidth: 0,
          elevation: 12,
          backgroundColor: COLORS.chromeBottom,
          shadowColor: '#202638',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.14,
          shadowRadius: 12,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={CHROME_BAR_GRADIENT}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator focused={focused}>
              <Home size={19} color={color} />
            </TabIconWithIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator focused={focused}>
              <UtensilsCrossed size={19} color={color} />
            </TabIconWithIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator focused={focused} badgeCount={cartCount}>
              <ShoppingBag size={19} color={color} />
            </TabIconWithIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator focused={focused}>
              <User size={19} color={color} />
            </TabIconWithIndicator>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 56,
  },
  activeTopBar: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.goldBright,
  },
  iconInner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -11,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.goldWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontFamily: FONTS.genshin,
    fontSize: 9,
    color: '#FFF9EB',
  },
});
