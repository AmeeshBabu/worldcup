import { motion, useReducedMotion } from 'framer-motion';

type StreamCard = {
  label: string;
  title: string;
  subtitle: string;
  status: string;
  accent: string;
};

type TelemetryStat = {
  label: string;
  home: string;
  away: string;
  value: string;
};

const liveStreams: StreamCard[] = [
  {
    label: 'LIVE',
    title: 'Mexico vs USA',
    subtitle: 'Estadio Azteca, Mexico City',
    status: '65:23 On Air',
    accent: 'from-cyan-400/20 via-cyan-400/10 to-transparent',
  },
  {
    label: 'UP NEXT',
    title: 'England vs USA',
    subtitle: 'MetLife Stadium, New York',
    status: '21:30 IST Pre-show',
    accent: 'from-white/10 via-white/5 to-transparent',
  },
  {
    label: 'FEATURED',
    title: 'Argentina vs Saudi Arabia',
    subtitle: 'AT&T Stadium, Dallas',
    status: 'Tactical camera feed',
    accent: 'from-emerald-400/10 via-cyan-400/5 to-transparent',
  },
];

const telemetry: TelemetryStat[] = [
  { label: 'Possession', home: '58%', away: '42%', value: 'Mexico controls the tempo' },
  { label: 'Shots on Target', home: '7', away: '3', value: 'United States pressing high' },
  { label: 'Expected Goals', home: '2.1', away: '0.8', value: 'High-value chances from both wings' },
  { label: 'Broadcast Bitrate', home: '18 Mbps', away: '4K HDR', value: 'Adaptive stream locked' },
];

const scheduleRail = [
  { time: "65'", match: 'MEX 2 - 1 USA', venue: 'Estadio Azteca', live: true },
  { time: '21:30 IST', match: 'ENG vs USA', venue: 'MetLife Stadium', live: false },
  { time: '00:30 IST', match: 'ARG vs KSA', venue: 'AT&T Stadium', live: false },
  { time: '03:00 IST', match: 'FRA vs AUS', venue: 'SoFi Stadium', live: false },
];

const containerVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function PremiumStreamingHubSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-40 w-full border-t border-white/5 bg-surface-container-low px-container-padding-mobile py-section-gap md:px-container-padding-desktop">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
          className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr]"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary">
                  Premium streaming control room
                </p>
                <h2 className="mt-3 font-headline-lg text-headline-lg uppercase tracking-tight text-white">
                  Match Center <span className="text-primary">Broadcast Hub</span>
                </h2>
                <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                  Switch between live match feeds, tactical angles, and upcoming fixtures without leaving the premium viewing surface. The section keeps the same glass, glow, and telemetry language already used across the platform.
                </p>
              </div>

              <div className="glass-panel glow-cyan flex items-center gap-3 rounded-full px-4 py-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
                <div className="flex flex-col">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-white/60">Currently streaming</span>
                  <span className="font-body-md text-sm text-white">Mexico v USA, Estadio Azteca</span>
                </div>
              </div>
            </div>

            <motion.div variants={itemVariants} className="glass-panel relative overflow-hidden rounded-2xl border border-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,216,255,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(156,246,171,0.08),transparent_35%)]" />
              <div className="relative grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative min-h-[420px] overflow-hidden border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5">
                  <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7tBnf-JiJ2PuNFN9_klZqekKG8xwBR2I4MpZb1ZyJC4DaSTwfZfjQ1b4-HiCk59CwICjaDNf4OEQTvSSk7l3jXke9fd2TEsRVAE7OKIFLVblN3Mninp70S2IOO5qRqdRvCqYyAgYDfHWnEX3F3ZNa0YfhI1DMeujKXVIZeJSGNRFHlE6BI4bzbpuU7I9MXuVaMkgJzZWghH6Po5FOv1v5uC31ASHKYDY_Jq1PdLUoTcQ3zfy42xjMMeouRJAqqK0YA671e5Yh9no')] bg-cover bg-center opacity-85 mix-blend-luminosity transition duration-500 group-hover:mix-blend-normal" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-0 tech-grid opacity-40" />

                  <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black/70 px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-primary">
                        Live 65&apos;
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/70">
                        4K HDR primary feed
                      </span>
                    </div>

                    <div className="max-w-xl">
                      <p className="font-label-caps text-[10px] uppercase tracking-[0.28em] text-white/60">
                        Featured broadcast
                      </p>
                      <h3 className="mt-3 font-headline-lg text-[clamp(2.25rem,4vw,4.5rem)] uppercase leading-none tracking-tight text-white">
                        Mexico <span className="text-primary">2</span> - <span className="text-primary">1</span> USA
                      </h3>
                      <p className="mt-4 max-w-lg font-body-lg text-body-lg text-white/80">
                        The live angle follows the pressure wave at Estadio Azteca with a focused feed, crowd atmosphere, and a clean score overlay built for the streaming-first match center.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <motion.button
                        whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        className="inline-flex items-center gap-3 rounded-lg bg-primary px-6 py-4 font-body-lg text-body-lg font-bold uppercase tracking-widest text-background shadow-[0_0_30px_rgba(0,216,255,0.35)] transition-colors hover:bg-white"
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                        Watch live
                      </motion.button>
                      <button className="glass-panel rounded-lg border border-white/15 px-6 py-4 font-body-lg text-body-lg font-bold uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary">
                        Tactical view
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col gap-4 p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Live window</p>
                      <h3 className="mt-1 font-headline-md text-headline-md text-white">Tonight&apos;s streams</h3>
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary">
                      4 feeds
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    {liveStreams.map((stream) => (
                      <motion.div
                        key={stream.title}
                        variants={itemVariants}
                        whileHover={reduceMotion ? undefined : { x: 4 }}
                        className="glass-panel group relative overflow-hidden rounded-xl border border-white/10 px-4 py-4"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${stream.accent}`} />
                        <div className="relative flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-1 font-label-caps text-[10px] uppercase tracking-[0.18em] ${stream.label === 'LIVE' ? 'bg-primary/15 text-primary' : 'bg-white/5 text-white/70'}`}>
                                {stream.label}
                              </span>
                              <span className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/40">
                                Premium broadcast
                              </span>
                            </div>
                            <h4 className="mt-3 truncate font-body-lg text-body-lg font-bold text-white">{stream.title}</h4>
                            <p className="mt-1 text-sm text-on-surface-variant">{stream.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-primary">{stream.status}</p>
                            <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/60">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              Adaptive stream
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="glass-panel rounded-xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/50">Up next</p>
                        <p className="mt-1 font-body-lg text-body-lg font-semibold text-white">England vs USA pre-match show</p>
                      </div>
                      <span className="font-stats-num text-stats-num text-primary">21:30</span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={false}
                        animate={{ width: '68%' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside variants={itemVariants} className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Telemetry</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">Match control</h3>
                </div>
                <span className="material-symbols-outlined text-primary">bar_chart</span>
              </div>

              <div className="mt-5 space-y-5">
                {telemetry.map((entry) => (
                  <motion.div
                    key={entry.label}
                    variants={itemVariants}
                    className="rounded-xl bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/60">{entry.label}</span>
                      <span className="font-body-md text-sm text-primary">{entry.value}</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div className="text-left">
                        <div className="font-stats-num text-stats-num text-white">{entry.home}</div>
                        <div className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Home</div>
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="text-right">
                        <div className="font-stats-num text-stats-num text-primary">{entry.away}</div>
                        <div className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Away</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Schedule rail</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">Today&apos;s fixtures</h3>
                </div>
                <span className="material-symbols-outlined text-primary">schedule</span>
              </div>

              <div className="mt-5 space-y-4">
                {scheduleRail.map((item, index) => (
                  <div key={`${item.match}-${index}`} className="flex items-start gap-4 rounded-xl bg-white/5 p-4">
                    <div className="min-w-[72px]">
                      <div className={`font-stats-num text-stats-num ${item.live ? 'text-primary' : 'text-white'}`}>{item.time}</div>
                      <div className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">{item.live ? 'Live' : 'Scheduled'}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${item.live ? 'bg-primary shadow-[0_0_0_6px_rgba(0,216,255,0.12)]' : 'bg-white/30'}`} />
                        <p className="font-body-lg text-body-lg font-semibold text-white">{item.match}</p>
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">{item.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Fan pulse</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">Global momentum</h3>
                </div>
                <span className="material-symbols-outlined text-primary">public</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <div className="font-stats-num text-stats-num text-primary">12.8M</div>
                  <div className="mt-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Live viewers</div>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <div className="font-stats-num text-stats-num text-white">96%</div>
                  <div className="mt-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Stream health</div>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}

export default PremiumStreamingHubSection;