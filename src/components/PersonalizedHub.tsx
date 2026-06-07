import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const USER_DATA = {
  name: 'Alex',
  favoriteTeams: [
    { id: 't1', name: 'Mexico', flag: 'MX', nextMatch: 'vs USA • Thu 11 Jun' },
    { id: 't2', name: 'Argentina', flag: 'AR', nextMatch: 'vs KSA • Sat 13 Jun' },
    { id: 't3', name: 'France', flag: 'FR', nextMatch: 'vs CAN • Sun 14 Jun' },
  ],
  pinnedMatches: [
    { id: 'm1', home: 'MEX', homeFlag: 'MX', away: 'USA', awayFlag: 'US', date: 'Tonight, 01:30 IST', venue: 'Estadio Azteca', status: 'UPCOMING', reminder: true },
    { id: 'm2', home: 'ENG', homeFlag: 'EN', away: 'IRN', awayFlag: 'IR', date: 'Tomorrow, 18:30 IST', venue: 'MetLife Stadium', status: 'UPCOMING', reminder: false },
    { id: 'm3', home: 'BRA', homeFlag: 'BR', homeScore: 3, away: 'JPN', awayFlag: 'JP', awayScore: 1, date: 'Finished', venue: 'Lumen Field', status: 'FINISHED', reminder: false },
  ],
  recommended: [
    { id: 'r1', title: 'Group of Death Clash', desc: 'Spain vs Germany', date: '18 Jun, 22:30 IST' },
    { id: 'r2', title: 'Underdog Story', desc: 'Wales vs Iran', date: '19 Jun, 18:30 IST' },
  ],
  recentlyViewed: ['BR Brazil', 'ES Spain', 'PL Poland', 'CA Canada']
};

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// --- Helper Components ---

function TeamWidget({ team }: { team: typeof USER_DATA.favoriteTeams[0] }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      role="button"
      tabIndex={0}
      className="flex min-w-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#070b14]/60 p-6 backdrop-blur-xl transition-colors hover:border-[#00D8FF]/40 hover:bg-[#00D8FF]/5 cursor-pointer shadow-lg"
    >
      <span className="text-3xl font-black drop-shadow-lg text-white/50">{team.flag}</span>
      <div className="flex flex-col items-center text-center">
        <span className="font-bold text-white tracking-wide">{team.name}</span>
        <span className="text-[9px] uppercase tracking-widest text-white/50 mt-1">{team.nextMatch}</span>
      </div>
    </motion.div>
  );
}

function MatchRow({ match, toggleReminder }: { match: typeof USER_DATA.pinnedMatches[0]; toggleReminder: (id: string) => void }) {
  const isFinished = match.status === 'FINISHED';
  
  return (
    <motion.div 
      variants={itemVariants}
      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] hover:border-white/10"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {match.status === 'UPCOMING' ? (
             <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined text-[14px] text-[#00D8FF]">event</span>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D8FF]">{match.date}</span>
             </div>
          ) : (
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Full Time</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-lg md:text-xl font-bold text-white">
          <span className="text-xl font-black text-white/50">{match.homeFlag}</span>
          <span>{match.home}</span>
          {isFinished ? (
            <span className="text-[#00D8FF] px-2">{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="text-white/20 px-2 font-light">vs</span>
          )}
          <span>{match.away}</span>
          <span className="text-xl font-black text-white/50">{match.awayFlag}</span>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">📍 {match.venue}</span>
      </div>

      <div className="flex items-center justify-end md:justify-center gap-3">
        {!isFinished && (
          <button 
            onClick={() => toggleReminder(match.id)}
            aria-label={match.reminder ? `Remove reminder for ${match.home} vs ${match.away}` : `Set reminder for ${match.home} vs ${match.away}`}
            className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${match.reminder ? 'bg-[#00D8FF] text-[#030712] shadow-[0_0_15px_rgba(0,216,255,0.4)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{match.reminder ? 'notifications_active' : 'notifications_none'}</span>
          </button>
        )}
        <button className="flex items-center justify-center h-10 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10">
          {isFinished ? 'Highlights' : 'Match Hub'}
        </button>
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export function PersonalizedHub() {
  const [pinned, setPinned] = useState(USER_DATA.pinnedMatches);

  const toggleReminder = (id: string) => {
    setPinned(prev => prev.map(m => m.id === id ? { ...m, reminder: !m.reminder } : m));
  };

  return (
    <section className="relative w-full h-full flex flex-col justify-center px-4 md:px-8 font-sans overflow-hidden">
      
      {/* Ambience / Background */}
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.04)_0%,transparent_60%)] pointer-events-none blur-3xl -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.03)_0%,transparent_60%)] pointer-events-none blur-3xl translate-y-1/4 -translate-x-1/4" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00D8FF]">
                Your Dashboard
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
              Welcome Back, <span className="text-[#00D8FF]">{USER_DATA.name}</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <button aria-label="Settings" className="flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-[#070b14]/80 text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-white/10 bg-[#070b14]/80 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">add</span>
              Add Teams
            </button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          
          {/* Main Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-8"
          >
            {/* My Teams Carousel */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00D8FF] text-[18px]">favorite</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Favorite Teams</h3>
              </div>
              
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                {USER_DATA.favoriteTeams.map((team) => (
                  <TeamWidget key={team.id} team={team} />
                ))}
              </div>
            </div>

            {/* Pinned Matches */}
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00D8FF] text-[18px]">push_pin</span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Pinned Matches</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/40">{pinned.length} Saved</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {pinned.map((match) => (
                    <MatchRow key={match.id} match={match} toggleReminder={toggleReminder} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
          </motion.div>

          {/* Sidebar Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-6"
          >
            
            {/* Quick Reminders Widget */}
            <motion.div variants={itemVariants} className="rounded-3xl border border-[#00D8FF]/20 bg-[#00D8FF]/5 p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D8FF]/10 blur-2xl rounded-full" />
              
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#00D8FF] animate-pulse">notifications_active</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Next Alert</h3>
              </div>
              
              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-2xl font-black text-[#00D8FF]">Mexico vs USA</span>
                <span className="text-sm font-bold text-white/80">Tonight at 01:30 IST</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-2">Group A • Estadio Azteca</span>
              </div>
              
              <button className="w-full mt-6 py-3 rounded-xl bg-[#00D8FF] text-[#030712] font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                View Pre-Match
              </button>
            </motion.div>

            {/* Recommended Action */}
            <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#070b14]/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-white/60">auto_awesome</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Recommended</h3>
              </div>

              <div className="flex flex-col gap-4">
                {USER_DATA.recommended.map(rec => (
                  <div key={rec.id} className="group cursor-pointer flex flex-col gap-1 border-l-2 border-white/10 pl-4 hover:border-[#00D8FF] transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D8FF]">{rec.title}</span>
                    <span className="text-sm font-bold text-white">{rec.desc}</span>
                    <span className="text-[10px] text-white/40">{rec.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recently Viewed */}
            <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#070b14]/60 p-6 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4">Recently Viewed</h3>
              <div className="flex flex-wrap gap-2">
                {USER_DATA.recentlyViewed.map(nation => (
                  <span key={nation} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-white/70 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
                    {nation}
                  </span>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default PersonalizedHub;
