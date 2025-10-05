// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.?.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

import { Gpsi, Supi } from './common-types';

export interface SmDeliveryStatus {
  gpsi: Gpsi;
  smStatusReport: string;
  failedServingNodes?: RoutingInfoSmResponse;
}

export interface RoutingInfoSmResponse {
  supi?: Supi;
  smsf3Gpp?: SmsfRegistration;
  smsfNon3Gpp?: SmsfRegistration;
  ipSmGw?: IpSmGwInfo;
  smsRouter?: SmsRouterInfo;
}

export interface SmsfRegistration {
  smsfInstanceId: string;
  smsfSetId?: string;
  plmnId?: PlmnId;
  networkNodeDiameterAddress?: NetworkNodeDiameterAddress;
}

export interface IpSmGwInfo {
  ipSmGwMapAddress?: string;
  networkNodeDiameterAddress?: NetworkNodeDiameterAddress;
}

export interface SmsRouterInfo {
  ipSmGwMapAddress?: string;
  networkNodeDiameterAddress?: NetworkNodeDiameterAddress;
}

export interface NetworkNodeDiameterAddress {
  diameterAddress?: string;
}

export interface PlmnId {
  mcc: string;
  mnc: string;
}
