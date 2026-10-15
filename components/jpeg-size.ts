// Lê largura e altura do cabeçalho do JPEG (marcador SOF), no build.
// Arquivo fora do padrão para o build com o nome do arquivo e o motivo.
export function jpegSize(file: Buffer, name: string) {
  const fail = (reason: string) => new Error(`${name}: ${reason}`);
  if (file[0] !== 0xff || file[1] !== 0xd8) throw fail("não é um JPEG");
  let offset = 2;
  while (offset < file.length) {
    if (file[offset] !== 0xff) throw fail(`marcador inválido na posição ${offset}`);
    const marker = file[offset + 1];
    if (marker === 0xff) {
      offset += 1; // byte de preenchimento antes do marcador
      continue;
    }
    // Depois do SOS vêm os dados da imagem: o tamanho tinha que ter aparecido antes
    if (marker === 0xda || marker === 0xd9) break;
    if (offset + 4 > file.length) throw fail(`segmento cortado na posição ${offset}`);
    const length = file.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > file.length) throw fail(`segmento cortado na posição ${offset}`);
    // SOF0 a SOF15; C4, C8 e CC usam a mesma faixa, mas são outros marcadores
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (length < 7) throw fail(`segmento cortado na posição ${offset}`);
      const size = { height: file.readUInt16BE(offset + 5), width: file.readUInt16BE(offset + 7) };
      if (!size.width || !size.height) throw fail("tamanho zerado");
      return size;
    }
    offset += 2 + length;
  }
  throw fail("sem o tamanho da imagem");
}
