import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sayfa bulunamadı", robots: { index: false } };

export default function NotFound() {
  return (
    <main
      className="grid min-h-screen place-items-center px-5 text-[#111]"
      style={{
        fontFamily: "var(--f-grotesk)",
        backgroundImage: "radial-gradient(#111 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        backgroundColor: "#f6f1e7",
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border-[2.5px] border-[#111] bg-[#ffe14d] p-10 text-center shadow-[10px_10px_0_#111]">
        <p className="text-[96px] font-bold leading-none tracking-[-0.05em]">404</p>
        <h1 className="mt-4 text-[26px] font-bold">Bu sayfa kaybolmuş gibi.</h1>
        <p className="mt-2 text-[17px] font-medium">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl border-[2.5px] border-[#111] bg-[#111] px-6 py-3 font-bold text-white shadow-[6px_6px_0_#111] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
