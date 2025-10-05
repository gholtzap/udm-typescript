import { Gpsi, Supi } from './common-types';

export type Dnn = string;

export type Snssai = {
  sst: number;
  sd?: string;
};

export type ExternalGroupId = string;

export type GroupId = string;

export type Uri = string;

export type NefId = string;

export type MtcProviderInformation = {
  [key: string]: any;
};

export enum ServiceType {
  AF_GUIDANCE_FOR_URSP = "AF_GUIDANCE_FOR_URSP"
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
