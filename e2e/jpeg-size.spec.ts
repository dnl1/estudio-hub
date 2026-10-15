import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { jpegSize } from "../components/jpeg-size";

const segment = (marker: number, payload: number[]) => [0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 0xff, ...payload];
const sof = (marker: number, width: number, height: number) =>
  segment(marker, [8, height >> 8, height & 0xff, width >> 8, width & 0xff, 1, 1, 0x11, 0]);
const app0 = segment(0xe0, [0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]);
const sos = segment(0xda, [1, 1, 0, 0, 0x3f, 0]);
const jpeg = (...parts: number[][]) => Buffer.from([0xff, 0xd8, ...parts.flat()]);

test("lê o tamanho de um JPEG comum", () => {
  expect(jpegSize(jpeg(app0, sof(0xc0, 2060, 1100), sos), "comum.jpg")).toEqual({ width: 2060, height: 1100 });
});

test("lê o tamanho de um JPEG progressivo", () => {
  expect(jpegSize(jpeg(app0, sof(0xc2, 1000, 700), sos), "progressivo.jpg")).toEqual({ width: 1000, height: 700 });
});

test("lê o tamanho das três capturas do site", () => {
  for (const [name, width] of [["agenda-bandas.jpg", 2060], ["comanda.jpg", 2316], ["recebimento.jpg", 1000]] as const) {
    const size = jpegSize(readFileSync(join(process.cwd(), "public/produto", name)), name);
    expect(size.width).toBe(width);
    expect(size.height).toBeGreaterThan(0);
  }
});

test("pula bytes de preenchimento antes de um marcador", () => {
  expect(jpegSize(jpeg(app0, [0xff], sof(0xc0, 640, 480), sos), "preenchimento.jpg")).toEqual({ width: 640, height: 480 });
});

test("recusa arquivo que não é JPEG", () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  expect(() => jpegSize(png, "foto.png")).toThrow("foto.png: não é um JPEG");
});

test("recusa JPEG cortado no meio de um segmento", () => {
  expect(() => jpegSize(jpeg(app0).subarray(0, 10), "cortado.jpg")).toThrow("cortado.jpg: segmento cortado");
  expect(() => jpegSize(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]), "curto.jpg")).toThrow("curto.jpg: segmento cortado");
});

test("recusa byte que não começa um marcador", () => {
  expect(() => jpegSize(jpeg(app0, [0x00], sof(0xc0, 640, 480)), "solto.jpg")).toThrow("solto.jpg: marcador inválido");
});

test("recusa JPEG sem tamanho antes dos dados da imagem", () => {
  expect(() => jpegSize(jpeg(app0, sos, [0x12, 0x34, 0xff, 0x00, 0x56]), "sem-tamanho.jpg")).toThrow(
    "sem-tamanho.jpg: sem o tamanho da imagem"
  );
});

test("recusa tamanho zerado", () => {
  expect(() => jpegSize(jpeg(app0, sof(0xc0, 640, 0), sos), "zerado.jpg")).toThrow("zerado.jpg: tamanho zerado");
});
