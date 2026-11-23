import React, { useEffect, useRef, useState } from 'react';
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

  const [transitionMode, setTransitionMode] = useState<'idle' | 'video' | 'fallback'>('idle');
  const [whiteoutBloom, setWhiteoutBloom] = useState(false);
  const pendingBgmRef = useRef<boolean>(true);
  const finishedRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const triggerWhiteoutAndEnter = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    setWhiteoutBloom(true);
    const crossfadeTimer = window.setTimeout(() => {
      enterTeyvat(pendingBgmRef.current);
    }, 450);
    timersRef.current.push(crossfadeTimer);
  };

  const triggerFallbackFlare = () => {
    if (finishedRef.current) return;
    setTransitionMode('fallback');
    setWhiteoutBloom(true);
    const timer = window.setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        enterTeyvat(pendingBgmRef.current);
      }
    }, 620);
    timersRef.current.push(timer);
  };

  const startGateTransition = (withBgm: boolean) => {
    if (transitionMode !== 'idle') return;
    pendingBgmRef.current = withBgm;
    setTransitionMode('video');

    // Safety timer aligned with ~3-second daylight Celestia door-opening video
    const peakTimer = window.setTimeout(() => {
      triggerWhiteoutAndEnter();
    }, 2950);
    timersRef.current.push(peakTimer);
  };

  useEffect(() => {
    if (transitionMode !== 'video') return;
    const videoEl = videoRef.current;
    if (!videoEl) {
      triggerFallbackFlare();
      return;
    }

    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        clearTimers();
        triggerFallbackFlare();
      });
    }
  }, [transitionMode]);

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (!videoEl || finishedRef.current) return;
    if (videoEl.currentTime >= 2.65) {
      triggerWhiteoutAndEnter();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#1A1F2C]">
      {/* Static Celestia Door Background (idle & fallback base) */}
      <img
        src={ASSET_ICONS.celestiaDoor}
        alt="Gerbang Celestia Teyvat"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ${
          transitionMode !== 'idle' ? 'scale-110' : 'scale-[1.03]'
        }`}
      />

      {/* Full-Screen Cinematic Gate-Opening Video (Zero Black Letterboxing via object-cover) */}
      {transitionMode === 'video' && (
        <video
          ref={videoRef}
          playsInline
          muted
          preload="auto"
          poster={ASSET_ICONS.celestiaDoor}
          onTimeUpdate={handleTimeUpdate}
          onEnded={triggerWhiteoutAndEnter}
          onError={() => {
            clearTimers();
            triggerFallbackFlare();
          }}
          className="absolute inset-0 z-20 w-full h-full object-cover object-center"
        >
          <source src={ASSET_ICONS.celestiaDoorVideoWebm} type="video/webm" />
          <source src={ASSET_ICONS.celestiaDoorVideoMp4} type="video/mp4" />
        </video>
      )}

      {/* Radiant Celestial Whiteout Bloom Crossfade Overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-500 ${
          whiteoutBloom ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #FFFFFF 0%, #FFFBF2 52%, #FFE7A5 100%)',
        }}
      />

      {/* Balanced Contrast Scrims while Idle (Midnight Slate tint, preserving sky visibility) */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-b from-[#1A1F2C]/80 via-[#1E2333]/12 to-[#1A1F2C]/92 transition-opacity duration-300 ${
          transitionMode !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-[44%] z-10 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/82 to-transparent pointer-events-none transition-opacity duration-300 ${
          transitionMode !== 'idle' ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* Top Brand Mark */}
      <header
        className={`relative z-10 px-6 pt-10 text-center flex flex-col items-center transition-opacity duration-300 ${
          transitionMode !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          className="w-14 h-14 rounded-full bg-[#F7F4EE] border-2 border-[#FFE7A5] flex items-center justify-center mb-3 animate-float-slow shadow-lg"
          style={{
            background:
              'radial-gradient(circle at center, #FFFDF8 0%, #EFEAE0 78%)',
          }}
        >
          <TeyvatImage
            src={ASSET_ICONS.mora}
            fallbackSrc={ASSET_ICONS.moraCdn}
            alt="Lambang Mora Teyvat"
            className="w-8 h-8 object-contain"
          />
        </div>
        <p className="font-genshin text-[11px] tracking-[0.2em] text-[#FFE7A5] uppercase">
          Kuliner Delapan Wilayah
        </p>
        <h1 className="font-genshin text-[26px] leading-tight text-[#FFF8E7] mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
          Teyvat Delicacies
        </h1>
        <div className="w-44 mt-3">
          <DiamondDivider dark />
        </div>
        <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full hoyolab-stat-badge animate-pulse-soft">
          <DiamondStar size={10} />
          <span className="font-genshin text-[11px] tracking-[0.08em] text-[#FFF8E7]">
            Gerbang Dapur Teyvat Terbuka
          </span>
          <DiamondStar size={10} />
        </div>
      </header>

      {/* Center Unobstructed View of the Celestia Stone Door */}
      <div className="relative z-10 flex-1 pointer-events-none" />

      {/* Bottom Interactive Entry Controls */}
      <footer
        className={`relative z-10 px-6 pb-8 pt-4 flex flex-col items-center gap-3 transition-opacity duration-300 ${
          transitionMode !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-full rounded-2xl teyvat-ivory-card px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border-[1.5px] border-[#C8A86B] bg-[#1E2333] shrink-0">
              <TeyvatImage
                src={profile.avatarUrl}
                fallbackSrc={profile.fallbackAvatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 text-left">
              <p className="font-genshin text-[13px] text-[#232635] truncate">
                {profile.username}
              </p>
              <p className="text-[11px] text-[#5B5E70] tabular-nums">
                UID {profile.uid} · AR {profile.adventureRank}
              </p>
            </div>
          </div>
          <span className="font-genshin text-[11px] text-[#9C5A14] shrink-0">
            Siap Masuk
          </span>
        </div>

        <GoldCapsuleButton onClick={() => startGateTransition(true)}>
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>Ketuk untuk Masuk ke Teyvat</span>
        </GoldCapsuleButton>

        <button
          type="button"
          onClick={() => startGateTransition(false)}
          className="min-h-[40px] px-4 py-1.5 rounded-full hoyolab-stat-badge text-[12px] font-medium text-[#FFF8E7] hover:border-[#FFE7A5] hover:text-[#FFE7A5] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Masuk tanpa musik latar</span>
        </button>
      </footer>
    </div>
  );
};
