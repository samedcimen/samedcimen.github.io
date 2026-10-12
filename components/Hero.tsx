"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { nav, profile } from "@/lib/data";
import { scrollToTarget, useExperience } from "./Experience";
import { Magnetic, ease } from "./ui";

function Letters({ word, play, delay }: { word: string; play: boolean; delay: number }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.06em]" aria-hidden>
      {[...word].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "115%", rotateX: -80, opacity: 0 }}
          animate={play ? { y: "0%", rotateX: 0, opacity: 1 } : undefined}
          transition={{ duration: 1.4, ease, delay: delay + i * 0.06 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { ready } = useExperience();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -160]);
  const fade = useTransform(scrollY, [0, 600], [1, 0]);

  const go = (id: string) => scrollToTarget(id);

  return (
    <section id="hero" className="relative flex min-h-svh flex-col px-5 pb-8 pt-5 md:px-10 md:pb-10 md:pt-8">
      {/* Üst bar */}
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10 md:py-7"
        initial={{ opacity: 0, y: -20 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, ease, delay: 0.6 }}
      >
        <button onClick={() => go("hero")} className="font-display text-lg font-bold tracking-tight text-white" data-cursor="Başa">
          SÇ<span className="text-ember">.</span>
        </button>
        <nav className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white md:gap-10">
          {nav.map((n, i) => (
            <button key={n.id} onClick={() => go(n.id)} className="group relative hidden sm:block">
              <span className="mr-1.5 text-white/40">0{i + 1}</span>
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </button>
          ))}
          <button onClick={() => go("iletisim")} className="sm:hidden">
            İletişim
          </button>
        </nav>
      </motion.header>

      <motion.div style={{ y, opacity: fade }} className="relative flex flex-1 flex-col justify-end pt-24">
        <motion.div
          className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute md:mb-10"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-ember" />
          </span>
          Yeni fikirlere açık — 2026
        </motion.div>

        <h1 className="font-display font-bold uppercase leading-[0.82] tracking-[-0.04em] text-bone [perspective:800px]">
          <span className="sr-only">{profile.name}</span>
          <span className="block text-[19vw] md:text-[13.5vw]">
            <Letters word={profile.first} play={ready} delay={0.1} />
          </span>
          <span className="block text-[19vw] md:pl-[8vw] md:text-[13.5vw]">
            <Letters word={profile.last} play={ready} delay={0.35} />
            <motion.span
              className="text-ember"
              initial={{ opacity: 0, scale: 0 }}
              animate={ready ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.8, ease, delay: 1.1 }}
              aria-hidden
            >
              .
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.p
            className="max-w-md text-lg leading-snug text-bone/80 md:col-span-5 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.2, ease, delay: 1 }}
          >
            {profile.role}. Fikirleri <em className="font-serif-i text-ember">ışık hızında</em> çalışan, akılda kalan web
            deneyimlerine dönüştürüyorum.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 md:col-span-7 md:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.2, ease, delay: 1.2 }}
          >
            <Magnetic>
              <button
                onClick={() => go("hakkimda")}
                className="group flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-bone"
                data-cursor="Kaydır"
              >
                <span className="relative flex h-14 w-8 justify-center rounded-full border border-bone/30">
                  <span className="mt-2 h-2 w-px animate-[scrollhint_1.8s_ease-in-out_infinite] bg-ember" />
                </span>
                Keşfetmek için kaydır
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
