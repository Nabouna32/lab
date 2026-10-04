type Block = { count: number; data: number; ec: number };
const RS_BLOCKS_M: Block[][] = [
  [{ count: 1, data: 16, ec: 10 }],
  [{ count: 1, data: 28, ec: 16 }],
  [{ count: 1, data: 44, ec: 26 }],
  [{ count: 2, data: 32, ec: 18 }],
  [{ count: 2, data: 43, ec: 24 }],
  [{ count: 4, data: 27, ec: 16 }],
];
const ALIGNMENT_POSITIONS = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
}

function gfMultiply(a: number, b: number): number {
  let result = 0;
  while (b) {
    if (b & 1) result ^= a;
    b >>>= 1;
    a = (a << 1) ^ ((a & 0x80) ? 0x11d : 0);
  }
  return result;
}

function generatorPolynomial(length: number): number[] {
  let polynomial = [1];
  for (let i = 0; i < length; i++) {
    const next = Array(polynomial.length + 1).fill(0);
    for (let j = 0; j < polynomial.length; j++) {
      next[j] ^= polynomial[j];
      next[j + 1] ^= gfMultiply(polynomial[j], EXP[i]);
    }
    polynomial = next;
  }
  return polynomial;
}

const GENERATORS = new Map<number, number[]>();

function errorCorrection(data: number[], length: number): number[] {
  const generator = GENERATORS.get(length) ?? generatorPolynomial(length);
  GENERATORS.set(length, generator);
  const remainder = new Uint8Array(length);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[length - 1] = 0;
    for (let i = 0; i < length; i++) remainder[i] ^= gfMultiply(generator[i + 1], factor);
  }
  return Array.from(remainder);
}

function appendBits(bits: number[], value: number, length: number): void {
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

function toUtf8(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

function buildCodewords(text: string, version: number): number[] {
  const bytes = toUtf8(text);
  const blocks = RS_BLOCKS_M[version - 1];
  const dataCodewords = blocks.reduce((sum, block) => sum + block.count * block.data, 0);
  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  for (const byte of bytes) appendBits(bits, byte, 8);
  if (bits.length > dataCodewords * 8) throw new RangeError("QR code input is too long.");
  for (let i = 0; i < Math.min(4, dataCodewords * 8 - bits.length); i++) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => a * 2 + b, 0));
  for (let i = data.length; i < dataCodewords; i++) data.push(i % 2 === 0 ? 0xec : 0x11);

  const encoded: { data: number[]; ec: number[] }[] = [];
  let offset = 0;
  for (const block of blocks) {
    for (let count = 0; count < block.count; count++) {
      const part = data.slice(offset, offset + block.data);
      offset += block.data;
      encoded.push({ data: part, ec: errorCorrection(part, block.ec) });
    }
  }

  const result: number[] = [];
  const maxData = Math.max(...encoded.map((block) => block.data.length));
  const maxEc = Math.max(...encoded.map((block) => block.ec.length));
  for (let i = 0; i < maxData; i++) for (const block of encoded) if (i < block.data.length) result.push(block.data[i]);
  for (let i = 0; i < maxEc; i++) for (const block of encoded) if (i < block.ec.length) result.push(block.ec[i]);
  return result;
}

function maskBit(mask: number, row: number, column: number): boolean {
  switch (mask) {
    case 0: return (row + column) % 2 === 0;
    case 1: return row % 2 === 0;
    case 2: return column % 3 === 0;
    case 3: return (row + column) % 3 === 0;
    case 4: return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
    case 5: return ((row * column) % 2 + (row * column) % 3) === 0;
    case 6: return (((row * column) % 2 + (row * column) % 3) % 2) === 0;
    case 7: return (((row * column) % 3 + (row + column) % 2) % 2) === 0;
    default: return false;
  }
}

function bchTypeInfo(data: number): number {
  let value = data << 10;
  const generator = 0x537;
  while (value.toString(2).length >= generator.toString(2).length) {
    value ^= generator << (value.toString(2).length - generator.toString(2).length);
  }
  return ((data << 10) | value) ^ 0x5412;
}

function setCell(matrix: (boolean | null)[][], row: number, column: number, value: boolean): void {
  if (row >= 0 && row < matrix.length && column >= 0 && column < matrix.length) matrix[row][column] = value;
}

function setupMatrix(version: number): (boolean | null)[][] {
  const size = 17 + version * 4;
  const matrix = Array.from({ length: size }, () => Array<boolean | null>(size).fill(null));

  function finder(row: number, column: number): void {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const dark = inside && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        setCell(matrix, row + r, column + c, dark);
      }
    }
  }

  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
  }

  for (const row of ALIGNMENT_POSITIONS[version - 1]) {
    for (const column of ALIGNMENT_POSITIONS[version - 1]) {
      if (matrix[row][column] !== null) continue;
      for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) matrix[row + r][column + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
    }
  }

  for (let i = 0; i < 9; i++) if (matrix[i][8] === null) matrix[i][8] = false;
  for (let i = 0; i < 8; i++) if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
  for (let i = 0; i < 8; i++) if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
  for (let i = 0; i < 9; i++) if (matrix[8][i] === null) matrix[8][i] = false;
  matrix[size - 8][8] = true;
  return matrix;
}

function placeFormat(matrix: (boolean | null)[][], mask: number): void {
  const size = matrix.length;
  const bits = bchTypeInfo(mask);
  for (let i = 0; i < 15; i++) {
    const bit = ((bits >>> i) & 1) !== 0;
    const first = i < 6 ? i : i < 8 ? i + 1 : size - 15 + i;
    const second = i < 8 ? size - i - 1 : i < 9 ? 15 - i - 1 : 15 - i;
    setCell(matrix, first, 8, bit);
    setCell(matrix, 8, second, bit);
  }
  matrix[size - 8][8] = true;
}

function placeData(base: (boolean | null)[][], codewords: number[], mask: number): boolean[][] {
  const matrix = base.map((row) => row.slice());
  const bits: number[] = [];
  for (const byte of codewords) appendBits(bits, byte, 8);
  let bitIndex = 0;
  let upward = true;

  for (let column = matrix.length - 1; column > 0; column -= 2) {
    if (column === 6) column--;
    for (let i = 0; i < matrix.length; i++) {
      const row = upward ? matrix.length - 1 - i : i;
      for (let offset = 0; offset < 2; offset++) {
        const currentColumn = column - offset;
        if (matrix[row][currentColumn] !== null) continue;
        let bit = bitIndex < bits.length ? bits[bitIndex++] : 0;
        if (maskBit(mask, row, currentColumn)) bit ^= 1;
        matrix[row][currentColumn] = bit !== 0;
      }
    }
    upward = !upward;
  }
  return matrix as boolean[][];
}

function penalty(matrix: boolean[][]): number {
  const size = matrix.length;
  let score = 0;
  for (let row = 0; row < size; row++) {
    let run = 1;
    for (let column = 1; column < size; column++) {
      if (matrix[row][column] === matrix[row][column - 1]) run++;
      else { if (run >= 5) score += run - 2; run = 1; }
    }
    if (run >= 5) score += run - 2;
  }
  for (let column = 0; column < size; column++) {
    let run = 1;
    for (let row = 1; row < size; row++) {
      if (matrix[row][column] === matrix[row - 1][column]) run++;
      else { if (run >= 5) score += run - 2; run = 1; }
    }
    if (run >= 5) score += run - 2;
  }
  for (let row = 0; row < size - 1; row++) for (let column = 0; column < size - 1; column++) {
    const value = matrix[row][column];
    if (matrix[row + 1][column] === value && matrix[row][column + 1] === value && matrix[row + 1][column + 1] === value) score += 3;
  }
  return score;
}

export type QrCode = { matrix: boolean[][]; version: number; byteLength: number };

export function generateQrCode(text: string): QrCode {
  const bytes = toUtf8(text);
  let version = 1;
  while (version <= 6) {
    const capacity = RS_BLOCKS_M[version - 1].reduce((sum, block) => sum + block.count * block.data, 0);
    if (12 + bytes.length * 8 <= capacity * 8) break;
    version++;
  }
  if (version > 6) throw new RangeError("QR code input is too long.");

  const codewords = buildCodewords(text, version);
  let best: boolean[][] | undefined;
  let bestPenalty = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const matrix = placeData(setupMatrix(version), codewords, mask);
    placeFormat(matrix, mask);
    const currentPenalty = penalty(matrix);
    if (currentPenalty < bestPenalty) { bestPenalty = currentPenalty; best = matrix; }
  }
  return { matrix: best!, version, byteLength: bytes.length };
}
