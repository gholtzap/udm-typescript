import { Supi } from './common-types';

export type Suci = string;

export interface DeconcealReqData {
  suci: Suci;
}

export interface DeconcealRspData {
  supi: Supi;
}
