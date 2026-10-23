/**
 * Ayşe's Birthday Countdown & Midnight Celebration
 * Built with love, pastel aesthetics, Web Audio synth & interactive Lego Stitch
 */

(function () {
  'use strict';

  // --- STATE & CONFIG ---
  const state = {
    isPreviewMode: false,
    isUnlocked: false,
    isPlayingMusic: false,
    heartCount: 0,
    candleBlown: false,
    targetDate: null,
  };

  // Quotes for Stitch in countdown mode
  const stitchQuotes = [
    '"Ayşe için en tatlı sürprizi saklıyorum... Sabret az kaldı! 💖"',
    '"Herkes ilk kutlayan olmak için yarıştı, ama son kutlayan unutulmaz! 😉"',
    '"23:59 olduğunda bu ekran sihirli bir şekilde değişecek... ✨"',
    '"Lego kalbimi sadece Ayşe için hazırladım! 🧸"',
    '"Günün en güzel dakikası 23:59... Beklemeye kesinlikle değer! 🌸"',
    '"Doğum gününün her dakikası değerli, son saniyesine kadar! 💕"'
  ];
  let quoteIndex = 0;

  // --- DOM ELEMENTS ---
  const countdownStage = document.getElementById('countdown-stage');
  const celebrationStage = document.getElementById('celebration-stage');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressRunner = document.getElementById('progress-runner');
  const progressPercent = document.getElementById('progress-percent');
  const musicBtn = document.getElementById('music-btn');
  const musicText = document.getElementById('music-text');
  const tapHeartBtn = document.getElementById('tap-heart-btn');
  const heartCounterEl = document.getElementById('heart-counter');
  const stitchShowcase = document.getElementById('stitch-interactive-box');
  const speechQuoteEl = document.getElementById('speech-quote');
  const togglePreviewBtn = document.getElementById('toggle-preview-btn');
  const previewBtnText = document.getElementById('preview-btn-text');
  const previewBar = document.getElementById('preview-bar');
  const closePreviewBar = document.getElementById('close-preview-bar');
  const blowCandleBtn = document.getElementById('blow-candle-btn');
  const blowBtnText = document.getElementById('blow-btn-text');
  const candleFlame = document.getElementById('candle-flame');
  const candleSmoke = document.getElementById('candle-smoke');
  const wishGrantedBanner = document.getElementById('wish-granted-banner');
  const reconfettiBtn = document.getElementById('reconfetti-btn');
  const shareLoveBtn = document.getElementById('share-love-btn');

  // --- TARGET TIME INITIALIZATION ---
  function computeTargetTime() {
    const now = new Date();
    // Target is today at 23:59:00
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0);
    return target;
  }
  state.targetDate = computeTargetTime();

  // Check URL params (?preview=1 or ?unlocked=1)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('preview') || urlParams.has('unlocked') || urlParams.has('test')) {
    state.isPreviewMode = true;
  }

  // --- WEB AUDIO API SYNTHESIZER ---
  // Generates dreamy music box birthday tones without external MP3 dependencies
  let audioCtx = null;
  let musicInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft music-box chime generator
  function playNote(freq, startTime, duration = 0.8, type = 'sine', gainVal = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell/Music Box envelope: quick attack, natural exponential decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Gentle sweet "Happy Birthday" lullaby melody (frequencies in Hz)
  const melodyNotes = [
    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.35 }, // C4
    { f: 293.66, d: 0.7  }, // D4
    { f: 261.63, d: 0.7  }, // C4
    { f: 349.23, d: 0.7  }, // F4
    { f: 329.63, d: 1.2  }, // E4
    { f: 0,      d: 0.3  }, // rest
    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.35 }, // C4
    { f: 293.66, d: 0.7  }, // D4
    { f: 261.63, d: 0.7  }, // C4
    { f: 392.00, d: 0.7  }, // G4
    { f: 349.23, d: 1.2  }, // F4
    { f: 0,      d: 0.3  }, // rest
    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.35 }, // C4
    { f: 523.25, d: 0.7  }, // C5
    { f: 440.00, d: 0.7  }, // A4
    { f: 349.23, d: 0.7  }, // F4
    { f: 329.63, d: 0.7  }, // E4
    { f: 293.66, d: 0.9  }, // D4
    { f: 0,      d: 0.3  }, // rest
    { f: 466.16, d: 0.35 }, // Bb4
    { f: 466.16, d: 0.35 }, // Bb4
    { f: 440.00, d: 0.7  }, // A4
    { f: 349.23, d: 0.7  }, // F4
    { f: 392.00, d: 0.7  }, // G4
    { f: 349.23, d: 1.5  }, // F4
  ];

  function startMusicLoop() {
    if (state.isPlayingMusic) return;
    initAudioContext();
    state.isPlayingMusic = true;
    musicBtn.classList.add('playing');
    musicText.textContent = 'Müziği Durdur';

    let currentStep = 0;
    function schedulePhrase() {
      if (!state.isPlayingMusic || !audioCtx) return;
      const note = melodyNotes[currentStep];
      if (note.f > 0) {
        const now = audioCtx.currentTime;
        // Primary bell note
        playNote(note.f, now, note.d * 1.5, 'sine', 0.12);
        // Soft harmonic overtone (celesta/music-box feel)
        playNote(note.f * 2, now + 0.01, note.d * 0.9, 'triangle', 0.04);
      }
      currentStep = (currentStep + 1) % melodyNotes.length;
      const delay = (note.d * 600) + 120;
      musicInterval = setTimeout(schedulePhrase, delay);
    }
    schedulePhrase();
  }

  function stopMusicLoop() {
    state.isPlayingMusic = false;
    musicBtn.classList.remove('playing');
    musicText.textContent = 'Müziği Başlat';
    if (musicInterval) {
      clearTimeout(musicInterval);
      musicInterval = null;
    }
  }

  musicBtn.addEventListener('click', () => {
    if (state.isPlayingMusic) {
      stopMusicLoop();
    } else {
      startMusicLoop();
    }
  });

  // Sound effect for popping hearts
  function playHeartChime() {
    initAudioContext();
    if (!audioCtx) return;
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    const now = audioCtx.currentTime;
    playNote(freq, now, 0.45, 'triangle', 0.08);
  }

  // Sound effect for blowing candle
  function playCandleWhoosh() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      // Noise burst + chime
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.35);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();

      // Magical chime
      setTimeout(() => {
        playNote(783.99, audioCtx.currentTime, 0.9, 'sine', 0.12);
        playNote(1046.50, audioCtx.currentTime + 0.1, 1.2, 'triangle', 0.15);
      }, 150);
    } catch (e) {
      console.warn(e);
    }
  }


  // --- COUNTDOWN LOGIC ---
  function updateCountdown() {
    // If preview mode is activated, skip standard logic
    if (state.isPreviewMode) {
      return;
    }

    const now = new Date();
    const diff = state.targetDate - now;

    // Check if time has passed 23:59:00 today
    if (diff <= 0) {
      if (!state.isUnlocked) {
        unlockCelebration();
      }
      return;
    }

    // Still counting down
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Calculate day progress from 00:00:00 to 23:59:00 (86340 total seconds)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const dayElapsed = now - startOfDay;
    const totalDayTime = state.targetDate - startOfDay;
    const progressPercentVal = Math.min(100, Math.max(0, (dayElapsed / totalDayTime) * 100));

    progressBarFill.style.width = `${progressPercentVal.toFixed(1)}%`;
    progressRunner.style.left = `${progressPercentVal.toFixed(1)}%`;
    progressPercent.textContent = `%${progressPercentVal.toFixed(1)}`;
  }

  // --- UNLOCK CELEBRATION (AT 23:59) ---
  function unlockCelebration() {
    state.isUnlocked = true;
    showCelebrationStage();
    fireCelebrationConfetti();
    startMusicLoop();
  }

  function showCelebrationStage() {
    countdownStage.classList.add('hidden');
    countdownStage.classList.remove('active');

    celebrationStage.classList.remove('hidden');
    celebrationStage.classList.add('active');

    previewBtnText.textContent = 'Geri Sayıma Geri Dön';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showCountdownStage() {
    celebrationStage.classList.add('hidden');
    celebrationStage.classList.remove('active');

    countdownStage.classList.remove('hidden');
    countdownStage.classList.add('active');

    previewBtnText.textContent = '23:59 Sonrasını Test Et';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle preview mode for testing
  togglePreviewBtn.addEventListener('click', () => {
    state.isPreviewMode = !state.isPreviewMode;
    if (state.isPreviewMode) {
      showCelebrationStage();
      fireCelebrationConfetti();
    } else {
      showCountdownStage();
    }
  });

  if (closePreviewBar) {
    closePreviewBar.addEventListener('click', () => {
      if (previewBar) {
        previewBar.style.display = 'none';
      }
    });
  }

  // Tap Stitch to rotate quotes and bounce
  stitchShowcase.addEventListener('click', (e) => {
    quoteIndex = (quoteIndex + 1) % stitchQuotes.length;
    speechQuoteEl.style.opacity = '0';
    setTimeout(() => {
      speechQuoteEl.textContent = stitchQuotes[quoteIndex];
      speechQuoteEl.style.opacity = '1';
    }, 200);

    spawnFloatingHeart(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    playHeartChime();
  });


  // --- CONFETTI CANNON ---
  function fireCelebrationConfetti() {
    if (typeof confetti !== 'function') return;

    // First big burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4081', '#f43f5e', '#ec4899', '#f59e0b', '#38bdf8', '#ffffff']
    });

    // Staggered side cannons
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff80ab', '#f472b6', '#ffd166', '#a78bfa']
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff80ab', '#f472b6', '#ffd166', '#a78bfa']
      });
    }, 350);

    // Falling heart shapes
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 100,
        origin: { y: 0.3 },
        shapes: ['circle'],
        scalar: 1.2,
        colors: ['#e91e63', '#ff4081', '#fce4ec']
      });
    }, 700);
  }

  if (reconfettiBtn) {
    reconfettiBtn.addEventListener('click', () => {
      fireCelebrationConfetti();
      playHeartChime();
    });
  }


  // --- INTERACTIVE CANDLE & MAKE A WISH ---
  function blowCandle() {
    if (state.candleBlown) return;
    state.candleBlown = true;

    playCandleWhoosh();

    // Extinguish flame and show smoke puff
    const flameEl = document.querySelector('.flame');
    if (flameEl) flameEl.classList.add('extinguished');
    if (candleSmoke) candleSmoke.classList.remove('hidden');

    // Update button & reveal banner
    blowCandleBtn.disabled = true;
    blowBtnText.textContent = 'Mum Söndürüldü! 🌟';
    wishGrantedBanner.classList.remove('hidden');

    // Golden fireworks
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.75 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff', '#ec4899']
      });
    }
  }

  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', blowCandle);
  }
  if (candleFlame) {
    candleFlame.addEventListener('click', blowCandle);
  }


  // --- FLOATING HEARTS & PARTICLES ON TAP/CLICK ---
  function spawnFloatingHeart(x, y) {
    state.heartCount++;
    heartCounterEl.textContent = `(${state.heartCount})`;

    const heart = document.createElement('div');
    const emojis = ['💖', '💕', '🌸', '✨', '💝', '🧸'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 16 + 20}px`;
    heart.style.pointerEvents = 'none';
    heart.style.userSelect = 'none';
    heart.style.zIndex = '9999';
    heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;
    heart.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease';
    heart.style.opacity = '1';

    document.body.appendChild(heart);

    // Animate upward with horizontal flutter
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = -(Math.random() * 160 + 100);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1.3) rotate(${Math.random() * 60 - 30}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, 1250);
  }

  tapHeartBtn.addEventListener('click', (e) => {
    const rect = tapHeartBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnFloatingHeart(x + (Math.random() - 0.5) * 40, y), i * 80);
    }
    playHeartChime();
  });

  if (shareLoveBtn) {
    shareLoveBtn.addEventListener('click', (e) => {
      const rect = shareLoveBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnFloatingHeart(x + (Math.random() - 0.5) * 60, y), i * 70);
      }
      playHeartChime();
      fireCelebrationConfetti();
    });
  }

  // Click/tap on background produces small subtle sparkles
  document.addEventListener('click', (e) => {
    // Avoid double spawning if clicking interactive buttons
    if (e.target.closest('button') || e.target.closest('.stitch-showcase')) return;
    spawnFloatingHeart(e.clientX, e.clientY);
  });


  // --- BACKGROUND AMBIENT CANVAS (Dreamy pastel orbs & hearts) ---
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class AmbientParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 80;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.35 + 0.15;
      this.type = Math.random() > 0.6 ? 'heart' : 'orb';
      this.color = Math.random() > 0.5 ? '255, 128, 171' : '244, 114, 182';
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.3;
      this.angle += this.spin;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;

      if (this.type === 'orb') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw tiny subtle heart
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s / 4);
        ctx.quadraticCurveTo(0, 0, s / 4, 0);
        ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 3);
        ctx.quadraticCurveTo(s / 2, s * 0.7, 0, s);
        ctx.quadraticCurveTo(-s / 2, s * 0.7, -s / 2, s / 3);
        ctx.quadraticCurveTo(-s / 2, 0, -s / 4, 0);
        ctx.quadraticCurveTo(0, 0, 0, s / 4);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Populate ambient particles
  const particleCount = window.innerWidth < 480 ? 18 : 32;
  for (let i = 0; i < particleCount; i++) {
    const p = new AmbientParticle();
    p.y = Math.random() * height; // initial spread
    particles.push(p);
  }

  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(renderAmbient);
  }
  renderAmbient();


  // --- START TIMER TICK ---
  if (state.isPreviewMode) {
    showCelebrationStage();
  } else {
    updateCountdown();
  }
  setInterval(updateCountdown, 1000);

  // If already past 23:59:00 on first load, check immediately
  if (new Date() >= state.targetDate && !state.isPreviewMode) {
    unlockCelebration();
  }

})();
