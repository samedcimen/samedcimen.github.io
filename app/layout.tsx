import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({ variable: "--f-grotesk", subsets: ["latin", "latin-ext"] });

const description =
  "Kendi kendini yetiştirmiş full stack web geliştirici. Next.js, React ve TypeScript ile fikirden yayına uçtan uca ürünler: ppbüyüt, İzleoloji ve daha fazlası.";

export const metadata: Metadata = {
  metadataBase: new URL("https://samedcimen.github.io"),
  title: "Samed Çimen — Full Stack Developer",
  description,
  authors: [{ name: "Samed Çimen", url: "https://github.com/samedcimen" }],
  openGraph: {
    title: "Samed Çimen — Full Stack Developer",
    description,
    url: "https://samedcimen.github.io",
    siteName: "Samed Çimen",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/img/avatar.webp", width: 460, height: 460, alt: "Samed Çimen" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe14d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${grotesk.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
