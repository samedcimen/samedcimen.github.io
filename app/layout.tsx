import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const grotesk = Space_Grotesk({ variable: "--f-grotesk", subsets: ["latin", "latin-ext"] });

// favicon.ico, icon.png, apple-icon.png ve opengraph-image.png app/ klasöründen otomatik eklenir.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "tr_TR",
    firstName: "Samed",
    lastName: "Çimen",
    username: "samedcimen",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitter,
    site: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${grotesk.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
