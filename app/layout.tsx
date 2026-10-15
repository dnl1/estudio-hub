import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const titleFont = Sora({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["400", "500", "600", "700"]
});

const textFont = Manrope({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["400", "500", "600", "700"]
});

const siteTitle = "EstudioHub | Ecossistema de Gestão para Estúdios";
const siteDescription =
  "Plataforma completa para agenda, comandas, estoque, relatórios e gestão administrativa de estúdios de ensaio e salas de música.";

// As imagens são geradas no build por app/og-image.png, app/icon-64.png e app/apple-touch-icon.png.
// Os endereços terminam em .png para a hospedagem servir com o tipo certo (image/png).
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "EstudioHub: gestão completa para estúdios",
  type: "image/png"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://estudio-hub.com"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [{ url: "/icon-64.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "EstudioHub",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${titleFont.variable} ${textFont.variable}`}>
        <div className="ambient-bg" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
