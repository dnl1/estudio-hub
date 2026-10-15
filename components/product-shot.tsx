import Image from "next/image";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { jpegSize } from "@/components/jpeg-size";
import type { ProductShotImage } from "@/components/site-content";

// As capturas são feitas em 2x: o tamanho de exibição é metade do arquivo.
export function ProductShot({ src, alt, crop = false, narrow = false }: ProductShotImage) {
  const { width, height } = jpegSize(readFileSync(join(process.cwd(), "public", src)), src);
  return (
    <figure className={`shot${crop ? " shot--recorte" : ""}${narrow ? " shot--estreita" : ""}`}>
      <div className="shot__viewport">
        <Image src={src} alt={alt} width={width / 2} height={height / 2} sizes="(min-width: 900px) 640px, 100vw" />
      </div>
    </figure>
  );
}
