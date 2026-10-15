import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Ícones e prévia de link são gerados no build com a mesma Sora do site.
// O ImageResponse não lê woff2 (formato do next/font), por isso a fonte vem do @fontsource.
export async function loadSoraBold() {
  return readFile(
    join(process.cwd(), "node_modules/@fontsource/sora/files/sora-latin-700-normal.woff")
  );
}

export async function soraFonts() {
  return [{ name: "Sora", data: await loadSoraBold(), weight: 700 as const, style: "normal" as const }];
}

export function Monogram({ size, rounded = true }: { size: number; rounded?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: rounded ? size * 0.22 : 0,
        backgroundImage: "linear-gradient(135deg, #1d9bf0, #2dd4bf)",
        color: "#ffffff",
        fontFamily: "Sora",
        fontWeight: 700,
        fontSize: size * 0.44,
        letterSpacing: "-0.04em"
      }}
    >
      EH
    </div>
  );
}
