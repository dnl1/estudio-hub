import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const brandColors = {
  papel: "#ffffff",
  tinta: "#1f2125",
  azul: "#3366ff",
  ambar: "#f5b700"
};

// Ícones e prévia de link usam a Archivo Narrow, irmã condensada da Archivo do site.
// O ImageResponse não lê woff2 nem fonte variável, por isso a fonte vem do @fontsource (woff).
export async function brandFonts() {
  const data = await readFile(
    join(process.cwd(), "node_modules/@fontsource/archivo-narrow/files/archivo-narrow-latin-700-normal.woff")
  );
  return [{ name: "Archivo Narrow", data, weight: 700 as const, style: "normal" as const }];
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
        backgroundColor: brandColors.azul,
        color: brandColors.papel,
        fontFamily: "Archivo Narrow",
        fontWeight: 700,
        fontSize: size * 0.5,
        letterSpacing: "-0.02em"
      }}
    >
      EH
    </div>
  );
}
