"use client";

import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;

/** "01 — Hakkımda" gibi bölüm etiketi. */
export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-mute md:mb-16"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease }}
    >
      <span className="text-ember">{index}</span>
      <span className="h-px w-12 bg-line" />
      <span>{children}</span>
    </motion.div>
  );
}

/** Satırları maskenin altından yukarı kaydırarak gösterir. */
export function RevealLines({
  lines,
  className,
  delay = 0,
  play,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  /** Verilirse görünürlük yerine bu bayrağa göre oynar. */
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const on = play ?? inView;
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%", rotate: 4 }}
            animate={on ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.2, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/** Kaydırdıkça kelime kelime aydınlanan paragraf. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** Görününce sıfırdan sayan rakam. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1800);
      setV(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

/** İmlece doğru çekilen buton/bağlantı sarmalayıcısı. */
export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Fareyle 3B eğilen, imleci takip eden ışık lekeli kart. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 16 });
  const ry = useSpring(0, { stiffness: 150, damping: 16 });
  return (
    <motion.div
      ref={ref}
      className={`group relative [transform-style:preserve-3d] ${className ?? ""}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 14);
        rx.set(-(py - 0.5) * 14);
        ref.current!.style.setProperty("--mx", `${px * 100}%`);
        ref.current!.style.setProperty("--my", `${py * 100}%`);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
