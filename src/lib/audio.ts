class TeyvatAudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying = false;

  private ensureBgm() {
    if (typeof window === 'undefined') return null;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/assets/audio/teyvat_ambient_bgm.ogg');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.28;
    }
    return this.bgmAudio;
  }

  public startBgm(): boolean {
    const audio = this.ensureBgm();
    if (!audio) return false;
    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          this.isBgmPlaying = false;
        });
      }
      this.isBgmPlaying = true;
      return true;
    } catch {
      this.isBgmPlaying = false;
      return false;
    }
  }

  public stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  public setBgmEnabled(enabled: boolean) {
    if (enabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  public getIsBgmPlaying() {
    return this.isBgmPlaying;
  }

  public playSfx(type: 'legendary' | 'epic' | 'quest_complete', enabled: boolean) {
    if (!enabled || typeof window === 'undefined') return;
    const srcMap: Record<typeof type, string> = {
      legendary: '/assets/audio/legendary_dish_sfx.ogg',
      epic: '/assets/audio/epic_dish_sfx.ogg',
      quest_complete: '/assets/audio/quest_complete_jingle.ogg',
    };

    try {
      const sfx = new Audio(srcMap[type]);
      sfx.volume = type === 'quest_complete' ? 0.55 : 0.42;
      const playPromise = sfx.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore browser autoplay restrictions silently
        });
      }
    } catch {
      // Graceful silence if audio codec is unavailable
    }
  }
}

export const teyvatAudio = new TeyvatAudioManager();
