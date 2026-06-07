import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type EventType = 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';
type Team = 'HOME' | 'AWAY';

type MatchEvent = {
  id: string;
  minute: number;
  type: EventType;
  team: Team;
  player: string;
  detail: string;
};

type MatchStat = {
  label: string;
  home: number | string;
  away: number | string;
  homePercent: number;
  awayPercent: number;
};

// --- Mock Data ---
const MATCH_DATA = {
  homeTeam: { name: 'Mexico', short: 'MEX', flag: 'MX', color: '#006847' },
  awayTeam: { name: 'USA', short: 'USA', flag: 'US', color: '#B31942' },
  score: { home: 2, away: 1 },
  minute: 65,
  stadium: 'Estadio Azteca',
  attendance: '87,523',
};

const MOCK_EVENTS: MatchEvent[] = [
  { id: 'e1', minute: 12, type: 'GOAL', team: 'HOME', player: 'S. Giménez', detail: 'Header, Top left corner' },
  { id: 'e2', minute: 28, type: 'YELLOW_CARD', team: 'AWAY', player: 'W. McKennie', detail: 'Foul' },
  { id: 'e3', minute: 41, type: 'GOAL', team: 'AWAY', player: 'C. Pulisic', detail: 'Right footed shot, bottom right' },
  { id: 'e4', minute: 45, type: 'VAR', team: 'HOME', player: 'Penalty Review', detail: 'No Penalty Awarded' },
  { id: 'e5', minute: 55, type: 'GOAL', team: 'HOME', player: 'H. Lozano', detail: 'Penalty scored' },
  { id: 'e6', minute: 62, type: 'SUBSTITUTION', team: 'AWAY', player: 'T. Weah', detail: 'In for G. Reyna' },
];

const MOCK_STATS: MatchStat[] = [
  { label: 'Possession', home: '58%', away: '42%', homePercent: 58, awayPercent: 42 },
  { label: 'Expected Goals (xG)', home: '2.14', away: '0.85', homePercent: 71, awayPercent: 29 },
  { label: 'Shots on Target', home: 7, away: 3, homePercent: 70, awayPercent: 30 },
  { label: 'Total Shots', home: 14, away: 8, homePercent: 63, awayPercent: 37 },
  { label: 'Corner Kicks', home: 6, away: 2, homePercent: 75, awayPercent: 25 },
  { label: 'Pass Accuracy', home: '88%', away: '81%', homePercent: 88, awayPercent: 81 },
  { label: 'Yellow Cards', home: 0, away: 1, homePercent: 0, awayPercent: 100 },
];

// --- Helper Components ---

function AnimatedNumber({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const start = performance.now();
      const initial = typeof display === 'number' ? display : 0;

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setDisplay(Math.round(initial + (value - initial) * easeOutQuart));

        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      setDisplay(value);
    }
  }, [value]);

  return <span>{display}</span>;
}

function StatBar({ stat, delay }: { stat: MatchStat; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-white w-12 text-left"><AnimatedNumber value={stat.home} /></span>
        <span className="text-white/50 text-[10px] uppercase tracking-[0.2em]">{stat.label}</span>
        <span className="text-white w-12 text-right"><AnimatedNumber value={stat.away} /></span>
      </div>
      <div className="flex h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stat.homePercent}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full bg-[#00D8FF]"
        />
        <div className="w-1 h-full bg-[#030712]" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stat.awayPercent}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full bg-white/40"
        />
      </div>
    </motion.div>
  );
}

function EventIcon({ type }: { type: EventType }) {
  switch (type) {
    case 'GOAL':
      return <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">sports_soccer</span>;
    case 'YELLOW_CARD':
      return <div className="h-3.5 w-2.5 rounded-[1px] bg-yellow-400 border border-yellow-500 shadow-sm" />;
    case 'RED_CARD':
      return <div className="h-3.5 w-2.5 rounded-[1px] bg-red-500 border border-red-600 shadow-sm" />;
    case 'SUBSTITUTION':
      return <span className="material-symbols-outlined text-[16px] text-green-400">sync_alt</span>;
    case 'VAR':
      return <span className="material-symbols-outlined text-[16px] text-purple-400">desktop_windows</span>;
  }
}

// --- Main Component ---

export function LiveMatchCenter() {
  const [activeTab, setActiveTab] = useState<'STATS' | 'TIMELINE' | 'LINEUPS'>('STATS');
  const [filterType, setFilterType] = useState<'ALL' | 'GOALS' | 'CARDS'>('ALL');
  const [clock, setClock] = useState(MATCH_DATA.minute * 60 + 23); // 65:23 mock

  // Mock live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setClock((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatClock = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredEvents = MOCK_EVENTS.filter((e) => {
    if (filterType === 'GOALS') return e.type === 'GOAL';
    if (filterType === 'CARDS') return e.type === 'YELLOW_CARD' || e.type === 'RED_CARD';
    return true;
  });

  return (
    <section className="relative w-full h-full flex flex-col justify-start pt-24 pb-24 overflow-y-auto no-scrollbar px-4 md:px-8 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,216,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        
        {/* Top Broadcast Scoreboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#070b14]/80 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
        >
          {/* Live indicator glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00D8FF] to-transparent opacity-50" />
          
          {/* Header Info */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 rounded-full border border-[#00D8FF]/30 bg-[#00D8FF]/10 px-3 py-1.5 backdrop-blur-md">
              <div className="relative flex h-2.5 w-2.5">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D8FF] opacity-75" />
                <div className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00D8FF]" />
              </div>
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#00D8FF]">
                {formatClock(clock)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Matchday 1 • Group A</span>
          </div>

          {/* Score Layout */}
          <div className="flex w-full items-center justify-between md:justify-center md:gap-16">
            {/* Home */}
            <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-end">
              <span className="text-2xl md:text-4xl font-extrabold tracking-tight text-white hidden md:block">
                {MATCH_DATA.homeTeam.name}
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white md:hidden">
                {MATCH_DATA.homeTeam.short}
              </span>
              <span className="text-5xl md:text-6xl drop-shadow-xl">{MATCH_DATA.homeTeam.flag}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 md:gap-6 px-4">
              <motion.span
                key={MATCH_DATA.score.home}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-7xl font-black text-[#00D8FF] drop-shadow-[0_0_20px_rgba(0,216,255,0.4)]"
              >
                {MATCH_DATA.score.home}
              </motion.span>
              <span className="text-3xl text-white/20 font-light">-</span>
              <motion.span
                key={MATCH_DATA.score.away}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-7xl font-black text-white drop-shadow-xl"
              >
                {MATCH_DATA.score.away}
              </motion.span>
            </div>

            {/* Away */}
            <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-start">
              <span className="text-5xl md:text-6xl drop-shadow-xl">{MATCH_DATA.awayTeam.flag}</span>
              <span className="text-2xl md:text-4xl font-extrabold tracking-tight text-white hidden md:block">
                {MATCH_DATA.awayTeam.name}
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white md:hidden">
                {MATCH_DATA.awayTeam.short}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
          
          {/* Left Column: Context Tabs (Stats/Timeline/Lineups) */}
          <div className="flex flex-col gap-6">
            
            {/* Tab Navigation */}
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-[#070b14]/50 backdrop-blur-xl p-2">
              {(['STATS', 'TIMELINE', 'LINEUPS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors rounded-xl ${
                    activeTab === tab ? 'text-[#030712]' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute inset-0 bg-[#00D8FF] rounded-xl shadow-[0_0_15px_rgba(0,216,255,0.4)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="rounded-3xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl p-6 min-h-[500px]">
              <AnimatePresence mode="wait">
                
                {/* --- STATS VIEW --- */}
                {activeTab === 'STATS' && (
                  <motion.div
                    key="STATS"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00D8FF]">Team Telemetry</h3>
                    </div>
                    {MOCK_STATS.map((stat, i) => (
                      <StatBar key={stat.label} stat={stat} delay={i * 0.05} />
                    ))}
                  </motion.div>
                )}

                {/* --- TIMELINE VIEW --- */}
                {activeTab === 'TIMELINE' && (
                  <motion.div
                    key="TIMELINE"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00D8FF]">Match Events</h3>
                      <div className="flex gap-2">
                        {(['ALL', 'GOALS', 'CARDS'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setFilterType(filter)}
                            aria-label={`Filter events by ${filter}`}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border transition-colors ${
                              filterType === filter
                                ? 'bg-[#00D8FF]/20 border-[#00D8FF] text-[#00D8FF]'
                                : 'bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative pl-6 border-l border-white/10 flex flex-col gap-8 flex-1">
                      {filteredEvents.map((event, i) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative flex items-start gap-4 group"
                        >
                          {/* Timeline dot/icon */}
                          <div className="absolute -left-6 w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#0a1120] border border-white/20 flex items-center justify-center shadow-lg group-hover:border-[#00D8FF] group-hover:shadow-[0_0_15px_rgba(0,216,255,0.3)] transition-all">
                              <EventIcon type={event.type} />
                            </div>
                          </div>
                          
                          <div className="flex-1 ml-4 bg-white/5 border border-white/5 rounded-xl p-4 transition-colors group-hover:bg-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[#00D8FF] font-mono font-bold">{event.minute}'</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/50">{event.team === 'HOME' ? MATCH_DATA.homeTeam.short : MATCH_DATA.awayTeam.short}</span>
                              </div>
                            </div>
                            <h4 className="text-base font-bold text-white tracking-wide">{event.player}</h4>
                            <p className="text-xs text-white/60 mt-1">{event.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- LINEUPS VIEW --- */}
                {activeTab === 'LINEUPS' && (
                  <motion.div
                    key="LINEUPS"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col items-center justify-center h-full text-center opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl mb-4">sports_soccer</span>
                    <p className="text-xs uppercase tracking-[0.2em]">Formations Data Loading...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Visual Pitch & Context */}
          <div className="flex flex-col gap-6">
            
            {/* Possession Visualizer */}
            <div className="rounded-3xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D8FF]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-6">Live Momentum</h3>
              
              <div className="flex items-end justify-center h-32 gap-1 px-4">
                {/* Mock momentum bars */}
                {Array.from({ length: 24 }).map((_, i) => {
                  // Deterministic pseudo-random generation to prevent hydration mismatches
                  const pseudoRandom = Math.sin(i * 12.9898) * 43758.5453;
                  const randomDecimal = pseudoRandom - Math.floor(pseudoRandom);
                  const isHome = randomDecimal > 0.4;
                  const height = 20 + Math.abs(Math.cos(i * 1.5)) * 80;
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5, type: 'spring' }}
                      className={`w-full rounded-t-sm ${isHome ? 'bg-[#00D8FF]' : 'bg-white/30'}`}
                      style={{ opacity: i > 18 ? 0.2 + (i-18)*0.2 : 1 }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D8FF]" />
                  <span className="text-[10px] uppercase tracking-widest text-white/70">Mexico Dominance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="text-[10px] uppercase tracking-widest text-white/70">USA Threat</span>
                </div>
              </div>
            </div>

            {/* Stadium Info */}
            <div className="rounded-3xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl p-6 relative overflow-hidden flex-1">
              <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7tBnf-JiJ2PuNFN9_klZqekKG8xwBR2I4MpZb1ZyJC4DaSTwfZfjQ1b4-HiCk59CwICjaDNf4OEQTvSSk7l3jXke9fd2TEsRVAE7OKIFLVblN3Mninp70S2IOO5qRqdRvCqYyAgYDfHWnEX3F3ZNa0YfhI1DMeujKXVIZeJSGNRFHlE6BI4bzbpuU7I9MXuVaMkgJzZWghH6Po5FOv1v5uC31ASHKYDY_Jq1PdLUoTcQ3zfy42xjMMeouRJAqqK0YA671e5Yh9no')] bg-cover bg-center opacity-40 transition-opacity hover:opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
              
              <div className="relative z-10 flex flex-col justify-end h-full mt-24">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">stadium</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D8FF]">Match Venue</span>
                </div>
                <h4 className="text-2xl font-black text-white tracking-tight mb-1">{MATCH_DATA.stadium}</h4>
                <div className="flex items-center gap-4 text-xs font-semibold text-white/60">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">groups</span> {MATCH_DATA.attendance}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">partly_cloudy_day</span> 22°C</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveMatchCenter;
