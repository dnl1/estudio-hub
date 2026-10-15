import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap"
});

const siteTitle = "EstudioHub | Agenda, comandas e pagamentos para estúdios";
const siteDescription =
  "Sistema para estúdios de ensaio, gravação e escolas de música: agenda das salas sem conflito, comandas de consumo e pagamentos num lugar só. Teste grátis por 14 dias.";

// As imagens são geradas no build por app/og-image.png, app/icon-64.png e app/apple-touch-icon.png.
// Os endereços terminam em .png para a hospedagem servir com o tipo certo (image/png).
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "EstudioHub: agenda, comandas e pagamentos para estúdios",
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
    <html lang="pt-BR" className={archivo.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
