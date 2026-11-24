import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DiamondDivider,
  DiamondStar,
  TeyvatImage,
} from '../components/TeyvatUI';
import { ASSET_ICONS } from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { COLORS, FONTS } from '../theme/tokens';

export default function CelestiaGateScreen() {
  const insets = useSafeAreaInsets();
  const profile = useDelicaciesStore((s) => s.profile);

  const [isEntering, setIsEntering] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.58)).current;
  const whiteoutAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.02)).current;
  const uiFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.52,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);

  const handleBegin = () => {
    if (isEntering) return;
    setIsEntering(true);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.12,
        duration: 620,
        useNativeDriver: true,
      }),
      Animated.timing(uiFadeAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(whiteoutAnim, {
        toValue: 1,
        duration: 540,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/(tabs)');
    });
  };

  return (
    <Pressable
      onPress={handleBegin}
      accessibilityRole="button"
      accessibilityLabel="Click to Begin - Masuk ke Teyvat Delicacies"
      style={styles.container}
    >
      {/* Static Daylight Door of Celestia Backdrop */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={ASSET_ICONS.celestiaDoor}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityLabel="Gerbang Celestia Teyvat"
        />
      </Animated.View>

      {/* Top Sky Contrast Veil */}
      <Animated.View
        pointerEvents="none"
        style={[styles.topVeil, { opacity: uiFadeAnim }]}
      >
        <LinearGradient
          colors={[
            'rgba(23, 36, 68, 0.56)',
            'rgba(30, 52, 92, 0.22)',
            'rgba(30, 52, 92, 0)',
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Bottom Luminous Daylight Cloud Mist */}
      <Animated.View
        pointerEvents="none"
        style={[styles.bottomVeil, { opacity: uiFadeAnim }]}
      >
        <LinearGradient
          colors={[
            'rgba(248, 245, 238, 0)',
            'rgba(248, 245, 238, 0.58)',
            'rgba(236, 229, 216, 0.94)',
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Clean Top Golden Title (No Mora Medallion Above) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top + 38, 62), opacity: uiFadeAnim },
        ]}
      >
        <Text style={styles.title}>Teyvat Delicacies</Text>

        <View style={styles.dividerWrap}>
          <DiamondDivider dark />
        </View>
      </Animated.View>

      {/* Unobstructed View of the Celestia Stone Door */}
      <View style={styles.spacer} pointerEvents="none" />

      {/* Bottom Traveler Identity Pill & Authentic Genshin CLICK TO BEGIN Prompt */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 30, 44), opacity: uiFadeAnim },
        ]}
      >
        <View style={styles.travelerPill}>
          <View style={styles.avatarRing}>
            <TeyvatImage
              source={profile.avatarUrl}
              fallbackSource={profile.fallbackAvatarUrl}
              style={styles.avatarImg}
              contentFit="cover"
              accessibilityLabel={profile.username}
            />
          </View>
          <Text style={styles.travelerPillText} numberOfLines={1}>
            {profile.username} · UID {profile.uid} · AR {profile.adventureRank}
          </Text>
        </View>

        <Animated.View style={[styles.beginPromptRow, { opacity: pulseAnim }]}>
          <DiamondStar size={11} color="#B88732" strokeColor="#7C5314" />
          <Text style={styles.clickBeginText}>CLICK TO BEGIN</Text>
          <DiamondStar size={11} color="#B88732" strokeColor="#7C5314" />
        </Animated.View>
      </Animated.View>

      {/* Radiant Celestial Godray Whiteout Bloom */}
      <Animated.View
        pointerEvents="none"
        style={[styles.whiteoutOverlay, { opacity: whiteoutAnim }]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#FFFDF5', '#FFE7A5']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.parchmentMid,
    justifyContent: 'space-between',
  },
  topVeil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '34%',
    zIndex: 5,
  },
  bottomVeil: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '34%',
    zIndex: 5,
  },
  header: {
    zIndex: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.genshin,
    fontSize: 30,
    color: COLORS.inkCream,
    letterSpacing: 0.8,
    textAlign: 'center',
    textShadowColor: 'rgba(20, 30, 58, 0.78)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  dividerWrap: {
    width: 176,
    marginTop: 12,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    zIndex: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
  },
  travelerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 248, 242, 0.94)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    shadowColor: '#2C2618',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
    maxWidth: '100%',
  },
  avatarRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.chromeDeep,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  travelerPillText: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
    flexShrink: 1,
  },
  beginPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  clickBeginText: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    letterSpacing: 3.4,
    color: '#342F25',
    textShadowColor: 'rgba(255, 250, 236, 0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  whiteoutOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
  },
});
