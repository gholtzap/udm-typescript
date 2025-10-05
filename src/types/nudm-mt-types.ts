export type UeContextInfo = {
  [key: string]: any;
};

export type NfInstanceId = string;

export type PlmnId = {
  mcc: string;
  mnc: string;
};

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

export enum RatType {
  NR = "NR",
  EUTRA = "EUTRA",
  WLAN = "WLAN",
  VIRTUAL = "VIRTUAL",
  NBIOT = "NBIOT",
  WIRELINE = "WIRELINE",
  WIRELINE_CABLE = "WIRELINE_CABLE",
  WIRELINE_BBF = "WIRELINE_BBF",
  LTE_M = "LTE-M",
  NR_U = "NR_U",
  EUTRA_U = "EUTRA_U",
  TRUSTED_N3GA = "TRUSTED_N3GA",
  TRUSTED_WLAN = "TRUSTED_WLAN",
  UTRA = "UTRA",
  GERA = "GERA",
  NR_LEO = "NR_LEO",
  NR_MEO = "NR_MEO",
  NR_GEO = "NR_GEO",
  NR_OTHER_SAT = "NR_OTHER_SAT"
}

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
