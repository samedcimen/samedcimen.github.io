"use client";

import { motion } from "motion/react";
import { live, manifesto, stats } from "@/lib/data";
import { CountUp, RevealLines, ScrubText, SectionLabel, TiltCard, ease } from "./ui";

export default function About() {
  return (
    <section id="hakkimda" className="relative px-5 py-32 md:px-10 md:py-48">
      <SectionLabel index="01">Hakkımda</SectionLabel>

      <RevealLines
        className="mb-16 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em] text-bone md:mb-24 md:text-[7.5vw]"
        lines={[
          "Merakla başladı,",
          <>
            <span className="text-outline">tutkuyla</span> sürüyor.
          </>,
        ]}
      />

      <div className="grid gap-16 md:grid-cols-12">
        <ScrubText
          text={manifesto}
          className="text-2xl font-medium leading-[1.25] tracking-tight text-bone md:col-span-9 md:col-start-4 md:text-[2.9vw]"
        />
      </div>

      {/* İstatistikler */}
      <div className="mt-24 grid grid-cols-2 border-t border-line md:mt-40 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="border-b border-line py-8 pr-4 md:border-b-0 md:border-r md:px-6 md:py-10 md:last:border-r-0 md:first:pl-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease, delay: i * 0.1 }}
          >
            <div className="font-display text-5xl font-bold tracking-tight text-bone md:text-7xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Yayındaki ürünler */}
      <div className="mt-24 md:mt-40">
        <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
          <span>Şu an yayında</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> canlı
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {live.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.1, ease, delay: i * 0.12 }}
            >
              <TiltCard>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Ziyaret et"
                  className="glass spotlight relative block overflow-hidden rounded-3xl p-7 md:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember">{p.host}</div>
                      <h3 className="mt-4 font-display text-4xl font-bold tracking-tight text-bone md:text-6xl">{p.name}</h3>
                    </div>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-bone transition-all duration-500 group-hover:rotate-45 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </div>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70 md:text-lg">{p.desc}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
