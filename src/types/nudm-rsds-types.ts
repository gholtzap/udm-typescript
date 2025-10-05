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
