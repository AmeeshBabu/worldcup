import { motion, useReducedMotion } from 'framer-motion';

type ReplayAsset = {
  minute: string;
  title: string;
  description: string;
  stamp: string;
  accent: string;
};

type ViewingMode = {
  name: string;
  detail: string;
  badge: string;
};

const replayAssets: ReplayAsset[] = [
  {
    minute: '12:44',
    title: 'Mexico transition through the right channel',
    description: 'High-tempo move ending in a near-post save from the USA goalkeeper.',
    stamp: 'Key chance',
    accent: 'from-cyan-400/20 via-cyan-400/10 to-transparent',
  },
  {
    minute: '38:10',
    title: 'England counterpress sequence in New York',
    description: 'Two-line recovery triggers an immediate shot from the edge of the box.',
    stamp: 'Tactical replay',
    accent: 'from-white/10 via-white/5 to-transparent',
  },
  {
    minute: '55:27',
    title: 'Argentina cutback lane opens at AT&T Stadium',
    description: 'Full-width overload creates a clean tap-in chance from the penalty spot.',
    stamp: 'Fan favorite',
    accent: 'from-emerald-400/15 via-cyan-400/5 to-transparent',
  },
];

const viewingModes: ViewingMode[] = [
  {
    name: 'Live Broadcast',
    detail: 'Primary stadium feed with score overlays, clock, and atmospheric crowd audio.',
    badge: '4K HDR',
  },
  {
    name: 'Tactical Camera',
    detail: 'Wide-angle sequence view for shape, pressing triggers, and positional spacing.',
    badge: 'Coach mode',
  },
  {
    name: 'Storyline Clips',
    detail: 'Curated replay markers with the decisive moments already surfaced for you.',
    badge: 'Instant rewind',
  },
];

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function ReplayVaultSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-40 w-full border-t border-white/5 bg-background px-container-padding-mobile py-section-gap md:px-container-padding-desktop">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          variants={panelVariants}
          className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]"
        >
          <motion.div variants={cardVariants} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="font-label-caps text-label-caps uppercase tracking-[0.24em] text-primary">
                  On-demand replay vault
                </p>
                <h2 className="mt-3 font-headline-lg text-headline-lg uppercase tracking-tight text-white">
                  Instant <span className="text-primary">Replays</span> &amp; Viewing Modes
                </h2>
                <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                  Jump straight to the decisive moments, switch camera angles, and keep the premium broadcast language consistent with the rest of the platform. This section is built for high-value rewatch sessions, not generic highlights.
                </p>
              </div>

              <div className="glass-panel glow-cyan rounded-full px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">replay</span>
                  </span>
                  <div>
                    <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/50">Updated live</p>
                    <p className="font-body-md text-sm text-white">Every key clip indexed within seconds</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div variants={cardVariants} className="glass-panel relative overflow-hidden rounded-2xl border border-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,216,255,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(156,246,171,0.08),transparent_38%)]" />
              <div className="relative grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7tBnf-JiJ2PuNFN9_klZqekKG8xwBR2I4MpZb1ZyJC4DaSTwfZfjQ1b4-HiCk59CwICjaDNf4OEQTvSSk7l3jXke9fd2TEsRVAE7OKIFLVblN3Mninp70S2IOO5qRqdRvCqYyAgYDfHWnEX3F3ZNa0YfhI1DMeujKXVIZeJSGNRFHlE6BI4bzbpuU7I9MXuVaMkgJzZWghH6Po5FOv1v5uC31ASHKYDY_Jq1PdLUoTcQ3zfy42xjMMeouRJAqqK0YA671e5Yh9no')] bg-cover bg-center opacity-90 mix-blend-luminosity transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute inset-0 tech-grid opacity-40" />

                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-black/70 px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary">
                        Goal replay
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/70">
                        4 camera angles
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="font-label-caps text-[10px] uppercase tracking-[0.28em] text-white/60">
                        Match vault
                      </p>
                      <h3 className="mt-3 font-headline-lg text-[clamp(2rem,3.8vw,4.25rem)] uppercase leading-none tracking-tight text-white">
                        Mexico&apos;s decisive press sequence
                      </h3>
                      <p className="mt-3 max-w-lg font-body-lg text-body-lg text-white/80">
                        Review the live turning point from the match center with a crisp, cinematic replay surface and motion-safe interactions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Replay queue</p>
                      <h3 className="mt-1 font-headline-md text-headline-md text-white">Key moments</h3>
                    </div>
                    <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/50">65 mins indexed</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {replayAssets.map((asset, index) => (
                      <motion.div
                        key={asset.minute}
                        variants={cardVariants}
                        whileHover={reduceMotion ? undefined : { x: 4 }}
                        className="glass-panel relative overflow-hidden rounded-xl border border-white/10 p-4"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${asset.accent}`} />
                        <div className="relative flex items-start gap-4">
                          <div className="flex min-w-[64px] flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-center">
                            <span className="font-stats-num text-stats-num text-primary">{index + 1}</span>
                            <span className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Clip</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary">{asset.minute}</span>
                              <span className="rounded-full bg-white/5 px-2 py-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/60">
                                {asset.stamp}
                              </span>
                            </div>
                            <h4 className="mt-2 font-body-lg text-body-lg font-semibold text-white">{asset.title}</h4>
                            <p className="mt-1 text-sm text-on-surface-variant">{asset.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside variants={cardVariants} className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Viewing modes</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">Broadcast controls</h3>
                </div>
                <span className="material-symbols-outlined text-primary">settings_input_component</span>
              </div>

              <div className="mt-5 space-y-4">
                {viewingModes.map((mode) => (
                  <motion.div
                    key={mode.name}
                    variants={cardVariants}
                    className="rounded-xl bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-body-lg text-body-lg font-semibold text-white">{mode.name}</h4>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-primary">
                        {mode.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{mode.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Session quality</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">Stream status</h3>
                </div>
                <span className="material-symbols-outlined text-primary">monitor_heart</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <div className="font-stats-num text-stats-num text-primary">99.8%</div>
                  <div className="mt-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Uptime</div>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <div className="font-stats-num text-stats-num text-white">4K</div>
                  <div className="mt-1 font-label-caps text-[10px] uppercase tracking-[0.18em] text-white/45">Max output</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary">Now buffering</span>
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-white/50">0.2s</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={false}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-primary">Fan takeaways</p>
                  <h3 className="mt-1 font-headline-md text-headline-md text-white">What to watch next</h3>
                </div>
                <span className="material-symbols-outlined text-primary">visibility</span>
              </div>
              <ul className="mt-5 space-y-3">
                <li className="rounded-xl bg-white/5 p-4 text-sm text-on-surface-variant">
                  The Mexico counter-press starts after the first recovery in midfield, where the line compresses and the wide runner opens the lane.
                </li>
                <li className="rounded-xl bg-white/5 p-4 text-sm text-on-surface-variant">
                  Switch to the tactical view to inspect how England&apos;s compact block forces the next attacking pattern toward the touchline.
                </li>
              </ul>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}

export default ReplayVaultSection;