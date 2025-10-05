// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.6.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

export type Supi = string;

export type Gpsi = string;

export type Dnn = string;

export type DateTime = string;

export type Uri = string;

export type NefId = string;

export interface AuthorizationData {
  authorizationData: UserIdentifier[];
  validityTime?: DateTime;
}

export interface UserIdentifier {
  supi: Supi;
  gpsi?: Gpsi;
  validityTime?: DateTime;
}

export interface NiddAuthUpdateInfo {
  authorizationData: AuthorizationData;
  invalidityInd?: boolean;
  snssai?: Snssai;
  dnn?: Dnn;
  niddCause?: NiddCause;
}

export interface NiddAuthUpdateNotification {
  niddAuthUpdateInfoList: NiddAuthUpdateInfo[];
}

export interface AuthorizationInfo {
  snssai: Snssai;
  dnn: Dnn;
  mtcProviderInformation: MtcProviderInformation;
  authUpdateCallbackUri: Uri;
  afId?: string;
  nefId?: NefId;
  validityTime?: DateTime;
  contextInfo?: ContextInfo;
}

export enum NiddCause {
  SUBSCRIPTION_WITHDRAWAL = "SUBSCRIPTION_WITHDRAWAL",
  DNN_REMOVED = "DNN_REMOVED"
}

export interface Snssai {
  sst: number;
  sd?: string;
}

export type MtcProviderInformation = any;

export type ContextInfo = any;
