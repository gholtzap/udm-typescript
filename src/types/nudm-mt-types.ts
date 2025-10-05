// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.7.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

import { PlmnId, RatType } from './common-types';

export type UeContextInfo = {
  [key: string]: any;
};

export type NfInstanceId = string;

export type Ecgi = {
  plmnId: PlmnId;
  eutraCellId: string;
};

export type Ncgi = {
  plmnId: PlmnId;
  nrCellId: string;
};

export type Tai = {
  plmnId: PlmnId;
  tac: string;
};

export type GeographicArea = {
  [key: string]: any;
};

export type AgeOfLocationEstimate = number;

export type TimeZone = string;

export type SupportedFeatures = string;

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  cause?: string;
  invalidParams?: Array<{
    param: string;
    reason?: string;
  }>;
  supportedFeatures?: string;
};

export type StnSr = string;

export type CMsisdn = string;

export enum FiveGsUserState {
  DEREGISTERED = "DEREGISTERED",
  REGISTERED = "REGISTERED",
  NOT_PROVIDED = "NOT_PROVIDED"
}

export interface UeInfo {
  tadsInfo?: UeContextInfo;
  userState?: FiveGsUserState;
  fiveGSrvccInfo?: FiveGSrvccInfo;
}

export interface LocationInfoRequest {
  req5gsLoc?: boolean;
  reqCurrentLoc?: boolean;
  reqRatType?: boolean;
  reqTimeZone?: boolean;
  reqServingNode?: boolean;
  supportedFeatures?: SupportedFeatures;
}

export interface LocationInfoResult {
  vPlmnId: PlmnId;
  amfInstanceId?: NfInstanceId;
  smsfInstanceId?: NfInstanceId;
  ecgi?: Ecgi;
  ncgi?: Ncgi;
  tai?: Tai;
  currentLoc?: boolean;
  geoInfo?: GeographicArea;
  locationAge?: AgeOfLocationEstimate;
  ratType?: RatType;
  timezone?: TimeZone;
  supportedFeatures?: SupportedFeatures;
}

export interface FiveGSrvccInfo {
  ue5GSrvccCapability: boolean;
  stnSr?: StnSr;
  cMsisdn?: CMsisdn;
}
