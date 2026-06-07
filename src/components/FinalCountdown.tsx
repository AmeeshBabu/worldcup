import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// --- Configuration ---
// July 19, 2026, approx 20:00 UTC (MetLife Stadium)
const TARGET_DATE = new Date('2026-07-19T20:00:00Z').getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

// --- Hooks ---
function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return { ...timeLeft, mounted };
}

// --- Helper Components ---
function FlipUnit({ value, label, mounted }: { value: number; label: string; mounted: boolean }) {
  const formattedValue = mounted ? String(value).padStart(2, '0') : '--';
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-24 w-20 md:h-32 md:w-28 items-center justify-center rounded-2xl border border-white/10 bg-[#070b14]/80 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Split line down the middle mimicking a flip clock */}
        <div className="absolute inset-x-0 top-1/2 h-px w-full bg-black/50 shadow-[0_1px_0_rgba(255,255,255,0.1)] z-10" />
        
        <span key={formattedValue} className="relative z-0 font-mono text-5xl md:text-7xl font-black tracking-tighter text-[#00D8FF] drop-shadow-[0_0_20px_rgba(0,216,255,0.4)]">
          {formattedValue}
        </span>
      </div>
      <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/50">
        {label}
      </span>
    </div>
  );
}

// --- Main Component ---
export function FinalCountdown() {
  const reduceMotion = useReducedMotion();
  const { days, hours, minutes, seconds, mounted } = useCountdown(TARGET_DATE);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate floating ambient particles
  useEffect(() => {
    if (reduceMotion) return;
    
    const particlesSeed: Particle[] = Array.from({ length: 40 }, (_, id) => {
      const pseudo = Math.abs(Math.sin(id * 987.654) * 10000);
      const dec1 = pseudo - Math.floor(pseudo);
      const dec2 = Math.abs(Math.cos(id * 123.456));
      const dec3 = Math.abs(Math.sin(id * 456.789));
      const dec4 = Math.abs(Math.cos(id * 321.654));

      return {
        id,
        left: `${dec1 * 100}%`,
        top: `${dec2 * 100}%`,
        size: 1 + dec3 * 3,
        delay: dec4 * 5,
        duration: 6 + dec1 * 10,
        opacity: 0.1 + dec2 * 0.4,
      };
    });

    setParticles(particlesSeed);
  }, [reduceMotion]);

  return (
    <section className="relative w-full h-full flex flex-col justify-center items-center px-4 md:px-8 font-sans overflow-hidden">
      
      {/* --- Cinematic Background Ambience --- */}
      <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7tBnf-JiJ2PuNFN9_klZqekKG8xwBR2I4MpZb1ZyJC4DaSTwfZfjQ1b4-HiCk59CwICjaDNf4OEQTvSSk7l3jXke9fd2TEsRVAE7OKIFLVblN3Mninp70S2IOO5qRqdRvCqYyAgYDfHWnEX3F3ZNa0YfhI1DMeujKXVIZeJSGNRFHlE6BI4bzbpuU7I9MXuVaMkgJzZWghH6Po5FOv1v5uC31ASHKYDY_Jq1PdLUoTcQ3zfy42xjMMeouRJAqqK0YA671e5Yh9no')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712] pointer-events-none z-10" />
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none z-10" />

      {/* Floodlights / Stadium Light Effects */}
      <div className="absolute top-0 left-1/4 w-[2px] h-[400px] bg-gradient-to-b from-white/40 to-transparent rotate-[-35deg] transform origin-top blur-sm pointer-events-none opacity-40" />
      <div className="absolute top-0 right-1/4 w-[2px] h-[400px] bg-gradient-to-b from-white/40 to-transparent rotate-[35deg] transform origin-top blur-sm pointer-events-none opacity-40" />
      
      <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(0,216,255,0.08)_0%,transparent_60%)] rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-[#00D8FF]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            animate={reduceMotion ? undefined : { 
              y: [0, -30, 0], 
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [particle.opacity, particle.opacity * 2, particle.opacity] 
            }}
            transition={reduceMotion ? undefined : { 
              duration: particle.duration, 
              delay: particle.delay, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          />
        ))}
      </div>

      <div className="relative z-20 mx-auto max-w-5xl flex flex-col items-center text-center px-4">
        
        {/* Header Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00D8FF]" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#00D8FF] drop-shadow-[0_0_10px_rgba(0,216,255,0.5)]">
              The Grand Finale
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00D8FF]" />
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-6">
            New York <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">New Jersey</span>
          </h2>
          
          <div className="flex items-center gap-2 mb-16 rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md">
            <span className="material-symbols-outlined text-[#00D8FF] text-[18px]">stadium</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              MetLife Stadium • July 19, 2026
            </span>
          </div>
        </motion.div>

        {/* Countdown Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
        >
          <FlipUnit value={days} label="Days" mounted={mounted} />
          <span className="text-4xl text-white/20 font-light mb-8 hidden md:block">:</span>
          <FlipUnit value={hours} label="Hours" mounted={mounted} />
          <span className="text-4xl text-white/20 font-light mb-8 hidden md:block">:</span>
          <FlipUnit value={minutes} label="Minutes" mounted={mounted} />
          <span className="text-4xl text-white/20 font-light mb-8 hidden md:block">:</span>
          <FlipUnit value={seconds} label="Seconds" mounted={mounted} />
        </motion.div>

        {/* Footer CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-20 flex flex-col md:flex-row items-center gap-4"
        >
          <button className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#00D8FF] px-8 py-4 font-bold uppercase tracking-[0.2em] text-[#030712] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,216,255,0.3)]">
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/40" />
            </div>
            <span className="relative z-10">Secure Tickets</span>
            <span className="material-symbols-outlined relative z-10 text-[20px]">local_activity</span>
          </button>
          
          <button className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-transparent px-8 py-4 font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-[#00D8FF] hover:bg-[#00D8FF]/10 active:scale-95">
            Add to Calendar
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default FinalCountdown;
