declare module 'milenage' {
  interface MilenageOptions {
    op_c?: Uint8Array;
    op?: Uint8Array;
    key: Uint8Array;
  }

  interface F1Result {
    mac_a: Uint8Array;
    mac_s: Uint8Array;
  }

  interface F2345Result {
    res: Uint8Array;
    ck: Uint8Array;
    ik: Uint8Array;
    ak: Uint8Array;
  }

  class Milenage {
    constructor(options: MilenageOptions);
    f1(rand: Uint8Array, sqn: Uint8Array, amf: Uint8Array): F1Result;
    f2345(rand: Uint8Array): F2345Result;
  }

  export = Milenage;
}
