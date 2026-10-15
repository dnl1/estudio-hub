import { ImageResponse } from "next/og";
import { Monogram, brandFonts } from "@/components/brand-image";

export const dynamic = "force-static";

// Sem cantos arredondados: o iOS aplica a própria máscara e pinta de preto o que for transparente.
export async function GET() {
  return new ImageResponse(<Monogram size={180} rounded={false} />, {
    width: 180,
    height: 180,
    fonts: await brandFonts()
  });
}
