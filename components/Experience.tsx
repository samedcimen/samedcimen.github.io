"use client";

import dynamic from "next/dynamic";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { scrollState, sectionIds } from "@/lib/scroll-state";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Env = { mobile: boolean; webgl: boolean; reduced: boolean };
type Ctx = { ready: boolean; reduced: boolean };
const ExperienceContext = createContext<Ctx>({ ready: false, reduced: false });
export const useExperience = () => useContext(ExperienceContext);

/** Lenis varsa onunla, yoksa yerel olarak yumuşak kaydırır. */
export function scrollToTarget(target: string | number, duration = 1.8) {
  const el = typeof target === "string" ? document.getElementById(target) : null;
  if (typeof target === "string" && !el) return;
  const l = scrollState.lenis;
  if (l) l.scrollTo(el ?? (target as number), { duration });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: target as number, behavior: "smooth" });
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Ortam bir kez ölçülür; sunucuda null döner ki hidrasyon uyuşsun.
let cachedEnv: Env | null = null;
const getEnv = () =>
  (cachedEnv ??= {
    mobile: window.matchMedia("(max-width: 768px), (pointer: coarse)").matches,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl: hasWebGL(),
  });
const noopSubscribe = () => () => {};

export default function Experience({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const env = useSyncExternalStore(noopSubscribe, getEnv, () => null);

  // Yumuşak kaydırma + bölümlere göre şekil değişimi
  useEffect(() => {
    if (!env) return;
    const l = env.reduced ? null : new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
    scrollState.lenis = l;
    if (!scrollState.revealed) l?.stop();

    let centers: number[] = [];
    const measure = () => {
      centers = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return top + el.offsetHeight / 2 - window.innerHeight / 2;
      });
      centers[0] = 0;
    };
    const update = () => {
      const y = window.scrollY;
      let m = 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (y >= centers[i]) m = i + Math.min(1, (y - centers[i]) / Math.max(1, centers[i + 1] - centers[i]));
      }
      scrollState.morph = Math.max(0, Math.min(centers.length - 1, m));
      scrollState.velocity = l?.velocity ?? 0;
      const sig = document.getElementById("imza");
      if (sig) {
        const r = sig.getBoundingClientRect();
        scrollState.signatureY = 1 - ((r.top + r.height / 2) / window.innerHeight) * 2;
      }
    };
    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    l?.on("scroll", update);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return onLeave();
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => {
      scrollState.mouseX = 9;
      scrollState.mouseY = 9;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      l?.destroy();
      scrollState.lenis = null;
    };
  }, [env]);

  return (
    <ExperienceContext.Provider value={{ ready, reduced: env?.reduced ?? false }}>
      <div className="fixed inset-0 -z-10 bg-ink" aria-hidden>
        <div className="aurora absolute inset-0" />
        {env?.webgl && <Scene mobile={env.mobile} />}
        <div className="vignette absolute inset-0" />
      </div>
      <div className="grain" aria-hidden />
      <Preloader
        onDone={() => {
          scrollState.revealed = true;
          scrollState.lenis?.start();
          setReady(true);
        }}
      />
      {env && !env.mobile && <Cursor />}
      {children}
    </ExperienceContext.Provider>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);
  const done = useRef(onDone);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");
    const start = performance.now();
    const dur = 1700;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          document.documentElement.classList.remove("is-loading");
          done.current();
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between font-mono text-xs uppercase tracking-[0.25em] text-mute">
            <span>Samed Çimen</span>
            <span>Portfolyo — 2026</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-mute">
              Parçacıklar hizalanıyor
              <br />
              Evren derleniyor…
            </p>
            <span className="font-display text-[22vw] font-bold leading-[0.8] tracking-tighter text-bone md:text-[16vw]">
              {String(n).padStart(3, "0")}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-px bg-ember" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? null);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("has-cursor");
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference" aria-hidden>
        <div className="-ml-[3px] -mt-[3px] size-1.5 rounded-full bg-white" />
      </div>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden>
        <div
          className="flex items-center justify-center rounded-full border border-bone/40 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-[width,height,margin,background-color,border-color] duration-300 ease-out"
          style={{
            width: label ? 96 : hover ? 56 : 32,
            height: label ? 96 : hover ? 56 : 32,
            marginLeft: label ? -48 : hover ? -28 : -16,
            marginTop: label ? -48 : hover ? -28 : -16,
            backgroundColor: label ? "var(--color-ember)" : hover ? "rgb(255 106 43 / 0.12)" : "transparent",
            borderColor: hover ? "var(--color-ember)" : undefined,
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
}
