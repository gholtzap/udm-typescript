// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.10.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

import { Supi } from './common-types';

export type Suci = string;

export interface DeconcealReqData {
  suci: Suci;
}

export interface DeconcealRspData {
  supi: Supi;
}
