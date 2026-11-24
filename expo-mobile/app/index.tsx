import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  TeyvatImage,
} from '../components/TeyvatUI';
import { ASSET_ICONS } from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { COLORS, FONTS } from '../theme/tokens';

export default function CelestiaGateScreen() {
  const insets = useSafeAreaInsets();
  const profile = useDelicaciesStore((s) => s.profile);

  const [isEntering, setIsEntering] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.75)).current;
  const whiteoutAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.02)).current;
  const uiFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1900,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1900,
          useNativeDriver: true,
        }),
      ])
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.65,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();
    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim]);

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
    <View style={styles.container}>
      {/* Static Daylight Door of Celestia Backdrop */}
      <Animated.View
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
            'rgba(248, 245, 238, 0.55)',
            'rgba(236, 229, 216, 0.94)',
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Top Golden Emblem & Title */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top + 28, 52), opacity: uiFadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.emblemCircle,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <TeyvatImage
            source={ASSET_ICONS.mora}
            fallbackSource={ASSET_ICONS.moraCdn}
            style={styles.emblemImg}
            contentFit="contain"
            accessibilityLabel="Lambang Teyvat Delicacies"
          />
        </Animated.View>

        <Text style={styles.title}>Teyvat Delicacies</Text>

        <View style={styles.dividerWrap}>
          <DiamondDivider dark />
        </View>
      </Animated.View>

      {/* Unobstructed View of the Celestia Stone Door */}
      <View style={styles.spacer} pointerEvents="none" />

      {/* Minimalist Bottom Traveler Identity Pill & Iconic CTA */}
      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 24, 38), opacity: uiFadeAnim },
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

        <View style={styles.ctaWrap}>
          <GoldCapsuleButton
            onPress={handleBegin}
            contentStyle={styles.ctaContent}
          >
            <DiamondStar size={11} color="#9C5A14" />
            <Text style={styles.ctaText}>Ketuk untuk Memulai</Text>
            <DiamondStar size={11} color="#9C5A14" />
          </GoldCapsuleButton>
        </View>

        <Animated.Text style={[styles.clickBeginText, { opacity: pulseAnim }]}>
          CLICK TO BEGIN
        </Animated.Text>
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
    </View>
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
    height: '36%',
    zIndex: 5,
  },
  bottomVeil: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '36%',
    zIndex: 5,
  },
  header: {
    zIndex: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emblemCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: COLORS.goldBright,
    backgroundColor: '#F7F2E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#182340',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 6,
  },
  emblemImg: {
    width: 34,
    height: 34,
  },
  title: {
    fontFamily: FONTS.genshin,
    fontSize: 28,
    color: COLORS.inkCream,
    letterSpacing: 0.6,
    textAlign: 'center',
    textShadowColor: 'rgba(20, 30, 58, 0.72)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  dividerWrap: {
    width: 160,
    marginTop: 10,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    zIndex: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
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
  ctaWrap: {
    width: '100%',
    maxWidth: 310,
  },
  ctaContent: {
    minHeight: 50,
  },
  ctaText: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: '#2E3446',
  },
  clickBeginText: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#4C4537',
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
