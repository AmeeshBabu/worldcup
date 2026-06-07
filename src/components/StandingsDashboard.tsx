import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type TeamForm = 'W' | 'D' | 'L';

type TeamStanding = {
  id: string;
  position: number;
  name: string;
  short: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  status: 'QUALIFIED' | 'POSSIBLE' | 'ELIMINATED';
  form: TeamForm[];
};

type Group = {
  id: string;
  name: string;
  teams: TeamStanding[];
};

// --- Mock Data ---
const GROUPS_DATA: Group[] = [
  {
    id: 'group_a',
    name: 'Group A',
    teams: [
      { id: 't1', position: 1, name: 'Mexico', short: 'MEX', flag: 'MEX', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, gd: 3, points: 7, status: 'QUALIFIED', form: ['W', 'D', 'W'] },
      { id: 't2', position: 2, name: 'France', short: 'FRA', flag: 'FRA', played: 3, won: 2, drawn: 0, lost: 1, gf: 6, ga: 3, gd: 3, points: 6, status: 'QUALIFIED', form: ['W', 'L', 'W'] },
      { id: 't3', position: 3, name: 'USA', short: 'USA', flag: 'USA', played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, points: 4, status: 'ELIMINATED', form: ['L', 'D', 'W'] },
      { id: 't4', position: 4, name: 'Canada', short: 'CAN', flag: 'CAN', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, points: 0, status: 'ELIMINATED', form: ['L', 'L', 'L'] },
    ]
  },
  {
    id: 'group_b',
    name: 'Group B',
    teams: [
      { id: 't5', position: 1, name: 'England', short: 'ENG', flag: 'ENG', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, gd: 7, points: 9, status: 'QUALIFIED', form: ['W', 'W', 'W'] },
      { id: 't6', position: 2, name: 'Wales', short: 'WAL', flag: 'WAL', played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 4, gd: -1, points: 4, status: 'QUALIFIED', form: ['L', 'W', 'D'] },
      { id: 't7', position: 3, name: 'Iran', short: 'IRN', flag: 'IRN', played: 3, won: 0, drawn: 2, lost: 1, gf: 2, ga: 4, gd: -2, points: 2, status: 'ELIMINATED', form: ['D', 'L', 'D'] },
      { id: 't8', position: 4, name: 'Morocco', short: 'MAR', flag: 'MAR', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, points: 1, status: 'ELIMINATED', form: ['D', 'L', 'L'] },
    ]
  },
  {
    id: 'group_c',
    name: 'Group C',
    teams: [
      { id: 't9', position: 1, name: 'Argentina', short: 'ARG', flag: 'ARG', played: 3, won: 3, drawn: 0, lost: 0, gf: 7, ga: 0, gd: 7, points: 9, status: 'QUALIFIED', form: ['W', 'W', 'W'] },
      { id: 't10', position: 2, name: 'Saudi Arabia', short: 'KSA', flag: 'KSA', played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 4, gd: -1, points: 4, status: 'QUALIFIED', form: ['W', 'L', 'D'] },
      { id: 't11', position: 3, name: 'Poland', short: 'POL', flag: 'POL', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, gd: -2, points: 3, status: 'ELIMINATED', form: ['L', 'W', 'L'] },
      { id: 't12', position: 4, name: 'Ecuador', short: 'ECU', flag: 'ECU', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, points: 1, status: 'ELIMINATED', form: ['L', 'D', 'L'] },
    ]
  },
  {
    id: 'group_d',
    name: 'Group D',
    teams: [
      { id: 't13', position: 1, name: 'Spain', short: 'ESP', flag: 'ESP', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, points: 7, status: 'QUALIFIED', form: ['W', 'W', 'D'] },
      { id: 't14', position: 2, name: 'Germany', short: 'GER', flag: 'GER', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, gd: 1, points: 5, status: 'QUALIFIED', form: ['D', 'W', 'D'] },
      { id: 't15', position: 3, name: 'Japan', short: 'JPN', flag: 'JPN', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 4, gd: -1, points: 3, status: 'ELIMINATED', form: ['L', 'L', 'W'] },
      { id: 't16', position: 4, name: 'Costa Rica', short: 'CRC', flag: 'CRC', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, points: 1, status: 'ELIMINATED', form: ['L', 'D', 'L'] },
    ]
  },
  {
    id: 'group_e',
    name: 'Group E',
    teams: [
      { id: 't17', position: 1, name: 'Brazil', short: 'BRA', flag: 'BRA', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, gd: 7, points: 9, status: 'QUALIFIED', form: ['W', 'W', 'W'] },
      { id: 't18', position: 2, name: 'Switzerland', short: 'SUI', flag: 'SUI', played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, gd: 1, points: 6, status: 'QUALIFIED', form: ['W', 'L', 'W'] },
      { id: 't19', position: 3, name: 'Serbia', short: 'SRB', flag: 'SRB', played: 3, won: 0, drawn: 1, lost: 2, gf: 3, ga: 6, gd: -3, points: 1, status: 'ELIMINATED', form: ['L', 'D', 'L'] },
      { id: 't20', position: 4, name: 'Cameroon', short: 'CMR', flag: 'CMR', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 7, gd: -5, points: 1, status: 'ELIMINATED', form: ['L', 'L', 'D'] },
    ]
  },
  {
    id: 'group_f',
    name: 'Group F',
    teams: [
      { id: 't21', position: 1, name: 'Portugal', short: 'POR', flag: 'POR', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 2, gd: 3, points: 6, status: 'QUALIFIED', form: ['W', 'W', 'L'] },
      { id: 't22', position: 2, name: 'South Korea', short: 'KOR', flag: 'KOR', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, points: 4, status: 'QUALIFIED', form: ['D', 'L', 'W'] },
      { id: 't23', position: 3, name: 'Uruguay', short: 'URU', flag: 'URU', played: 3, won: 1, drawn: 1, lost: 1, gf: 2, ga: 2, gd: 0, points: 4, status: 'ELIMINATED', form: ['D', 'L', 'W'] },
      { id: 't24', position: 4, name: 'Ghana', short: 'GHA', flag: 'GHA', played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 7, gd: -3, points: 3, status: 'ELIMINATED', form: ['L', 'W', 'L'] },
    ]
  },
  {
    id: 'group_g',
    name: 'Group G',
    teams: [
      { id: 't25', position: 1, name: 'Netherlands', short: 'NED', flag: 'NED', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 1, gd: 4, points: 7, status: 'QUALIFIED', form: ['W', 'D', 'W'] },
      { id: 't26', position: 2, name: 'Senegal', short: 'SEN', flag: 'SEN', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, gd: 1, points: 6, status: 'QUALIFIED', form: ['L', 'W', 'W'] },
      { id: 't27', position: 3, name: 'Ecuador', short: 'ECU', flag: 'ECU', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 3, gd: 1, points: 4, status: 'ELIMINATED', form: ['W', 'D', 'L'] },
      { id: 't28', position: 4, name: 'Qatar', short: 'QAT', flag: 'QAT', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, points: 0, status: 'ELIMINATED', form: ['L', 'L', 'L'] },
    ]
  },
  {
    id: 'group_h',
    name: 'Group H',
    teams: [
      { id: 't29', position: 1, name: 'Belgium', short: 'BEL', flag: 'BEL', played: 3, won: 2, drawn: 1, lost: 0, gf: 4, ga: 1, gd: 3, points: 7, status: 'QUALIFIED', form: ['W', 'W', 'D'] },
      { id: 't30', position: 2, name: 'Croatia', short: 'CRO', flag: 'CRO', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 1, gd: 3, points: 5, status: 'QUALIFIED', form: ['D', 'W', 'D'] },
      { id: 't31', position: 3, name: 'Canada', short: 'CAN', flag: 'CAN', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, gd: -2, points: 3, status: 'ELIMINATED', form: ['L', 'L', 'W'] },
      { id: 't32', position: 4, name: 'Morocco', short: 'MAR', flag: 'MAR', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, points: 1, status: 'ELIMINATED', form: ['D', 'L', 'L'] },
    ]
  }
];

// --- Helper Components ---

function FormPill({ result }: { result: TeamForm }) {
  const getColors = () => {
    switch (result) {
      case 'W': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'D': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'L': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-white/10 text-white/50 border-white/10';
    }
  };

  return (
    <div className={`flex h-5 w-5 items-center justify-center rounded-[4px] border text-[10px] font-bold ${getColors()}`}>
      {result}
    </div>
  );
}

export function StandingsDashboard() {
  const [activeGroupId, setActiveGroupId] = useState(GROUPS_DATA[0].id);

  const activeGroup = GROUPS_DATA.find((g) => g.id === activeGroupId) || GROUPS_DATA[0];

  return (
    <section className="relative w-full h-full flex flex-col justify-center px-4 md:px-8 font-sans">
      {/* Ambience / Background */}
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-[#00D8FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00D8FF]">
                Tournament Phase
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white"
            >
              Group <span className="text-[#00D8FF]">Standings</span>
            </motion.h2>
          </div>

          {/* Group Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {GROUPS_DATA.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                  activeGroupId === group.id ? 'text-[#030712]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {activeGroupId === group.id && (
                  <motion.div
                    layoutId="active-group-pill"
                    className="absolute inset-0 bg-[#00D8FF] rounded-xl shadow-[0_0_20px_rgba(0,216,255,0.3)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{group.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Table Container */}
        <div className="rounded-3xl border border-white/10 bg-[#070b14]/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_1.5fr_repeat(6,minmax(2.5rem,1fr))_4rem] md:grid-cols-[4rem_2fr_repeat(6,1fr)_8rem] gap-2 md:gap-4 items-center bg-white/5 border-b border-white/10 px-4 md:px-8 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/50">
            <div className="text-center">Pos</div>
            <div>Nation</div>
            <div className="text-center hidden sm:block">Played</div>
            <div className="text-center sm:hidden">P</div>
            <div className="text-center">W</div>
            <div className="text-center">D</div>
            <div className="text-center">L</div>
            <div className="text-center hidden sm:block">GD</div>
            <div className="text-center sm:hidden">GD</div>
            <div className="text-center text-[#00D8FF]">Pts</div>
            <div className="text-center hidden md:block">Form</div>
            <div className="text-center md:hidden"></div>
          </div>

          {/* Table Body */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroupId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {activeGroup.teams.map((team, index) => {
                  const isQualified = team.status === 'QUALIFIED';
                  const isEliminated = team.status === 'ELIMINATED';
                  
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className={`relative grid grid-cols-[3rem_1.5fr_repeat(6,minmax(2.5rem,1fr))_4rem] md:grid-cols-[4rem_2fr_repeat(6,1fr)_8rem] gap-2 md:gap-4 items-center px-4 md:px-8 py-5 border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/[0.03] group ${
                        isEliminated ? 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all' : ''
                      }`}
                    >
                      {/* Qualification Indicator Border */}
                      {isQualified && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.8)]" />
                      )}

                      {/* Position */}
                      <div className="text-center font-mono text-sm md:text-base text-white/40 group-hover:text-white transition-colors">
                        {team.position}
                      </div>

                      {/* Nation */}
                      <div className="flex items-center gap-3">
                        <span className="text-xl md:text-2xl font-black text-white/50">{team.flag}</span>
                        <div className="flex flex-col">
                          <span className="font-bold tracking-wider text-sm md:text-base hidden sm:block">{team.name}</span>
                          <span className="font-bold tracking-wider text-sm md:text-base sm:hidden">{team.short}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-center font-mono text-sm text-white/70">{team.played}</div>
                      <div className="text-center font-mono text-sm text-white/70">{team.won}</div>
                      <div className="text-center font-mono text-sm text-white/70">{team.drawn}</div>
                      <div className="text-center font-mono text-sm text-white/70">{team.lost}</div>
                      
                      {/* Goal Difference */}
                      <div className="text-center font-mono text-sm">
                        <span className={team.gd > 0 ? 'text-emerald-400' : team.gd < 0 ? 'text-red-400' : 'text-white/50'}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="text-center font-mono text-base md:text-lg font-black text-[#00D8FF]">
                        {team.points}
                      </div>

                      {/* Form */}
                      <div className="flex justify-center gap-1.5 hidden md:flex">
                        {team.form.map((f, i) => (
                          <FormPill key={i} result={f} />
                        ))}
                      </div>
                      
                      {/* Status badge for mobile instead of form, or just empty space */}
                      <div className="flex justify-center md:hidden">
                        {isQualified && <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">check_circle</span>}
                        {isEliminated && <span className="material-symbols-outlined text-[16px] text-red-500">cancel</span>}
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer Legend */}
          <div className="bg-[#030712]/50 border-t border-white/5 px-8 py-4 flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3 bg-[#00D8FF] rounded-sm" />
              <span>Advances to Knockout Phase</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3 bg-white/20 rounded-sm" />
              <span>Possible Qualification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3 bg-transparent border border-white/10 rounded-sm opacity-50" />
              <span>Eliminated</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default StandingsDashboard;
