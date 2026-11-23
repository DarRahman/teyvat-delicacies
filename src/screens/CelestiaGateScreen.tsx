import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
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

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#120F1D]">
      {/* Authentic Celestia Login Door Wallpaper */}
      <img
        src={ASSET_ICONS.celestiaDoor}
        alt="Gerbang Celestia Teyvat"
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03]"
      />
      {/* Measured contrast scrim so text remains WCAG AA legible */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#120F1D]/75 via-[#171421]/30 to-[#120F1D]/95"
        aria-hidden="true"
      />

      {/* Top Subtle Brand Mark & Traveler Context */}
      <header className="relative z-10 px-6 pt-10 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#171421]/75 border border-[#FFE7A5]/70 flex items-center justify-center shadow-[0_0_24px_rgba(255,231,165,0.28)] mb-3 animate-float-slow">
          <TeyvatImage
            src={ASSET_ICONS.mora}
            fallbackSrc={ASSET_ICONS.moraCdn}
            alt="Lambang Mora Teyvat"
            className="w-7 h-7 object-contain"
          />
        </div>
        <p className="text-[11px] font-medium tracking-[0.22em] text-[#FFE7A5]/90 uppercase">
          Kuliner Delapan Wilayah
        </p>
        <h1 className="font-genshin text-[26px] leading-tight text-[#FFF8E7] mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
          Teyvat Delicacies
        </h1>
        <div className="w-44 mt-3">
          <DiamondDivider dark />
        </div>
      </header>

      {/* Center Minimalist Celestial Gate Focus */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pointer-events-none">
        <div className="inline-flex items-center gap-2 text-[#FFE7A5]/90 animate-pulse-soft">
          <DiamondStar size={11} />
          <span className="text-[12px] tracking-[0.14em] font-medium text-[#F5F2EB] drop-shadow">
            Gerbang Dapur Teyvat Terbuka
          </span>
          <DiamondStar size={11} />
        </div>
      </div>

      {/* Bottom Interactive Entry Controls (Natural Thumb Zone) */}
      <footer className="relative z-10 px-6 pb-9 pt-4 flex flex-col items-center gap-3">
        <div className="w-full rounded-2xl bg-[#171421]/80 backdrop-blur-md border border-[#5D5187]/70 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#FFE7A5]/80 bg-[#252038] shrink-0">
              <TeyvatImage
                src={profile.avatarUrl}
                fallbackSrc={profile.fallbackAvatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[13px] font-semibold text-[#F5F2EB] truncate">
                {profile.username}
              </p>
              <p className="text-[11px] text-[#BFB6D4] tabular-nums">
                UID {profile.uid} · AR {profile.adventureRank}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#FFE7A5] shrink-0">
            Siap Masuk
          </span>
        </div>

        <GoldCapsuleButton onClick={() => enterTeyvat(true)}>
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>Ketuk untuk Masuk ke Teyvat</span>
        </GoldCapsuleButton>

        <button
          type="button"
          onClick={() => enterTeyvat(false)}
          className="min-h-[40px] px-4 py-1.5 text-[12px] font-medium text-[#CFC7DE] hover:text-[#FFE7A5] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] rounded-lg"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Masuk tanpa musik latar</span>
        </button>
      </footer>
    </div>
  );
};
