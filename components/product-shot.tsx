import Image from "next/image";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ProductShotImage } from "@/components/site-content";

// Lê largura e altura do cabeçalho do JPEG (marcador SOF), no build.
function jpegSize(src: string) {
  const file = readFileSync(join(process.cwd(), "public", src));
  let offset = 2;
  while (offset < file.length) {
    const marker = file[offset + 1];
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: file.readUInt16BE(offset + 5), width: file.readUInt16BE(offset + 7) };
    }
    offset += 2 + file.readUInt16BE(offset + 2);
  }
  throw new Error(`Não achei o tamanho de ${src}`);
}

// As capturas são feitas em 2x: o tamanho de exibição é metade do arquivo.
export function ProductShot({ src, alt, crop = false, narrow = false }: ProductShotImage) {
  const { width, height } = jpegSize(src);
  return (
    <figure className={`shot${crop ? " shot--recorte" : ""}${narrow ? " shot--estreita" : ""}`}>
      <div className="shot__viewport">
        <Image src={src} alt={alt} width={width / 2} height={height / 2} sizes="(min-width: 900px) 640px, 100vw" />
      </div>
    </figure>
  );
}
