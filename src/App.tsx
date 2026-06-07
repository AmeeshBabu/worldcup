import { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { useNavigation } from './contexts/NavigationContext';

// Scenes
import CinematicScrollHero from './components/CinematicScrollHero';
import TournamentStats from './components/scenes/TournamentStats';
import MatchCommandCenter from './components/MatchCommandCenter';
import LiveMatchCenter from './components/LiveMatchCenter';
import StandingsDashboard from './components/StandingsDashboard';
import TeamExplorer from './components/TeamExplorer';
import FinalCountdown from './components/FinalCountdown';
import GoalSequence from './components/scenes/GoalSequence';
import PersonalizedHub from './components/PersonalizedHub';
import PredictionCenter from './components/PredictionCenter';
import { TimezoneExplorer } from './components/pages/TimezoneExplorer';
import { SplashIntro } from './components/pages/SplashIntro';

function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  // The master scroll progress across the entire 1500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Apply a floaty, cinematic spring physics to the scroll value
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 40,
    damping: 15,
    restDelta: 0.001
  });

  // Stretch Hero progress across the entire scroll so it plays while features appear!
  const heroProgress = useTransform(smoothProgress, [0, 0.9], [0, 1]);

  // Scene 1: Hero Background persists until the very end
  const heroOpacity = useTransform(smoothProgress, [0, 0.95, 1], [1, 1, 0.15]);
  
  // Scene 2: Tournament Stats
  const statsOpacity = useTransform(smoothProgress, [0.18, 0.22, 0.28, 0.32], [0, 1, 1, 0]);
  const statsScale = useTransform(smoothProgress, [0.18, 0.22, 0.32], [0.9, 1, 1.1]);
  const statsPointerEvents = useTransform(smoothProgress, (p) => p > 0.18 && p < 0.32 ? "auto" : "none");

  // Scene 3: Match Command Center
  const commandCenterOpacity = useTransform(smoothProgress, [0.28, 0.32, 0.38, 0.42], [0, 1, 1, 0]);
  const commandCenterScale = useTransform(smoothProgress, [0.28, 0.32, 0.42], [0.95, 1, 1.05]);
  const commandCenterPointerEvents = useTransform(smoothProgress, (p) => p > 0.28 && p < 0.42 ? "auto" : "none");

  // Scene 4: Live Match Center
  const liveMatchOpacity = useTransform(smoothProgress, [0.38, 0.42, 0.48, 0.52], [0, 1, 1, 0]);
  const liveMatchScale = useTransform(smoothProgress, [0.38, 0.42, 0.52], [0.95, 1, 1.05]);
  const liveMatchPointerEvents = useTransform(smoothProgress, (p) => p > 0.38 && p < 0.52 ? "auto" : "none");

  // Scene 5: Standings Dashboard
  const standingsOpacity = useTransform(smoothProgress, [0.48, 0.52, 0.58, 0.62], [0, 1, 1, 0]);
  const standingsScale = useTransform(smoothProgress, [0.48, 0.52, 0.62], [0.95, 1, 1.05]);
  const standingsPointerEvents = useTransform(smoothProgress, (p) => p > 0.48 && p < 0.62 ? "auto" : "none");

  // Scene 6: Team Explorer
  const teamOpacity = useTransform(smoothProgress, [0.58, 0.62, 0.68, 0.72], [0, 1, 1, 0]);
  const teamScale = useTransform(smoothProgress, [0.58, 0.62, 0.72], [0.95, 1, 1.05]);
  const teamPointerEvents = useTransform(smoothProgress, (p) => p > 0.58 && p < 0.72 ? "auto" : "none");

  // Scene 7: Final Countdown
  const countdownOpacity = useTransform(smoothProgress, [0.68, 0.72, 0.78, 0.82], [0, 1, 1, 0]);
  const countdownScale = useTransform(smoothProgress, [0.68, 0.72, 0.82], [0.9, 1, 1.1]);
  const countdownPointerEvents = useTransform(smoothProgress, (p) => p > 0.68 && p < 0.82 ? "auto" : "none");

  // Scene 8: Goal Sequence
  const goalOpacity = useTransform(smoothProgress, [0.78, 0.82, 0.88, 0.92], [0, 1, 1, 0]);
  const goalScale = useTransform(smoothProgress, [0.78, 0.82, 0.92], [0.9, 1, 1.1]);
  const goalPointerEvents = useTransform(smoothProgress, (p) => p > 0.78 && p < 0.92 ? "auto" : "none");

  // Scene 9: Personalized Hub & Prediction (Combined Final Chapter)
  const finalOpacity = useTransform(smoothProgress, [0.88, 0.92, 1, 1], [0, 1, 1, 1]);
  const finalScale = useTransform(smoothProgress, [0.88, 0.92, 1], [0.95, 1, 1]);
  const finalPointerEvents = useTransform(smoothProgress, (p) => p >= 0.88 ? "auto" : "none");

  // Z-index management (pointer events are handled by CSS class conditionally based on opacity via React logic, 
  // but to keep Framer Motion smooth, we just overlay them absolutely. To click things, we can use pointer-events styling.)
  
  return (
    <div ref={containerRef} className="relative h-[1500vh] bg-black text-white font-sans selection:bg-[#00D8FF] selection:text-[#030712] overflow-x-hidden">
      
      {/* Pinned Viewport Container */}
      <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center">
        
        {/* Global Dark Gradient Overlay for the background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712] pointer-events-none z-0" />

        {/* Scene 1: Cinematic Hero (Background Layer) */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ opacity: heroOpacity }}
        >
          <CinematicScrollHero progress={heroProgress} />
        </motion.div>

        {/* Scene 2: Tournament Stats */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: statsOpacity, scale: statsScale, pointerEvents: statsPointerEvents }}
        >
          <div className="w-full h-full">
            <TournamentStats />
          </div>
        </motion.div>

        {/* Scene 3: Match Command Center */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: commandCenterOpacity, scale: commandCenterScale, pointerEvents: commandCenterPointerEvents }}
        >
          <div className="w-full h-full">
            <MatchCommandCenter />
          </div>
        </motion.div>

        {/* Scene 4: Live Match Center */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ opacity: liveMatchOpacity, scale: liveMatchScale, pointerEvents: liveMatchPointerEvents }}
        >
          <div className="w-full h-full">
            <LiveMatchCenter />
          </div>
        </motion.div>

        {/* Scene 5: Standings */}
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ opacity: standingsOpacity, scale: standingsScale, pointerEvents: standingsPointerEvents }}
        >
          <div className="w-full h-full">
            <StandingsDashboard />
          </div>
        </motion.div>

        {/* Scene 6: Team Explorer */}
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ opacity: teamOpacity, scale: teamScale, pointerEvents: teamPointerEvents }}
        >
          <div className="w-full h-full">
            <TeamExplorer />
          </div>
        </motion.div>

        {/* Scene 7: Final Countdown */}
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ opacity: countdownOpacity, scale: countdownScale, pointerEvents: countdownPointerEvents }}
        >
          <div className="w-full h-full">
            <FinalCountdown />
          </div>
        </motion.div>

        {/* Scene 8: Goal Sequence */}
        <motion.div
          className="absolute inset-0 z-[60] flex items-center justify-center"
          style={{ opacity: goalOpacity, scale: goalScale, pointerEvents: goalPointerEvents }}
        >
          <div className="w-full h-full">
            <GoalSequence />
          </div>
        </motion.div>

        {/* Scene 9: Final Chapter (Personalized + Prediction) */}
        <motion.div
          className="absolute inset-0 z-[70] flex items-center justify-center"
          style={{ opacity: finalOpacity, scale: finalScale, pointerEvents: finalPointerEvents }}
        >
          <div className="w-full h-full bg-[#030712] overflow-y-auto custom-scrollbar pb-16">
            <PersonalizedHub />
            <PredictionCenter />
            {/* Footer */}
            <footer className="w-full bg-black py-12 px-6 border-t border-white/10 text-center mt-12">
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                &copy; 2026 World Cup Experience. Unofficial concept.
              </p>
            </footer>
          </div>
        </motion.div>

        {/* Global Progress Bar overlaid on top */}
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-[#00D8FF] z-[100]"
          style={{ width: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
        />

      </div>
    </div>
  );
}

function App() {
  const { currentRoute } = useNavigation();

  if (currentRoute === 'INTRO') {
    return <SplashIntro />;
  }

  if (currentRoute === 'TIMEZONES') {
    return <TimezoneExplorer />;
  }

  // Fallback to cinematic scroll
  return <CinematicScroll />;
}

export default App;
