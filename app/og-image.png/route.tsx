import { ImageResponse } from "next/og";
import { Monogram, brandColors, brandFonts } from "@/components/brand-image";

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
          backgroundColor: brandColors.tinta,
          color: brandColors.papel,
          fontFamily: "Archivo Narrow"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Monogram size={84} />
          <div style={{ fontSize: 48, fontWeight: 700 }}>EstudioHub</div>
        </div>
        <div style={{ display: "flex", maxWidth: 1000, fontSize: 72, fontWeight: 700, lineHeight: 1.04 }}>
          A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: brandColors.ambar }}>14 dias grátis</span>
          <span style={{ color: "rgba(255, 255, 255, 0.72)" }}>estudio-hub.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await brandFonts() }
  );
}
