import { createHash, createCipheriv, randomBytes } from 'crypto';

export function generateRand(): string {
  return randomBytes(16).toString('hex').toUpperCase();
}

export function xor(a: Buffer, b: Buffer): Buffer {
  const result = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export function rotateLeft(input: Buffer, bits: number): Buffer {
  const bytes = Math.floor(bits / 8);
  const bitShift = bits % 8;
  const result = Buffer.alloc(input.length);
  
  for (let i = 0; i < input.length; i++) {
    const currentByte = input[(i + bytes) % input.length];
    const nextByte = input[(i + bytes + 1) % input.length];
    result[i] = ((currentByte << bitShift) | (nextByte >> (8 - bitShift))) & 0xFF;
  }
  
  return result;
}

export function aesEncrypt(key: Buffer, data: Buffer): Buffer {
  const cipher = createCipheriv('aes-128-ecb', key, null);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

export interface MilenageOutput {
  mac_a: Buffer;
  mac_s: Buffer;
  res: Buffer;
  ck: Buffer;
  ik: Buffer;
  ak: Buffer;
}

export function milenage(k: Buffer, op: Buffer, rand: Buffer, sqn: Buffer, amf: Buffer): MilenageOutput {
  const opc = aesEncrypt(k, op);
  const temp = xor(rand, opc);
  const out1 = aesEncrypt(k, temp);
  
  const in2 = xor(out1, rotateLeft(xor(rand, opc), 0));
  const out2 = aesEncrypt(k, in2);
  const res = xor(out2, opc).slice(8, 16);
  const ck = xor(aesEncrypt(k, xor(out1, rotateLeft(xor(rand, opc), 64))), opc);
  const ik = xor(aesEncrypt(k, xor(out1, rotateLeft(xor(rand, opc), 128))), opc);
  
  const in5 = xor(out1, rotateLeft(xor(rand, opc), 64));
  const out5 = aesEncrypt(k, in5);
  const ak = xor(out5, opc).slice(0, 6);
  
  const sqnXorAk = xor(sqn, ak);
  const macInput = Buffer.concat([sqnXorAk, amf, sqnXorAk, amf]);
  const macTemp = xor(aesEncrypt(k, xor(rand, opc)), Buffer.concat([macInput, Buffer.alloc(8)]));
  const mac_a = aesEncrypt(k, xor(macTemp.slice(0, 16), opc)).slice(0, 8);
  
  const mac_s = Buffer.alloc(8);
  
  return { mac_a, mac_s, res, ck, ik, ak };
}

export function computeKausf(ck: Buffer, ik: Buffer, servingNetworkName: string, sqnXorAk: Buffer): string {
  const key = Buffer.concat([ck, ik]);
  
  const snName = Buffer.from(servingNetworkName, 'utf8');
  const snNameLength = Buffer.alloc(2);
  snNameLength.writeUInt16BE(snName.length);
  
  const s = Buffer.concat([
    Buffer.from([0x6A]),
    snName,
    snNameLength,
    sqnXorAk,
    Buffer.from([0x00, 0x06])
  ]);
  
  const hash = createHash('sha256');
  hash.update(s);
  hash.update(key);
  
  return hash.digest('hex').toUpperCase();
}

export function computeXresStar(res: Buffer, rand: Buffer, servingNetworkName: string): string {
  const snName = Buffer.from(servingNetworkName, 'utf8');
  const snNameLength = Buffer.alloc(2);
  snNameLength.writeUInt16BE(snName.length);
  
  const s = Buffer.concat([
    Buffer.from([0x6B]),
    snName,
    snNameLength,
    rand,
    Buffer.from([0x00, 0x10]),
    res,
    Buffer.from([0x00, res.length])
  ]);
  
  const hash = createHash('sha256');
  hash.update(s);
  
  return hash.digest().slice(0, 16).toString('hex').toUpperCase();
}

export function kdf(key: Buffer, s: Buffer): Buffer {
  const hash = createHash('sha256');
  hash.update(s);
  hash.update(key);
  return hash.digest();
}

export function computeCkPrimeIkPrime(ck: Buffer, ik: Buffer, servingNetworkName: string, sqnXorAk: Buffer): { ckPrime: string, ikPrime: string } {
  const fc = 0x20;
  const snName = Buffer.from(servingNetworkName, 'utf8');
  const snNameLength = Buffer.alloc(2);
  snNameLength.writeUInt16BE(snName.length);
  
  const s = Buffer.concat([
    Buffer.from([fc]),
    snName,
    snNameLength,
    sqnXorAk,
    Buffer.from([0x00, 0x06])
  ]);
  
  const key = Buffer.concat([ck, ik]);
  const output = kdf(key, s);
  
  const ckPrime = output.slice(0, 16).toString('hex').toUpperCase();
  const ikPrime = output.slice(16, 32).toString('hex').toUpperCase();
  
  return { ckPrime, ikPrime };
}

