import { ImageResponse } from "next/og";
import { Monogram, soraFonts } from "@/components/brand-image";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<Monogram size={64} />, {
    width: 64,
    height: 64,
    fonts: await soraFonts()
  });
}
