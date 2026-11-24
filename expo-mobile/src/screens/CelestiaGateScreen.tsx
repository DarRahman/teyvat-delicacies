import React, { useEffect, useRef, useState } from 'react';
import { ASSET_ICONS } from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  TeyvatImage,
} from '../components/TeyvatUI';

export const CelestiaGateScreen: React.FC = () => {
  const enterTeyvat = useDelicaciesStore((s) => s.enterTeyvat);
  const profile = useDelicaciesStore((s) => s.profile);

  const [isEntering, setIsEntering] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleBegin = () => {
    if (isEntering) return;
    setIsEntering(true);
    timerRef.current = window.setTimeout(() => {
      enterTeyvat();
    }, 640);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#ECE5D8]">
      {/* High-Resolution Static Daylight Door of Celestia Backdrop */}
      <img
        src={ASSET_ICONS.celestiaDoor}
        alt="Gerbang Celestia Teyvat"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
          isEntering ? 'scale-[1.12]' : 'scale-[1.02]'
        }`}
      />

      {/* Subtle Top Sky Contrast Veil (keeps azure daylight sky crisp without dark slop) */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[36%] z-10 pointer-events-none transition-opacity duration-300 ${
          isEntering ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(180deg, rgba(23, 36, 68, 0.56) 0%, rgba(30, 52, 92, 0.22) 58%, transparent 100%)',
        }}
      />

      {/* Soft Luminous Daylight Cloud Mist at Bottom */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-[34%] z-10 pointer-events-none transition-opacity duration-300 ${
          isEntering ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(0deg, rgba(236, 229, 216, 0.92) 0%, rgba(248, 245, 238, 0.52) 55%, transparent 100%)',
        }}
      />

      {/* Radiant Celestial Godray Whiteout Bloom Dissolve */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-500 ease-out ${
          isEntering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #FFFFFF 0%, #FFFDF5 48%, #FFE7A5 100%)',
        }}
      />

      {/* Top Golden Emblem & Title */}
      <header
        className={`relative z-20 px-6 pt-11 text-center flex flex-col items-center transition-opacity duration-300 ${
          isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          className="w-14 h-14 rounded-full border-2 border-[#FFE7A5] flex items-center justify-center mb-3 animate-float-slow shadow-[0_6px_18px_rgba(24,35,64,0.32)]"
          style={{
            background:
              'radial-gradient(circle at center, #FFFDF8 0%, #EFE8D8 80%)',
          }}
        >
          <TeyvatImage
            src={ASSET_ICONS.mora}
            fallbackSrc={ASSET_ICONS.moraCdn}
            alt="Lambang Teyvat Delicacies"
            className="w-8 h-8 object-contain"
          />
        </div>

        <h1 className="font-genshin text-[28px] leading-tight text-[#FFFDF5] tracking-wide drop-shadow-[0_2px_10px_rgba(20,30,58,0.68)]">
          Teyvat Delicacies
        </h1>

        <div className="w-40 mt-2.5">
          <DiamondDivider dark />
        </div>
      </header>

      {/* Center Unobstructed View of the Daylight Celestia Stone Door */}
      <div className="relative z-10 flex-1 pointer-events-none" />

      {/* Minimalist Bottom Traveler Pill & Single Iconic CTA */}
      <footer
        className={`relative z-20 px-6 pb-9 pt-4 flex flex-col items-center gap-3.5 transition-opacity duration-300 ${
          isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Discrete Warm Ivory Traveler Identity Pill */}
        <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[#FAF8F2]/92 border border-[#C8A86B] shadow-[0_4px_14px_rgba(44,38,24,0.16)] backdrop-blur-sm">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C8A86B] bg-[#1E263A] shrink-0">
            <TeyvatImage
              src={profile.avatarUrl}
              fallbackSrc={profile.fallbackAvatarUrl}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-genshin text-[11.5px] text-[#242735] tabular-nums whitespace-nowrap">
            {profile.username} · UID {profile.uid} · AR {profile.adventureRank}
          </span>
        </div>

        {/* Single Radiant Primary Action Button */}
        <div className="w-full max-w-[310px]">
          <GoldCapsuleButton
            onClick={handleBegin}
            className="min-h-[50px] text-[14px] shadow-[0_6px_20px_rgba(74,56,22,0.28)]"
          >
            <DiamondStar size={11} className="text-[#9C5A14]" />
            <span>Ketuk untuk Memulai</span>
            <DiamondStar size={11} className="text-[#9C5A14]" />
          </GoldCapsuleButton>
        </div>

        <p className="font-genshin text-[10px] tracking-[0.22em] text-[#4C4537] uppercase animate-pulse-soft">
          Click to Begin
        </p>
      </footer>
    </div>
  );
};
