import { ImageResponse } from "next/og";
import { Monogram, soraFonts } from "@/components/brand-image";

export const dynamic = "force-static";

// Prévia de link (WhatsApp, redes sociais). Tamanho 1200x630, declarado em app/layout.tsx.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0b1220",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(29, 155, 240, 0.22), transparent 45%), radial-gradient(circle at 85% 15%, rgba(45, 212, 191, 0.18), transparent 42%)",
          fontFamily: "Sora",
          color: "#e7edf8"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Monogram size={84} />
          <div style={{ fontSize: 44, fontWeight: 700, color: "#f3f7ff" }}>EstudioHub</div>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}
        >
          Seu estúdio no controle: agenda, comandas, estoque e cobranças em um só lugar.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a2b0c7" }}>
          <span>Gestão completa para estúdios</span>
          <span>estudio-hub.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await soraFonts() }
  );
}
