import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// --- Types ---
type TeamProfile = {
  id: string;
  name: string;
  flag: string;
  fifaRank: number;
  confederation: string;
  qualification: string;
  starPlayer: {
    name: string;
    role: string;
  };
  kitColors: [string, string];
};

// --- Mock Data ---
const TEAMS_DATA: TeamProfile[] = [
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', fifaRank: 1, confederation: 'CONMEBOL', qualification: 'Defending Champions', starPlayer: { name: 'Lionel Messi', role: 'Playmaker' }, kitColors: ['#43A1D5', '#FFFFFF'] },
  { id: 'fra', name: 'France', flag: '🇫🇷', fifaRank: 2, confederation: 'UEFA', qualification: 'UEFA Group Winner', starPlayer: { name: 'Kylian Mbappé', role: 'Forward' }, kitColors: ['#002395', '#ED2939'] },
  { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 3, confederation: 'UEFA', qualification: 'UEFA Group Winner', starPlayer: { name: 'Jude Bellingham', role: 'Midfielder' }, kitColors: ['#FFFFFF', '#CE1124'] },
  { id: 'bra', name: 'Brazil', flag: '🇧🇷', fifaRank: 5, confederation: 'CONMEBOL', qualification: 'CONMEBOL Top 6', starPlayer: { name: 'Vinícius Jr.', role: 'Winger' }, kitColors: ['#FFDF00', '#009C3B'] },
  { id: 'usa', name: 'United States', flag: '🇺🇸', fifaRank: 11, confederation: 'CONCACAF', qualification: 'Co-Host Nation', starPlayer: { name: 'Christian Pulisic', role: 'Winger' }, kitColors: ['#B31942', '#0A3161'] },
  { id: 'mex', name: 'Mexico', flag: '🇲🇽', fifaRank: 15, confederation: 'CONCACAF', qualification: 'Co-Host Nation', starPlayer: { name: 'Santiago Giménez', role: 'Striker' }, kitColors: ['#006847', '#CE1126'] },
  { id: 'can', name: 'Canada', flag: '🇨🇦', fifaRank: 40, confederation: 'CONCACAF', qualification: 'Co-Host Nation', starPlayer: { name: 'Alphonso Davies', role: 'Wingback' }, kitColors: ['#FF0000', '#FFFFFF'] },
  { id: 'esp', name: 'Spain', flag: '🇪🇸', fifaRank: 8, confederation: 'UEFA', qualification: 'UEFA Group Winner', starPlayer: { name: 'Rodri', role: 'Defensive Midfielder' }, kitColors: ['#AA151B', '#F1BF00'] },
];

const CONFEDERATIONS = ['ALL', 'CONCACAF', 'CONMEBOL', 'UEFA', 'CAF', 'AFC'];

// --- Helper Components ---

function TiltCard({ team, index }: { team: TeamProfile; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates between -0.5 and 0.5
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
      className="relative w-full z-10"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`View ${team.name} profile`}
        className="group relative h-full rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 backdrop-blur-xl transition-colors hover:border-white/20 cursor-pointer overflow-hidden"
      >
        {/* Dynamic Kit Gradient Background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${team.kitColors[0]} 0%, ${team.kitColors[1]} 100%)`
          }}
        />

        {/* Floating 3D Elements */}
        <div style={{ transform: 'translateZ(40px)' }} className="relative z-10">
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl drop-shadow-lg filter">{team.flag}</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">{team.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{team.confederation}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full border border-[#00D8FF]/30 bg-[#00D8FF]/10 shadow-[0_0_15px_rgba(0,216,255,0.15)] group-hover:shadow-[0_0_20px_rgba(0,216,255,0.3)] transition-shadow">
              <span className="text-[10px] uppercase tracking-widest text-white/50 leading-none mb-0.5">Rank</span>
              <span className="text-lg font-black text-[#00D8FF] leading-none">{team.fifaRank}</span>
            </div>
          </div>

          <div className="h-px w-full bg-white/5 mb-4 group-hover:bg-white/10 transition-colors" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#00D8FF]">route</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Qualification Path</span>
              </div>
              <p className="text-sm font-semibold text-white/90 pl-5">{team.qualification}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#00D8FF]">star</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Player to Watch</span>
              </div>
              <div className="flex items-center justify-between pl-5">
                <span className="text-sm font-semibold text-white/90">{team.starPlayer.name}</span>
                <span className="rounded-md bg-white/5 px-2 py-1 text-[9px] uppercase tracking-widest text-white/60">
                  {team.starPlayer.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Hover Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0,216,255,0.15) 0%, transparent 70%)',
            transform: 'translateZ(10px)'
          }}
        />

      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---

export function TeamExplorer() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredTeams = TEAMS_DATA.filter((team) => {
    if (activeFilter === 'ALL') return true;
    return team.confederation === activeFilter;
  }).sort((a, b) => a.fifaRank - b.fifaRank);

  return (
    <section className="relative w-full h-full flex flex-col justify-center px-4 md:px-8 font-sans overflow-hidden">
      
      {/* Ambience / Background */}
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.06)_0%,transparent_60%)] pointer-events-none blur-3xl translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.04)_0%,transparent_60%)] pointer-events-none blur-3xl -translate-x-1/4 translate-y-1/4" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#00D8FF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00D8FF]">
              Tournament Field
            </span>
            <div className="h-px w-8 bg-[#00D8FF]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white max-w-3xl"
          >
            Explore the <span className="text-[#00D8FF] drop-shadow-[0_0_20px_rgba(0,216,255,0.4)]">Nations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base text-white/50 max-w-2xl"
          >
            Analyze the 48 participating teams preparing for the biggest tournament in history. Review FIFA rankings, qualification routes, and key players to watch.
          </motion.p>
        </div>

        {/* Confederation Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#070b14]/50 backdrop-blur-md p-2">
            {CONFEDERATIONS.map((confed) => (
              <button
                key={confed}
                onClick={() => setActiveFilter(confed)}
                className={`relative px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeFilter === confed ? 'text-[#030712]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {activeFilter === confed && (
                  <motion.div
                    layoutId="active-confed-pill"
                    className="absolute inset-0 bg-[#00D8FF] rounded-xl shadow-[0_0_15px_rgba(0,216,255,0.4)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{confed}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredTeams.map((team, index) => (
                <TiltCard key={team.id} team={team} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredTeams.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <span className="material-symbols-outlined text-4xl text-white/20 mb-4">public_off</span>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">No qualified teams indexed</p>
              <p className="text-white/20 text-xs mt-2">More teams will populate as qualifiers conclude.</p>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}

export default TeamExplorer;
