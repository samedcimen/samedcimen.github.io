"use client";

import { motion } from "motion/react";
import { links, profile } from "@/lib/data";
import { scrollToTarget } from "./Experience";
import { Magnetic, RevealLines, SectionLabel, ease } from "./ui";

export default function Contact() {
  return (
    <section id="iletisim" className="relative flex min-h-svh flex-col px-5 pt-32 md:px-10 md:pt-48">
      <SectionLabel index="03">İletişim</SectionLabel>

      <RevealLines
        className="font-display text-[14vw] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-bone md:text-[10vw]"
        lines={[
          "Bir fikrin mi var?",
          <>
            <span className="text-outline">Hadi</span> <span className="text-ember">üretelim.</span>
          </>,
        ]}
      />

      {/* "SÇ" parçacık imzası bu boşlukta belirir */}
      <div id="imza" className="h-[34vh] md:h-[46vh]" aria-hidden />

      <div className="grid gap-12 md:grid-cols-12 md:items-end">
        <motion.div
          className="md:col-span-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        >
          <Magnetic strength={0.4} className="inline-block">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="Merhaba!"
              className="group relative grid size-44 place-items-center overflow-hidden rounded-full bg-ember text-center font-display text-sm font-bold uppercase tracking-wide text-ink md:size-56 md:text-base"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-bone transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
              <span className="relative">
                GitHub&apos;da
                <br />
                bana ulaş
              </span>
            </a>
          </Magnetic>
        </motion.div>

        <ul className="md:col-span-7">
          {links.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
            >
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="Aç"
                className="group relative flex items-center justify-between overflow-hidden border-t border-line py-6 last:border-b md:py-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <span className="relative font-display text-3xl font-bold tracking-tight text-bone transition-all duration-500 group-hover:translate-x-4 group-hover:text-ink md:text-5xl">
                  {l.label}
                </span>
                <span className="relative flex items-center gap-4 font-mono text-xs tracking-[0.1em] text-mute transition-all duration-500 group-hover:-translate-x-4 group-hover:text-ink">
                  <span className="hidden sm:inline">{l.value}</span>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="transition-transform duration-500 group-hover:rotate-45" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      <footer className="mt-auto flex flex-col gap-4 py-8 pt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-mute md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Next.js & Three.js ile elle kodlandı</span>
        <button
          onClick={() => scrollToTarget(0, 2.2)}
          className="group flex items-center gap-2 text-bone"
          data-cursor="Yukarı"
        >
          Başa dön
          <span className="transition-transform duration-500 group-hover:-translate-y-1">↑</span>
        </button>
      </footer>
    </section>
  );
}
