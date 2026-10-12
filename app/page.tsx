import { live, manifesto, marquee, profile, skills, socials, stats } from "@/lib/data";
import { site } from "@/lib/site";

// Arama motorları için yapılandırılmış veri: kişi, web sitesi ve yayındaki ürünler
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      url: site.url,
      image: `${site.url}/img/avatar.webp`,
      email: `mailto:${site.email}`,
      jobTitle: "Full Stack Developer",
      description: site.description,
      knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Node.js", "Playwright"],
      sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "tr-TR",
      author: { "@id": `${site.url}/#person` },
    },
    ...live.map((p) => ({
      "@type": "WebApplication",
      name: p.name,
      url: p.url,
      description: p.desc,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      author: { "@id": `${site.url}/#person` },
    })),
  ],
};

// Kart, buton ve rozetlerde ortak kalın kenar + sert gölge
const box = "border-[2.5px] border-[#111] shadow-[6px_6px_0_#111]";
const press =
  "transition-[transform,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_#111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_#111]";

const skillColors = ["bg-[#ffe14d]", "bg-[#a99bff]", "bg-[#7ee0c3]", "bg-[#ff9f7a]", "bg-[#8fd3ff]", "bg-[#ffb3d9]"];
const socialColors: Record<string, string> = {
  GitHub: "bg-[#111] text-white",
  "E-posta": "bg-[#ff6b5b] text-[#111]",
  Instagram: "bg-[#ffb3d9] text-[#111]",
  X: "bg-[#8fd3ff] text-[#111]",
  Facebook: "bg-[#a99bff] text-[#111]",
  "Buy Me a Coffee": "bg-[#ffe14d] text-[#111]",
};
const productShots: Record<string, string> = {
  ppbüyüt: "/img/ppbuyut-desktop.webp",
  İzleoloji: "/img/izleoloji-desktop.webp",
};

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className={`inline-block -rotate-1 ${color} ${box} px-4 py-1.5 text-[28px] font-bold uppercase tracking-tight md:text-[40px]`}>{children}</h2>
  );
}

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-[#f6f1e7] text-[#111] selection:bg-[#ffe14d]`}
      style={{
        fontFamily: "var(--f-grotesk)",
        backgroundImage: "radial-gradient(#111 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        backgroundColor: "#f6f1e7",
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#hakkimda" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[#111] focus:px-4 focus:py-2 focus:text-white">
        İçeriğe geç
      </a>
      <style>{`
        @keyframes marquee{to{transform:translateX(-50%)}}
        @keyframes bob{0%,100%{transform:translateY(0) rotate(var(--r))}50%{transform:translateY(-6px) rotate(var(--r))}}
        .bob{animation:bob 4s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.bob,.marq{animation:none!important}}
      `}</style>

      {/* Gezinme */}
      <header className="sticky top-0 z-50 border-b-[2.5px] border-[#111] bg-[#f6f1e7]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#" className={`bg-[#ffe14d] ${box} !shadow-[3px_3px_0_#111] px-2.5 py-0.5 text-lg font-bold`}>
            SÇ
          </a>
          <nav className="flex items-center gap-1 text-[15px] font-semibold sm:gap-2">
            {[
              ["#hakkimda", "Hakkımda"],
              ["#urunler", "Ürünler"],
              ["#yetenekler", "Yetenekler"],
            ].map(([h, l]) => (
              <a key={h} href={h} className="hidden rounded-lg px-3 py-1.5 hover:bg-[#111] hover:text-white sm:block">
                {l}
              </a>
            ))}
            <a href="#iletisim" className={`ml-2 bg-[#a99bff] ${box} !shadow-[3px_3px_0_#111] px-4 py-1.5 ${press}`}>
              İletişim
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        {/* Giriş */}
        <section className="grid items-center gap-10 py-14 md:grid-cols-[1.35fr_1fr] md:py-20">
          <div className={`relative bg-[#ffe14d] ${box} !shadow-[10px_10px_0_#111] rounded-3xl p-8 md:p-12`}>
            <span
              className={`bob absolute -top-5 right-6 bg-[#7ee0c3] ${box} !shadow-[3px_3px_0_#111] rounded-full px-4 py-1.5 text-[14px] font-bold`}
              style={{ ["--r" as string]: "4deg" }}
            >
              ● Yeni projelere açık
            </span>
            <p className="text-[15px] font-bold uppercase tracking-[0.15em]">Full Stack Developer</p>
            <h1 className="mt-3 text-[64px] font-bold uppercase leading-[0.88] tracking-[-0.04em] md:text-[104px]">
              Samed
              <br />
              Çimen
            </h1>
            <p className="mt-6 max-w-md text-[18px] font-medium leading-snug">
              Kendi kendini yetiştirmiş web geliştirici. Next.js, React ve TypeScript ile fikirden yayına uçtan uca ürünler geliştiriyorum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={profile.github} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 bg-[#111] text-white ${box} rounded-xl px-5 py-3 font-bold ${press}`}>
                GitHub profilim <Arrow />
              </a>
              <a href="#urunler" className={`inline-flex items-center gap-2 bg-white ${box} rounded-xl px-5 py-3 font-bold ${press}`}>
                Ürünlerim
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-[78%] max-w-[380px] md:w-full">
            <div className={`rotate-2 overflow-hidden bg-[#a99bff] ${box} !shadow-[10px_10px_0_#111] rounded-3xl`}>
              <img src="/img/avatar.webp" alt="Samed Çimen" width={460} height={460} className="block w-full" />
            </div>
            <span
              className={`bob absolute -bottom-5 -left-5 bg-[#ff9f7a] ${box} !shadow-[4px_4px_0_#111] rounded-2xl px-4 py-2 text-center leading-tight`}
              style={{ ["--r" as string]: "-6deg" }}
            >
              <span className="block text-[30px] font-bold">15+</span>
              <span className="text-[13px] font-semibold">Next.js projesi</span>
            </span>
          </div>
        </section>
      </div>

      {/* Kayan teknoloji şeridi */}
      <div className="-rotate-1 overflow-hidden border-y-[2.5px] border-[#111] bg-[#111] py-3 text-white" lang="en" aria-hidden>
        <div className="marq flex w-max animate-[marquee_28s_linear_infinite]">
          {[...marquee, ...marquee].map((t, i) => (
            <span key={i} className="mx-5 flex items-center gap-10 text-[22px] font-bold uppercase">
              {t} <span className="text-[#ffe14d]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5">
        {/* Hakkımda */}
        <section id="hakkimda" className="scroll-mt-20 py-20 md:py-28">
          <SectionTitle color="bg-[#7ee0c3]">👋 Hakkımda</SectionTitle>
          <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div className={`bg-white ${box} rounded-3xl p-7 md:p-9`}>
              <p className="text-[19px] font-medium leading-relaxed md:text-[21px]">{manifesto}</p>
              <p className="mt-6 inline-block rounded-lg bg-[#ffe14d] px-2 py-1 text-[16px] font-bold">
                🚀 Sürekli öğrenen, üreten ve yayına alan bir geliştirici.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className={`${skillColors[(i + 1) % skillColors.length]} ${box} rounded-2xl p-5`}>
                  <div className="text-[40px] font-bold leading-none tracking-tight">
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mt-2 text-[14px] font-semibold leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ürünler */}
        <section id="urunler" className="scroll-mt-20 pb-20 md:pb-28">
          <SectionTitle color="bg-[#ff9f7a]">🛠️ Yayındaki ürünler</SectionTitle>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {live.map((p, i) => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className={`group flex flex-col overflow-hidden bg-white ${box} rounded-3xl ${press}`}>
                {/* Tarayıcı çerçevesi */}
                <div className={`flex items-center gap-2 border-b-[2.5px] border-[#111] px-4 py-2.5 ${i ? "bg-[#a99bff]" : "bg-[#ffe14d]"}`}>
                  <span className="size-3 rounded-full border-2 border-[#111] bg-[#ff6b5b]" />
                  <span className="size-3 rounded-full border-2 border-[#111] bg-[#ffe14d]" />
                  <span className="size-3 rounded-full border-2 border-[#111] bg-[#7ee0c3]" />
                  <span className="ml-2 flex-1 truncate rounded-md border-2 border-[#111] bg-white px-3 py-0.5 text-[13px] font-semibold">{p.host}</span>
                </div>
                <div className="overflow-hidden border-b-[2.5px] border-[#111]">
                  <img src={productShots[p.name]} alt={`${p.name} ekran görüntüsü`} width={2160} height={1350} loading="lazy" className="block w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[30px] font-bold tracking-tight">{p.name}</h3>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full bg-[#111] text-white transition-transform group-hover:rotate-45`}>
                      <Arrow />
                    </span>
                  </div>
                  <p className="mt-2 text-[16px] leading-relaxed text-[#333]">{p.desc}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border-2 border-[#111] px-3 py-0.5 text-[13px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Yetenekler */}
        <section id="yetenekler" className="scroll-mt-20 pb-20 md:pb-28">
          <SectionTitle color="bg-[#a99bff]">💻 Yetenekler</SectionTitle>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, i) => (
              <div key={s.code} className={`flex flex-col bg-white ${box} rounded-3xl`}>
                <div className={`flex items-center justify-between rounded-t-[21px] border-b-[2.5px] border-[#111] px-6 py-3 ${skillColors[i]}`}>
                  <h3 className="text-[20px] font-bold">{s.title}</h3>
                  <span className="text-[13px] font-bold">{s.code}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[15px] font-medium text-[#444]">{s.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <li key={it} className="rounded-lg border-2 border-[#111] bg-[#f6f1e7] px-2.5 py-1 text-[14px] font-semibold">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* İletişim */}
        <section id="iletisim" className="scroll-mt-20 pb-20">
          <div className={`bg-[#111] text-white ${box} !shadow-[10px_10px_0_#ffe14d] rounded-3xl p-8 md:p-14`}>
            <h2 className="text-[40px] font-bold uppercase leading-[0.95] tracking-tight md:text-[72px]">
              Bir fikrin mi var?
              <br />
              <span className="text-[#ffe14d]">Hadi konuşalım.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[18px] text-white/75">Projeleriniz için benimle aşağıdaki kanallardan iletişime geçebilirsiniz. ✨</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`flex items-center justify-between gap-3 rounded-2xl border-[2.5px] border-white px-5 py-4 shadow-[5px_5px_0_#fff] transition-[transform,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_#fff] ${
                    socialColors[s.label]
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-[18px] font-bold">{s.label}</span>
                    <span className="block truncate text-[13px] font-medium opacity-75">{s.value}</span>
                  </span>
                  <Arrow />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-[2.5px] border-[#111] bg-[#ffe14d]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-[14px] font-semibold sm:flex-row sm:justify-between">
          <span>© 2026 Samed Çimen. Tüm hakları saklıdır.</span>
          <a href="#" className="hover:underline">
            Başa dön ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
