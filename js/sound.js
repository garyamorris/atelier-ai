// Gentle, warm Web Audio UI chimes (zero external audio files needed)
window.AtelierSound = (() => {
  let ctx = null;
  let enabled = true;

  function ensureCtx() {
    if (!enabled) return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration = 0.14, type = 'sine', volume = 0.05, delay = 0) {
    const audio = ensureCtx();
    if (!audio) return;
    const now = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  return {
    isEnabled: () => enabled,
    toggle() {
      enabled = !enabled;
      if (enabled) playTone(523.25, 0.12, 'triangle', 0.045);
      return enabled;
    },
    pop() {
      playTone(440, 0.09, 'triangle', 0.04);
    },
    click() {
      playTone(360, 0.06, 'sine', 0.03);
    },
    step() {
      playTone(587.33, 0.11, 'sine', 0.035);
    },
    spark() {
      // Warm major-9th arpeggio
      playTone(523.25, 0.22, 'triangle', 0.05, 0);
      playTone(659.25, 0.24, 'triangle', 0.05, 0.07);
      playTone(783.99, 0.28, 'triangle', 0.05, 0.14);
      playTone(1046.5, 0.36, 'sine', 0.055, 0.21);
    },
    oops() {
      playTone(260, 0.14, 'triangle', 0.04, 0);
      playTone(215, 0.18, 'triangle', 0.04, 0.08);
    }
  };
})();
