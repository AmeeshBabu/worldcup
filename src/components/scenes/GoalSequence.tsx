import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Confetti = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
};

export function GoalSequence() {
  const reduceMotion = useReducedMotion();
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    const colors = ['#00D8FF', '#FFFFFF', '#030712'];
    const newConfetti: Confetti[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // -50vw to +50vw
      y: Math.random() * 100 - 50, // -50vh to +50vh
      rotation: Math.random() * 360,
      scale: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  }, [reduceMotion]);

  return (
    <section className="relative w-full h-full flex items-center justify-center overflow-hidden font-sans">
      {/* Intense flash layer */}
      <motion.div
        className="absolute inset-0 bg-[#00D8FF] mix-blend-screen pointer-events-none z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      />

      <div className="relative z-20 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_50px_rgba(0,216,255,0.8)] italic">
            GOAL<span className="text-[#00D8FF]">!</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-6 text-center bg-[#070b14]/80 border border-white/20 rounded-full px-8 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(0,216,255,0.2)]"
        >
          <span className="text-xl font-bold uppercase tracking-widest text-white">
            The World <span className="text-[#00D8FF]">Unites</span>
          </span>
        </motion.div>
      </div>

      {/* Confetti Explosion */}
      {!reduceMotion && (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute w-3 h-8"
              style={{ backgroundColor: c.color }}
              initial={{ x: 0, y: 0, rotate: 0, scale: 0, opacity: 1 }}
              whileInView={{
                x: `${c.x}vw`,
                y: `${c.y}vh`,
                rotate: c.rotation + 360 * 2,
                scale: c.scale,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 2 + 1.5,
                ease: 'easeOut',
              }}
              viewport={{ once: true, amount: 0.5 }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default GoalSequence;
