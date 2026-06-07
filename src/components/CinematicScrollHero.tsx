import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useMotionValueEvent,
  MotionValue
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type HeroStat = {
  label: string;
  value: number;
  suffix: string;
};

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

const TOTAL_FRAMES = 240;

const heroStats: HeroStat[] = [
  { label: 'Participating Teams', value: 48, suffix: 'Nations' },
  { label: 'Global Fixtures', value: 104, suffix: 'Matches' },
  { label: 'Major Host Cities', value: 16, suffix: 'Arenas' },
  { label: 'The Prize', value: 1, suffix: 'Champion' },
];

const tickerItems = [
  ['GROUP A', 'MEX 2-1 USA'],
  ['GROUP B', 'ENG 4-0 IRN'],
  ['LIVE', 'BRA 1-1 JPN'],
  ['GROUP C', 'ARG 3-1 KSA'],
  ['GROUP D', 'FRA 2-0 AUS'],
  ['GROUP A', 'MEX 2-1 USA'],
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function animatedCount(target: number, onUpdate: (value: number) => void) {
  const startTime = performance.now();
  const duration = 1500;

  function step(timestamp: number) {
    const progress = clamp((timestamp - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    onUpdate(Math.round(eased * target));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function CinematicScrollHero({ progress }: { progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [displayStats, setDisplayStats] = useState<number[]>(heroStats.map(() => 0));
  const [animateCounters, setAnimateCounters] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Content Opacity fades out super early so it doesn't block the new features
  const contentOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const contentY = useTransform(progress, [0, 0.05], [0, -50]);
  const subtextOpacity = useTransform(progress, [0, 0.03], [0, 1]);
  const subtextY = useTransform(progress, [0, 0.05], [32, 0]);
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // GSAP ScrollTrigger & Canvas sequence rendering
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i + 1).padStart(3, '0');
      // Point directly to the Vite public folder
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === 1) {
          drawFrame(0);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imagesRef.current[index];
      if (!canvas || !ctx || !img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let drawW, drawH, drawX, drawY;
      if (canvasRatio > imgRatio) {
        drawW = cw; drawH = cw / imgRatio;
        drawX = 0;  drawY = (ch - drawH) / 2;
      } else {
        drawH = ch; drawW = ch * imgRatio;
        drawX = (cw - drawW) / 2; drawY = 0;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    const resizeCanvas = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        const ctx = canvasRef.current.getContext('2d');
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (imagesRef.current.length === 0) return;
    
    // Convert 0-1 progress to 0-239 frame
    const frame = Math.round(latest * (TOTAL_FRAMES - 1));
    
    if (currentFrameRef.current !== frame) {
      currentFrameRef.current = frame;
      setCurrentFrame(frame + 1);
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imagesRef.current[frame];
      if (canvas && ctx && img) {
        const cw = canvas.width;
        const ch = canvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = cw / ch;

        let drawW, drawH, drawX, drawY;
        if (canvasRatio > imgRatio) {
          drawW = cw; drawH = cw / imgRatio;
          drawX = 0;  drawY = (ch - drawH) / 2;
        } else {
          drawH = ch; drawW = ch * imgRatio;
          drawX = (cw - drawW) / 2; drawY = 0;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    }
    
    // Trigger counters when past 10%
    if (latest > 0.1 && !animateCounters) {
      setAnimateCounters(true);
    }
  });

  // Counters
  useEffect(() => {
    if (!animateCounters) return;

    const nextValues = heroStats.map((stat) => stat.value);
    const timers: number[] = [];

    nextValues.forEach((target, index) => {
      timers.push(
        window.setTimeout(() => {
          animatedCount(target, (value) => {
            setDisplayStats((prev) => {
              const next = [...prev];
              next[index] = value;
              return next;
            });
          });
        }, index * 120),
      );
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [animateCounters]);

  // Particles
  useEffect(() => {
    if (reduceMotion) return;

    const particlesSeed: Particle[] = Array.from({ length: 36 }, (_, id) => {
      // Deterministic pseudo-random generation
      const pseudo = Math.abs(Math.sin(id * 123.456) * 10000);
      const dec1 = pseudo - Math.floor(pseudo);
      const dec2 = Math.abs(Math.cos(id * 321.654));
      const dec3 = Math.abs(Math.sin(id * 789.123));
      const dec4 = Math.abs(Math.cos(id * 987.321));

      return {
        id,
        left: `${dec1 * 100}%`,
        top: `${dec2 * 100}%`,
        size: 2 + dec3 * 2,
        delay: dec4 * 3,
        duration: 5 + dec1 * 8,
        opacity: 0.15 + dec2 * 0.35,
      };
    });

    setParticles(particlesSeed);
  }, [reduceMotion]);

  // Parallax / Stadium lights
  useEffect(() => {
    if (reduceMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      const moveX = (event.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (event.clientY - window.innerHeight / 2) * 0.01;

      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none"></canvas>

          {imagesLoaded < TOTAL_FRAMES && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex gap-2 justify-center mb-4">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="font-label-caps text-primary tracking-widest uppercase">Loading Sequence {imagesLoaded} / {TOTAL_FRAMES}</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10 z-20 pointer-events-none" />
          <div className="absolute inset-0 tech-grid z-20 pointer-events-none" />

          {/* Layered Parallax Stadium Light Effects */}
          <motion.div
            className="absolute top-1/2 left-1/2 z-20 h-[120%] w-[120%] rounded-full blur-3xl pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(0,216,255,0.12) 0%, transparent 70%)',
              x: mouseX,
              y: mouseY,
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-primary"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity,
                }}
                animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.1, 0.45, 0.1] }}
                transition={reduceMotion ? undefined : { duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>

          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute inset-0 z-30 pointer-events-none">
            <div className="relative h-full flex flex-col justify-center px-container-padding-mobile md:px-container-padding-desktop pointer-events-auto">
            <div className="max-w-6xl mt-20" id="hero-text-trigger">
              <motion.h1
                className="font-display-hero text-display-hero font-extrabold uppercase leading-none tracking-tighter text-white drop-shadow-2xl"
                initial={false}
                animate={reduceMotion ? undefined : { y: 0 }}
              >
                WORLD CUP <br />
                <span className="text-primary italic">2026</span>
              </motion.h1>

              <motion.p
                className="font-headline-md text-headline-md mt-6 uppercase tracking-[0.2em] text-primary"
                style={{ opacity: subtextOpacity, y: subtextY }}
              >
                Every Match. Every Team. Every Moment.
              </motion.p>
            </div>

            {/* Animated Counters */}
            <div className="grid grid-cols-2 gap-gutter mt-16 max-w-5xl md:grid-cols-4">
              {heroStats.map((stat, index) => (
                <div key={stat.label} className="glass-panel glow-cyan flex flex-col gap-1 rounded-lg p-6 hover-lift">
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-stats-num text-stats-num text-primary">
                      {displayStats[index] ?? 0}
                    </span>
                    <span className="font-body-md text-body-md text-white/80">{stat.suffix}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap gap-4 md:gap-6">
              <motion.button
                aria-label="Experience Now"
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="group inline-flex items-center gap-3 rounded-lg bg-primary px-6 py-4 font-body-lg text-body-lg font-bold uppercase tracking-widest text-background shadow-[0_0_30px_rgba(0,216,255,0.4)] transition-colors hover:bg-white md:px-10 md:py-5"
              >
                <span>Experience Now</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">play_circle</span>
              </motion.button>
              <button aria-label="Go to Match Center" className="glass-panel rounded-lg border border-white/20 px-6 py-4 font-body-lg text-body-lg font-bold uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary md:px-10 md:py-5">
                Match Center
              </button>
            </div>
          </div>

          <div className="absolute right-container-padding-desktop top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
            <div className="glass-panel hover-lift flex w-64 flex-col gap-3 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary">Venue Insight</span>
                <span className="material-symbols-outlined text-[16px] text-primary">stadium</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-lg text-body-lg font-bold text-white">Estadio Azteca</span>
                <span className="font-body-md text-body-md text-sm text-on-surface-variant">Capacity: 87,523</span>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[18px]">partly_cloudy_day</span>
                <span className="font-body-md text-body-md text-sm">22°C - Ideal</span>
              </div>
            </div>

            <div className="glass-panel hover-lift flex w-64 flex-col gap-3 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-primary">Live Broadcast</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary pulsing-dot" />
                  <span className="font-label-caps text-[10px] text-primary">On Air</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-body-lg text-body-lg font-bold text-white">Pre-Match Show</span>
                <span className="font-body-md text-body-md text-sm text-on-surface-variant">Streaming 4K HDR</span>
              </div>
            </div>
          </div>

          </motion.div>

          {/* Scroll Progress Indicator */}
          <motion.div style={{ opacity: contentOpacity }} className="absolute bottom-0 w-full z-40 overflow-hidden border-x-0 border-b-0 glass-panel h-12 flex items-center">
            <motion.div className="absolute inset-y-0 left-0 bg-primary/40" style={{ width: progressWidth }} />
            <motion.div className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_20px_rgba(0,216,255,0.8)]" style={{ width: progressWidth, maxWidth: '4px' }} />
            
            <div className="relative flex w-full items-center overflow-hidden">
              <motion.div
                className="scrolling-ticker whitespace-nowrap flex items-center gap-12 font-label-caps text-label-caps text-white/70"
                animate={reduceMotion ? undefined : { x: ['100%', '-100%'] }}
                transition={reduceMotion ? undefined : { duration: 30, ease: 'linear', repeat: Infinity }}
              >
                {tickerItems.map(([group, score], index) => (
                  <span key={`${group}-${index}`} className="flex items-center gap-4">
                    <span className="text-primary font-bold">{group}</span> {score}
                    <span className="w-px h-4 bg-white/20" />
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: contentOpacity }} className="absolute top-24 right-6 z-30 rounded-full border border-white/10 bg-background/40 px-4 py-2 font-label-caps text-[11px] tracking-[0.18em] text-white/60 backdrop-blur-xl">
            {String(currentFrame).padStart(3, '0')} / {String(TOTAL_FRAMES).padStart(3, '0')}
          </motion.div>
    </div>
  );
}

export default CinematicScrollHero;