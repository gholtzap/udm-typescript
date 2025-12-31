const Milenage = require('milenage');

const K = Buffer.from('8baf473f2f8fd09487cccbd7097c6862', 'hex');
const OPc = Buffer.from('8e27b6af0e692e750f32667a3b14605d', 'hex');
const RAND = Buffer.from('AAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBB'.replace(/ /g, ''), 'hex');
const SQN = Buffer.from('000000001000', 'hex');
const AMF = Buffer.from('8000', 'hex');

console.log('Inputs:');
console.log('K   :', K.toString('hex'));
console.log('OPc :', OPc.toString('hex'));
console.log('RAND:', RAND.toString('hex'));
console.log('SQN :', SQN.toString('hex'));
console.log('AMF :', AMF.toString('hex'));
console.log('');

const mil = new Milenage({ op_c: new Uint8Array(OPc), key: new Uint8Array(K) });

const f1Result = mil.f1(new Uint8Array(RAND), new Uint8Array(SQN), new Uint8Array(AMF));
const f2345Result = mil.f2345(new Uint8Array(RAND));

console.log('f1 result structure:');
console.log(f1Result);
console.log('');
console.log('f2345 result structure:');
console.log(f2345Result);
console.log('');

const mac_a = Buffer.from(f1Result.mac_a);
const ak = Buffer.from(f2345Result.ak);
console.log('MAC-A:', mac_a.toString('hex'));
console.log('AK:   ', ak.toString('hex'));

const sqnXorAk = Buffer.alloc(6);
for (let i = 0; i < 6; i++) {
  sqnXorAk[i] = SQN[i] ^ ak[i];
}
const autn = Buffer.concat([sqnXorAk, AMF, mac_a]);
console.log('SQN⊕AK:', sqnXorAk.toString('hex'));
console.log('AUTN:  ', autn.toString('hex'));
