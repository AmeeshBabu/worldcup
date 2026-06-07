import { motion } from 'framer-motion';

export function TournamentStats() {
  const stats = [
    { label: 'Participating Teams', value: '48', icon: 'public' },
    { label: 'Host Cities', value: '16', icon: 'location_city' },
    { label: 'Matches', value: '104', icon: 'sports_soccer' },
    { label: 'Continental Zones', value: '6', icon: 'travel_explore' },
  ];

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 font-sans">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
            The <span className="text-[#00D8FF]">Scale</span> of History
          </h2>
          <p className="mt-4 text-white/60 font-medium tracking-wide uppercase text-sm md:text-base">
            The largest sporting event ever assembled
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border border-white/10 bg-[#070b14]/60 backdrop-blur-md shadow-[0_0_30px_rgba(0,216,255,0.05)] hover:border-[#00D8FF]/30 transition-colors"
            >
              <span className="material-symbols-outlined text-4xl text-[#00D8FF] mb-4 opacity-80">
                {stat.icon}
              </span>
              <span className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-2">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/50 text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TournamentStats;
