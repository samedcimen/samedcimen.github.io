"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef } from "react";
import { marquee, skills } from "@/lib/data";
import { scrollState } from "@/lib/scroll-state";
import { useExperience } from "./Experience";
import { RevealLines, SectionLabel, TiltCard, ease } from "./ui";

/** Kaydırma hızıyla hızlanıp yön değiştiren sonsuz şerit. */
function Marquee({ items, dir = 1, outline }: { items: string[]; dir?: 1 | -1; outline?: boolean }) {
  const { reduced } = useExperience();
  const x = useMotionValue(0);
  const track = useRef<HTMLDivElement>(null);
  const dirRef = useRef(dir);

  useAnimationFrame((_, delta) => {
    if (reduced || !track.current) return;
    const v = scrollState.velocity;
    if (v !== 0) dirRef.current = (v > 0 ? dir : -dir) as 1 | -1;
    const half = track.current.scrollWidth / 2;
    let next = x.get() - dirRef.current * (delta / 1000) * (60 + Math.abs(v) * 25);
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  const row = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap py-2">
      <motion.div ref={track} style={{ x }} className="inline-flex">
        {row.map((t, i) => (
          <span
            key={i}
            className={`mx-6 inline-flex items-center gap-12 font-display text-6xl font-bold uppercase tracking-tight md:text-[9vw] ${
              outline ? "text-outline" : "text-bone"
            }`}
          >
            {t}
            <span className="inline-block size-3 rotate-45 bg-ember md:size-5" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="yetenekler" className="relative py-32 md:py-48">
      <div className="px-5 md:px-10">
        <SectionLabel index="02">Yetenekler</SectionLabel>
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
          <RevealLines
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em] text-bone md:col-span-8 md:text-[7.5vw]"
            lines={["Araç", <span key="k" className="text-ember">kutum.</span>]}
          />
          <motion.p
            className="max-w-sm text-lg leading-snug text-bone/70 md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          >
            Hepsi gerçek projelerde, gerçek kullanıcılar için kullanıldı. Teoride değil, üretimde öğrenildi.
          </motion.p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1, ease, delay: (i % 3) * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="glass spotlight relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-ember">{s.code}</span>
                    <span className="h-px flex-1 mx-4 bg-line" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{s.items.length} araç</span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-bold tracking-tight text-bone [transform:translateZ(40px)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/60">{s.blurb}</p>
                  <ul className="mt-8 flex flex-wrap gap-2 [transform:translateZ(25px)]">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-line bg-white/[0.02] px-3.5 py-1.5 text-sm text-bone/85 transition-colors duration-300 hover:border-ember hover:text-ember"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-32 -rotate-2 md:mt-48" aria-hidden>
        <Marquee items={marquee} />
        <Marquee items={[...marquee].reverse()} dir={-1} outline />
      </div>
    </section>
  );
}
