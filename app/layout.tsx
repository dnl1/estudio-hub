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

export const metadata: Metadata = {
  title: "EstudioHub | Ecossistema de Gestão para Estúdios",
  description:
    "Plataforma completa para agenda, comandas, estoque, relatórios e gestão administrativa de estúdios de ensaio e salas de música."
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
