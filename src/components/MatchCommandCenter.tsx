import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';

// --- Types ---
type MatchStatus = 'LIVE' | 'SCHEDULED' | 'FULL_TIME';

type Match = {
  id: string;
  homeTeam: string;
  homeFlag: string;
  homeScore?: number;
  awayTeam: string;
  awayFlag: string;
  awayScore?: number;
  status: MatchStatus;
  timeIST: string;
  timestamp: number;
  venue: string;
  group: string;
  minute?: string;
};

type MatchDay = {
  id: string;
  dateStr: string;
  label: string;
  matches: Match[];
};

// --- Mock Data ---
const MOCK_DAYS: MatchDay[] = [
  {
    id: 'day1',
    dateStr: 'Thu, 11 Jun',
    label: 'Matchday 1',
    matches: [
      {
        id: 'm1',
        homeTeam: 'MEX',
        homeFlag: 'MX',
        homeScore: 2,
        awayTeam: 'USA',
        awayFlag: 'US',
        awayScore: 1,
        status: 'LIVE',
        timeIST: '01:30',
        timestamp: new Date().getTime() - 1000 * 60 * 65, // 65 mins ago
        venue: 'Estadio Azteca',
        group: 'GROUP A',
        minute: "65'",
      },
      {
        id: 'm2',
        homeTeam: 'CAN',
        homeFlag: 'CA',
        awayTeam: 'FRA',
        awayFlag: 'FR',
        status: 'SCHEDULED',
        timeIST: '05:30',
        timestamp: new Date().getTime() + 1000 * 60 * 60 * 3.5, // 3.5 hours from now
        venue: 'BMO Field',
        group: 'GROUP A',
      },
    ],
  },
  {
    id: 'day2',
    dateStr: 'Fri, 12 Jun',
    label: 'Matchday 2',
    matches: [
      {
        id: 'm3',
        homeTeam: 'ENG',
        homeFlag: 'EN',
        awayTeam: 'IRN',
        awayFlag: 'IR',
        status: 'SCHEDULED',
        timeIST: '18:30',
        timestamp: new Date().getTime() + 1000 * 60 * 60 * 22,
        venue: 'MetLife Stadium',
        group: 'GROUP B',
      },
      {
        id: 'm4',
        homeTeam: 'ARG',
        homeFlag: 'AR',
        awayTeam: 'KSA',
        awayFlag: 'SA',
        status: 'SCHEDULED',
        timeIST: '22:30',
        timestamp: new Date().getTime() + 1000 * 60 * 60 * 26,
        venue: 'AT&T Stadium',
        group: 'GROUP C',
      },
    ],
  },
  {
    id: 'day3',
    dateStr: 'Sat, 13 Jun',
    label: 'Matchday 3',
    matches: [
      {
        id: 'm5',
        homeTeam: 'BRA',
        homeFlag: 'BR',
        homeScore: 3,
        awayTeam: 'JPN',
        awayFlag: 'JP',
        awayScore: 1,
        status: 'FULL_TIME',
        timeIST: '01:30',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 24,
        venue: 'Lumen Field',
        group: 'GROUP D',
      },
    ],
  },
];

// --- Hooks ---
function useCountdown(targetTime: number, isLive: boolean) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (isLive) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, isLive]);

  return timeLeft;
}

// --- Components ---

function MatchCard({ match, index }: { match: Match; index: number }) {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FULL_TIME';
  const { hours, minutes } = useCountdown(match.timestamp, isLive || isFinished);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      className="relative w-full rounded-2xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#00D8FF]/40 hover:bg-[#0a1120]/80 hover:shadow-[0_8px_32px_-12px_rgba(0,216,255,0.25)] overflow-hidden cursor-pointer"
    >
      {/* Glow Effect for Live Matches */}
      {isLive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D8FF]/10 to-transparent pointer-events-none" />
      )}

      <div className="p-5 md:p-6">
        {/* Header: Group & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            {match.group}
          </span>
          <div className="flex items-center gap-2">
            {isLive ? (
              <div className="flex items-center gap-1.5 rounded-full border border-[#00D8FF]/20 bg-[#00D8FF]/10 px-2.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D8FF] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D8FF]"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D8FF]">
                  {match.minute} LIVE
                </span>
              </div>
            ) : isFinished ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                FULL TIME
              </span>
            ) : (
              <div className="flex gap-1.5 font-mono text-xs text-white/60">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white">{String(hours).padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40">HR</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white">{String(minutes).padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40">MIN</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between my-6">
          <div className="flex flex-col items-center gap-2 w-1/3">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white/50">
              {match.homeFlag}
            </span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex w-1/3 flex-col items-center justify-center gap-1">
            {isLive || isFinished ? (
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-3xl md:text-4xl font-extrabold text-[#00D8FF] drop-shadow-[0_0_12px_rgba(0,216,255,0.4)]">
                  {match.homeScore}
                </span>
                <span className="text-white/20">-</span>
                <span className="text-3xl md:text-4xl font-extrabold text-[#00D8FF] drop-shadow-[0_0_12px_rgba(0,216,255,0.4)]">
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-bold tracking-widest text-white">
                  {match.timeIST}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#00D8FF]/70">
                  IST
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-1/3">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white/50">
              {match.awayFlag}
            </span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Footer: Venue */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-white/40">
          <span className="material-symbols-outlined text-[14px]">stadium</span>
          <span className="text-xs tracking-wide">{match.venue}</span>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 uppercase tracking-widest">Broadcast</span>
                  <span className="text-[#00D8FF] font-semibold">4K Primary Feed</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 uppercase tracking-widest">Tactical Cam</span>
                  <span className="text-white">Available</span>
                </div>
                <button className="w-full mt-3 py-3 rounded-lg bg-[#00D8FF]/10 text-[#00D8FF] font-bold text-xs uppercase tracking-[0.15em] border border-[#00D8FF]/20 hover:bg-[#00D8FF] hover:text-[#030712] transition-colors">
                  {isLive ? 'Join Stream' : isFinished ? 'Watch Replay' : 'Set Reminder'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function MatchCommandCenter() {
  const { navigate } = useNavigation();
  const [activeDay, setActiveDay] = useState(MOCK_DAYS[0].id);

  const selectedDay = MOCK_DAYS.find((d) => d.id === activeDay);

  return (
    <section className="relative w-full h-full flex flex-col justify-center px-4 md:px-8 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,216,255,0.05)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(0,216,255,0.03)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-[#00D8FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00D8FF]">
                Live Schedule
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg"
            >
              Command <span className="text-[#00D8FF]">Center</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <button 
              onClick={() => navigate('TIMEZONES')}
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 hover:border-[#00D8FF]/40 hover:bg-[#00D8FF]/10 transition-colors cursor-pointer z-50 pointer-events-auto"
            >
              <span className="material-symbols-outlined text-[16px] text-white/50 group-hover:text-[#00D8FF]">schedule</span>
              <span className="font-label-caps text-[10px] tracking-widest uppercase text-white/70 group-hover:text-white">Times in IST</span>
            </button>
          </motion.div>
        </div>

        {/* Horizontal Day Selector */}
        <div className="relative mb-12">
          {/* Scroll fade masks for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#030712] to-transparent z-10 md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#030712] to-transparent z-10 md:hidden" />

          <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar relative z-0 pb-4 md:pb-0">
            {MOCK_DAYS.map((day) => {
              const isActive = activeDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`relative flex min-w-[140px] flex-col items-center justify-center gap-1 rounded-xl px-6 py-4 transition-colors ${
                    isActive ? 'text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-day-bg"
                      className="absolute inset-0 rounded-xl border border-[#00D8FF]/30 bg-[#00D8FF]/10 backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                    {day.label}
                  </span>
                  <span className="relative z-10 text-sm font-semibold tracking-wide whitespace-nowrap">
                    {day.dateStr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {selectedDay?.matches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default MatchCommandCenter;
