import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "latin-ext"] });
const sans = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin", "latin-ext"] });
const serif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin", "latin-ext"], weight: "400", style: "italic" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://samedcimen.github.io"),
  title: "Samed Çimen — Web Geliştirici",
  description:
    "Kendi kendini yetiştirmiş web geliştirici. Next.js, React ve TypeScript ile fikirden yayına uçtan uca ürünler: ppbüyüt, İzleoloji ve daha fazlası.",
  authors: [{ name: "Samed Çimen", url: "https://github.com/samedcimen" }],
  openGraph: {
    title: "Samed Çimen — Web Geliştirici",
    description: "Fikirleri ışık hızında çalışan web deneyimlerine dönüştürüyorum.",
    url: "https://samedcimen.github.io",
    siteName: "Samed Çimen",
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
