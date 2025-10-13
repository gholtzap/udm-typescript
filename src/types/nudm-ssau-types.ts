// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.8.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf


import { Gpsi, Supi, Dnn, Snssai } from './common-types';

export type ExternalGroupId = string;

export type GroupId = string;

export type Uri = string;

export type NefId = string;

export type MtcProviderInformation = {
  [key: string]: any;
};

export enum ServiceType {
  AF_GUIDANCE_FOR_URSP = "AF_GUIDANCE_FOR_URSP",
  AF_REQUESTED_QOS = "AF_REQUESTED_QOS"
}

export enum InvalidCause {
  SUBSRIPTION_WITHDRAWAL = "SUBSRIPTION_WITHDRAWAL",
  DNN_REMOVED = "DNN_REMOVED",
  SLICE_REMOVED = "SLICE_REMOVED",
  AUTHORIZATION_REVOKED = "AUTHORIZATION_REVOKED"
}

export type AuthorizationUeId = {
  supi: Supi;
  gpsi?: Gpsi;
};

export type ServiceSpecificAuthorizationData = {
  authorizationUeId?: AuthorizationUeId;
  extGroupId?: ExternalGroupId;
  IntGroupId?: GroupId;
  authId?: string;
};

export type AuthUpdateInfo = {
  authorizationData: ServiceSpecificAuthorizationData;
  invalidityInd?: boolean;
  invalidCause?: InvalidCause;
};

export type AuthUpdateNotification = {
  serviceType: ServiceType;
  snssai?: Snssai;
  dnn?: Dnn;
  authUpdateInfoList: AuthUpdateInfo[];
  mtcProviderInformation?: MtcProviderInformation;
  afId?: string;
};

export type ServiceSpecificAuthorizationInfo = {
  snssai?: Snssai;
  dnn?: Dnn;
  mtcProviderInformation?: MtcProviderInformation;
  authUpdateCallbackUri?: Uri;
  afId?: string;
  nefId?: NefId;
};

export type ServiceSpecificAuthorizationRemoveData = {
  authId: string;
};
