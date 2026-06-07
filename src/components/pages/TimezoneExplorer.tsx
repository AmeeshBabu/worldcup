import { motion } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';

const TIMEZONES = [
  { region: 'Americas (Host)', zones: [
    { name: 'Los Angeles (PDT)', offset: 'UTC-7', time: '12:00 PM' },
    { name: 'Mexico City (CST)', offset: 'UTC-6', time: '01:00 PM' },
    { name: 'New York (EDT)', offset: 'UTC-4', time: '03:00 PM' },
  ]},
  { region: 'Europe / Africa', zones: [
    { name: 'London (BST)', offset: 'UTC+1', time: '08:00 PM' },
    { name: 'Paris / Berlin (CEST)', offset: 'UTC+2', time: '09:00 PM' },
    { name: 'Cape Town (SAST)', offset: 'UTC+2', time: '09:00 PM' },
  ]},
  { region: 'Asia / Oceania', zones: [
    { name: 'New Delhi (IST)', offset: 'UTC+5:30', time: '12:30 AM (Next Day)' },
    { name: 'Tokyo (JST)', offset: 'UTC+9', time: '04:00 AM (Next Day)' },
    { name: 'Sydney (AEST)', offset: 'UTC+10', time: '05:00 AM (Next Day)' },
  ]}
];

export function TimezoneExplorer() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white p-8 md:p-16 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.05)_0%,transparent_60%)] pointer-events-none blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <button 
        onClick={() => navigate('HOME')}
        className="self-start group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00D8FF]/10 hover:border-[#00D8FF]/30 transition-colors mb-12 relative z-10"
      >
        <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="font-label-caps text-xs tracking-widest uppercase text-white/80 group-hover:text-[#00D8FF]">Back to Hub</span>
      </button>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex-1">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
          Global <span className="text-[#00D8FF]">Timezones</span>
        </h1>
        <p className="text-white/50 max-w-2xl mb-16">
          The 2026 World Cup spans three host nations and multiple timezones. Below are the corresponding match kick-off times across major global regions for a standard 12:00 PM PST kickoff.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {TIMEZONES.map((region, i) => (
            <motion.div 
              key={region.region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#070b14]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00D8FF] mb-6 pb-4 border-b border-white/10">
                {region.region}
              </h2>
              <div className="flex flex-col gap-6">
                {region.zones.map(zone => (
                  <div key={zone.name} className="flex flex-col">
                    <span className="text-lg font-bold text-white mb-1">{zone.name}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#00D8FF] text-xl drop-shadow-[0_0_8px_rgba(0,216,255,0.4)]">{zone.time}</span>
                      <span className="text-xs uppercase tracking-widest text-white/30">{zone.offset}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
