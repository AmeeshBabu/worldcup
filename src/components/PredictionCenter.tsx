import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type BracketNode = {
  id: string;
  round: string;
  team1?: string;
  team2?: string;
  winner?: string;
};

type ScorePrediction = {
  id: string;
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
};

// --- Mock Data ---
const INITIAL_SCORES: ScorePrediction[] = [
  { id: 'm1', home: 'MEX', homeFlag: 'MX', away: 'USA', awayFlag: 'US', homeScore: 0, awayScore: 0 },
  { id: 'm2', home: 'ENG', homeFlag: 'EN', away: 'IRN', awayFlag: 'IR', homeScore: 0, awayScore: 0 },
  { id: 'm3', home: 'ARG', homeFlag: 'AR', away: 'KSA', awayFlag: 'SA', homeScore: 0, awayScore: 0 },
  { id: 'm4', home: 'FRA', homeFlag: 'FR', away: 'CAN', awayFlag: 'CA', homeScore: 0, awayScore: 0 },
];

const GOLDEN_BOOT_CONTENDERS = [
  { name: 'Kylian Mbappé', nation: 'France', flag: 'FR' },
  { name: 'Lionel Messi', nation: 'Argentina', flag: 'AR' },
  { name: 'Harry Kane', nation: 'England', flag: 'EN' },
  { name: 'Vinícius Jr.', nation: 'Brazil', flag: 'BR' },
];

const BRACKET_QUARTERS: BracketNode[] = [
  { id: 'q1', round: 'QUARTER FINAL', team1: 'FRA', team2: 'ENG' },
  { id: 'q2', round: 'QUARTER FINAL', team1: 'ARG', team2: 'NED' },
];

// --- Helper Components ---
function ScoreControl({ 
  prediction, 
  updateScore 
}: { 
  prediction: ScorePrediction; 
  updateScore: (id: string, team: 'home' | 'away', change: number) => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-between p-6 rounded-2xl border border-white/10 bg-[#070b14]/60 backdrop-blur-xl shadow-lg transition-colors hover:border-[#00D8FF]/30 hover:bg-white/[0.03]"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D8FF] mb-6">Group Stage Prediction</span>
      
      <div className="flex w-full items-center justify-between">
        
        {/* Home Team */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl drop-shadow-md">{prediction.homeFlag}</span>
            <span className="text-sm font-bold text-white tracking-widest">{prediction.home}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
            <button aria-label={`Decrease ${prediction.home} score`} onClick={() => updateScore(prediction.id, 'home', -1)} className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#00D8FF] hover:text-black transition-colors flex items-center justify-center font-bold text-white/50">-</button>
            <span className="w-8 text-center text-xl font-black text-white">{prediction.homeScore}</span>
            <button aria-label={`Increase ${prediction.home} score`} onClick={() => updateScore(prediction.id, 'home', 1)} className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#00D8FF] hover:text-black transition-colors flex items-center justify-center font-bold text-white/50">+</button>
          </div>
        </div>

        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">vs</span>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl drop-shadow-md">{prediction.awayFlag}</span>
            <span className="text-sm font-bold text-white tracking-widest">{prediction.away}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
            <button aria-label={`Decrease ${prediction.away} score`} onClick={() => updateScore(prediction.id, 'away', -1)} className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#00D8FF] hover:text-black transition-colors flex items-center justify-center font-bold text-white/50">-</button>
            <span className="w-8 text-center text-xl font-black text-white">{prediction.awayScore}</span>
            <button aria-label={`Increase ${prediction.away} score`} onClick={() => updateScore(prediction.id, 'away', 1)} className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#00D8FF] hover:text-black transition-colors flex items-center justify-center font-bold text-white/50">+</button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// --- Main Component ---
export function PredictionCenter() {
  const [activeTab, setActiveTab] = useState<'BRACKET' | 'SCORES' | 'AWARDS'>('BRACKET');
  const [scores, setScores] = useState<ScorePrediction[]>(INITIAL_SCORES);
  const [goldenBoot, setGoldenBoot] = useState<string | null>(null);
  const [bracketState, setBracketState] = useState<Record<string, string>>({});

  // Calculations for progress bar
  const totalPredictions = scores.length + 1 + BRACKET_QUARTERS.length; // 4 scores, 1 award, 2 brackets = 7
  const completedScores = scores.filter(s => s.homeScore > 0 || s.awayScore > 0).length;
  const completedAwards = goldenBoot ? 1 : 0;
  const completedBrackets = Object.keys(bracketState).length;
  
  const currentProgress = completedScores + completedAwards + completedBrackets;
  const progressPercentage = (currentProgress / totalPredictions) * 100;

  const updateScore = (id: string, team: 'home' | 'away', change: number) => {
    setScores(prev => prev.map(score => {
      if (score.id === id) {
        const newVal = Math.max(0, score[`${team}Score`] + change);
        return { ...score, [`${team}Score`]: newVal };
      }
      return score;
    }));
  };

  const setBracketWinner = (matchId: string, winner: string) => {
    setBracketState(prev => ({ ...prev, [matchId]: winner }));
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-start pt-24 pb-16 px-4 md:px-8 font-sans">
      
      {/* Ambience / Background */}
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.05)_0%,transparent_60%)] pointer-events-none blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.04)_0%,transparent_60%)] pointer-events-none blur-3xl translate-x-1/3" />

      {/* Progress Tracker Tracker Header - Sticky */}
      <div className="sticky top-0 z-50 pt-4 pb-8 bg-[#070b14]/80 backdrop-blur-md mb-8 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Prediction Oracle</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D8FF]">{Math.round(progressPercentage)}% Complete</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl w-full flex-1 flex flex-col">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
              Predict the <span className="text-[#00D8FF]">Glory</span>
            </h2>
            <p className="text-sm text-white/50 max-w-md">Lock in your predictions for the entire tournament. Compete against global leaderboards and friends.</p>
          </div>

          <div className="flex p-1 rounded-2xl border border-white/10 bg-[#070b14]/50 backdrop-blur-xl">
            {(['BRACKET', 'SCORES', 'AWARDS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === tab ? 'text-[#030712]' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-prediction-tab"
                    className="absolute inset-0 bg-[#00D8FF] rounded-xl shadow-[0_0_15px_rgba(0,216,255,0.3)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 w-full rounded-3xl border border-white/5 bg-[#070b14]/40 backdrop-blur-md p-4 md:p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* --- BRACKET TAB --- */}
            {activeTab === 'BRACKET' && (
              <motion.div
                key="BRACKET"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 h-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#00D8FF]">account_tree</span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Knockout Stage Simulator</h3>
                </div>

                <div className="w-full overflow-x-auto no-scrollbar pb-8">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-24 relative mt-10 min-w-max mx-auto px-4">
                    
                    {/* Quarters (Mock Left Side) */}
                    <div className="flex flex-col gap-12 relative z-10">
                      {BRACKET_QUARTERS.map((match) => (
                        <div key={match.id} className="flex flex-col w-56 bg-black/40 rounded-xl border border-white/10 overflow-hidden shadow-lg hover:border-white/20 transition-colors">
                          <div className="bg-white/5 px-4 py-2 text-[9px] uppercase tracking-widest text-white/40 border-b border-white/10 text-center font-bold">
                            {match.round}
                          </div>
                          <button 
                            onClick={() => setBracketWinner(match.id, match.team1!)}
                            className={`flex items-center justify-between px-4 py-4 border-b border-white/5 transition-colors ${bracketState[match.id] === match.team1 ? 'bg-[#00D8FF]/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span className="font-bold tracking-widest">{match.team1}</span>
                            {bracketState[match.id] === match.team1 && <span className="material-symbols-outlined text-[14px] text-[#00D8FF]">check_circle</span>}
                          </button>
                          <button 
                            onClick={() => setBracketWinner(match.id, match.team2!)}
                            className={`flex items-center justify-between px-4 py-4 transition-colors ${bracketState[match.id] === match.team2 ? 'bg-[#00D8FF]/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span className="font-bold tracking-widest">{match.team2}</span>
                            {bracketState[match.id] === match.team2 && <span className="material-symbols-outlined text-[14px] text-[#00D8FF]">check_circle</span>}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Connectors - Visual Only */}
                    <div className="hidden md:block absolute left-[15rem] top-1/2 -translate-y-1/2 w-12 h-56 border-t-2 border-b-2 border-r-2 border-[#00D8FF]/30 rounded-r-xl pointer-events-none" />
                    <div className="hidden md:block absolute left-[18rem] top-1/2 -translate-y-1/2 w-8 border-t-2 border-[#00D8FF]/30 pointer-events-none" />

                    {/* Semi Final & Final Destination */}
                    <div className="flex items-center gap-8 lg:gap-16 relative z-10">
                       <div className="flex flex-col w-56 bg-[#00D8FF]/10 rounded-xl border border-[#00D8FF]/40 overflow-hidden shadow-[0_0_30px_rgba(0,216,255,0.15)]">
                          <div className="bg-[#00D8FF] px-4 py-2 text-[9px] uppercase tracking-widest text-black border-b border-[#00D8FF]/40 text-center font-bold">
                            SEMI FINAL
                          </div>
                          <button 
                            onClick={() => bracketState[BRACKET_QUARTERS[0].id] && setBracketWinner('s1', bracketState[BRACKET_QUARTERS[0].id])}
                            className={`flex items-center justify-between px-4 py-6 border-b border-white/5 transition-colors ${bracketState['s1'] === bracketState[BRACKET_QUARTERS[0].id] && bracketState['s1'] ? 'bg-[#00D8FF]/20 text-white' : 'bg-[#030712]/50 text-white hover:bg-white/5'}`}
                          >
                            <span className="font-bold tracking-widest text-xl">{bracketState[BRACKET_QUARTERS[0].id] || '?'}</span>
                            {bracketState['s1'] === bracketState[BRACKET_QUARTERS[0].id] && bracketState['s1'] && <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">emoji_events</span>}
                          </button>
                          <button 
                            onClick={() => bracketState[BRACKET_QUARTERS[1].id] && setBracketWinner('s1', bracketState[BRACKET_QUARTERS[1].id])}
                            className={`flex items-center justify-between px-4 py-6 transition-colors ${bracketState['s1'] === bracketState[BRACKET_QUARTERS[1].id] && bracketState['s1'] ? 'bg-[#00D8FF]/20 text-white' : 'bg-[#030712]/50 text-white hover:bg-white/5'}`}
                          >
                            <span className="font-bold tracking-widest text-xl">{bracketState[BRACKET_QUARTERS[1].id] || '?'}</span>
                            {bracketState['s1'] === bracketState[BRACKET_QUARTERS[1].id] && bracketState['s1'] && <span className="material-symbols-outlined text-[16px] text-[#00D8FF]">emoji_events</span>}
                          </button>
                        </div>

                        {/* Final Connector */}
                        <div className="hidden md:block absolute left-[14.5rem] top-1/2 -translate-y-1/2 w-8 border-t-2 border-yellow-500/50 pointer-events-none" />

                        {/* Final Winner */}
                        <div className="flex flex-col w-56 bg-yellow-500/10 rounded-xl border border-yellow-500/40 overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.15)] ml-8 md:ml-0">
                          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-2 text-[10px] uppercase tracking-widest text-black border-b border-yellow-500/40 text-center font-extrabold flex justify-center gap-1 items-center">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            WORLD CHAMPION
                          </div>
                          <div className="flex items-center justify-center px-4 py-8 text-white bg-[#030712]/80 h-[104px]">
                            {bracketState['s1'] ? (
                              <motion.span 
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="font-black tracking-widest text-3xl text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                              >
                                {bracketState['s1']}
                              </motion.span>
                            ) : (
                              <span className="font-bold text-white/20 text-3xl">?</span>
                            )}
                          </div>
                        </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* --- SCORES TAB --- */}
            {activeTab === 'SCORES' && (
              <motion.div
                key="SCORES"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
              >
                {scores.map(score => (
                  <ScoreControl key={score.id} prediction={score} updateScore={updateScore} />
                ))}
              </motion.div>
            )}

            {/* --- AWARDS TAB --- */}
            {activeTab === 'AWARDS' && (
              <motion.div
                key="AWARDS"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                 <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#00D8FF]">emoji_events</span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Golden Boot Predictor</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {GOLDEN_BOOT_CONTENDERS.map(player => {
                    const isSelected = goldenBoot === player.name;
                    return (
                      <motion.button
                        key={player.name}
                        onClick={() => setGoldenBoot(player.name)}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border transition-all ${
                          isSelected 
                          ? 'bg-[#00D8FF]/20 border-[#00D8FF] shadow-[0_0_20px_rgba(0,216,255,0.4)]' 
                          : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-5xl mb-2 drop-shadow-md">{player.flag}</span>
                        <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{player.name}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{player.nation}</span>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <span className="material-symbols-outlined text-[#00D8FF]">verified</span>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sticky Submit Footer */}
        <div className="mt-8 flex justify-center md:justify-end">
          <button className="flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold uppercase tracking-widest text-[#030712] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span>Lock Predictions</span>
            <span className="material-symbols-outlined">lock</span>
          </button>
        </div>

      </div>
    </section>
  );
}

export default PredictionCenter;
