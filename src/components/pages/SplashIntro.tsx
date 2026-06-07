import { motion } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';

export function SplashIntro() {
  const { navigate } = useNavigation();

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030712] overflow-hidden flex flex-col items-center justify-center z-[100]">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,216,255,0.08)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-yellow-500/5 rounded-full blur-[100px] mix-blend-screen animate-pulse" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* World Cup Trophy Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 40,
            damping: 20,
            duration: 1.5 
          }}
          className="relative flex items-center justify-center mb-8"
        >
          {/* Glowing Aura Behind Trophy */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent blur-3xl rounded-full scale-150" />
          
          <span 
            className="material-symbols-outlined text-[120px] md:text-[180px] bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
          >
            emoji_events
          </span>
        </motion.div>

        {/* Title Sequence */}
        <motion.div 
          className="flex flex-col items-center text-center space-y-4 mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.8 }
            }
          }}
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-lg"
          >
            World Cup <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D8FF] to-blue-600">2026</span>
          </motion.h1>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-sm md:text-base font-bold uppercase tracking-[0.4em] text-white/50"
          >
            The Ultimate Football Experience
          </motion.p>
        </motion.div>

        {/* Interactive Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <button 
            onClick={() => navigate('HOME')}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 transition-all hover:border-[#00D8FF] hover:shadow-[0_0_40px_rgba(0,216,255,0.3)] focus:outline-none"
          >
            {/* Button Hover Background Fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D8FF]/20 to-blue-600/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            
            <div className="relative flex items-center gap-3">
              <span className="font-label-caps text-sm tracking-[0.3em] uppercase text-white font-bold group-hover:text-white transition-colors">
                Enter Experience
              </span>
              <motion.span 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="material-symbols-outlined text-[#00D8FF] text-[20px]"
              >
                arrow_forward
              </motion.span>
            </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
