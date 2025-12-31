const Milenage = require('milenage');

const K = Buffer.from('8baf473f2f8fd09487cccbd7097c6862', 'hex');
const OPc = Buffer.from('8e27b6af0e692e750f32667a3b14605d', 'hex');
const RAND = Buffer.from('01234567890ABCDEFEDCBA9876543210', 'hex');
const SQN = Buffer.from('000000000000', 'hex');
const AMF = Buffer.from('8000', 'hex');

console.log('Testing reference Milenage library:');
console.log('K  :', K.toString('hex'));
console.log('OPc:', OPc.toString('hex'));
console.log('');

const mil = new Milenage({ op_c: new Uint8Array(OPc), key: new Uint8Array(K) });

const f1Result = mil.f1(new Uint8Array(RAND), new Uint8Array(SQN), new Uint8Array(AMF));
const f2345Result = mil.f2345(new Uint8Array(RAND));

console.log('f1 Results:');
console.log('MAC-A:', Buffer.from(f1Result.mac_a).toString('hex'));
console.log('MAC-S:', Buffer.from(f1Result.mac_s).toString('hex'));
console.log('');
console.log('f2345 Results:');
console.log('RES:  ', Buffer.from(f2345Result.res).toString('hex'));
console.log('CK:   ', Buffer.from(f2345Result.ck).toString('hex'));
console.log('IK:   ', Buffer.from(f2345Result.ik).toString('hex'));
console.log('AK:   ', Buffer.from(f2345Result.ak).toString('hex'));

const sqnXorAk = Buffer.alloc(6);
for (let i = 0; i < 6; i++) {
  sqnXorAk[i] = SQN[i] ^ Buffer.from(f2345Result.ak)[i];
}
const autn = Buffer.concat([sqnXorAk, AMF, Buffer.from(f1Result.mac_a)]).toString('hex').toUpperCase();
console.log('');
console.log('AUTN: ', autn);
