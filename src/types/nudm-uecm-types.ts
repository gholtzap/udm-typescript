import { Supi, Gpsi } from './common-types';

export interface Amf3GppAccessRegistration {
  amfInstanceId: string;
  supportedFeatures?: string;
  purgeFlag?: boolean;
  pei?: string;
  imsVoPs?: ImsVoPs;
  deregCallbackUri: string;
  amfServiceNameDereg?: string;
  pcscfRestorationCallbackUri?: string;
  amfServiceNamePcscfRest?: string;
  initialRegistrationInd?: boolean;
  emergencyRegistrationInd?: boolean;
  guami: Guami;
  backupAmfInfo?: BackupAmfInfo[];
  drFlag?: boolean;
  eps5GsMobilityWoN26?: boolean;
  ratType: RatType;
  urrpIndicator?: boolean;
  amfEeSubscriptionId?: string;
  epsInterworkingInfo?: EpsInterworkingInfo;
  ueSrvccCapability?: boolean;
  registrationTime?: string;
  vgmlcAddress?: VgmlcAddress;
  contextInfo?: ContextInfo;
  noEeSubscriptionInd?: boolean;
  supi?: Supi;
  ueReachableInd?: UeReachableInd;
  reRegistrationRequired?: boolean;
  adminDeregSubWithdrawn?: boolean;
  dataRestorationCallbackUri?: string;
  resetIds?: string[];
  disasterRoamingInd?: boolean;
  ueMINTCapability?: boolean;
  sorSnpnSiSupported?: boolean;
  udrRestartInd?: boolean;
  lastSynchronizationTime?: string;
  ueSnpnSubscriptionInd?: boolean;
}

export interface Amf3GppAccessRegistrationModification {
  guami: Guami;
  purgeFlag?: boolean;
  pei?: string;
  imsVoPs?: ImsVoPs;
  backupAmfInfo?: BackupAmfInfo[];
  epsInterworkingInfo?: EpsInterworkingInfo;
  ueSrvccCapability?: boolean | null;
  ueMINTCapability?: boolean;
}

export interface EpsInterworkingInfo {
  epsIwkPgws?: { [key: string]: EpsIwkPgw };
  registrationTime?: string;
}

export interface EpsIwkPgw {
  pgwFqdn: string;
  smfInstanceId: string;
  plmnId?: PlmnId;
}

export interface AmfNon3GppAccessRegistration {
  amfInstanceId: string;
  supportedFeatures?: string;
  purgeFlag?: boolean;
  pei?: string;
  imsVoPs: ImsVoPs;
  deregCallbackUri: string;
  amfServiceNameDereg?: string;
  pcscfRestorationCallbackUri?: string;
  amfServiceNamePcscfRest?: string;
  guami: Guami;
  backupAmfInfo?: BackupAmfInfo[];
  ratType: RatType;
  urrpIndicator?: boolean;
  amfEeSubscriptionId?: string;
  registrationTime?: string;
  vgmlcAddress?: VgmlcAddress;
  contextInfo?: ContextInfo;
  noEeSubscriptionInd?: boolean;
  supi?: Supi;
  reRegistrationRequired?: boolean;
  adminDeregSubWithdrawn?: boolean;
  dataRestorationCallbackUri?: string;
  resetIds?: string[];
  disasterRoamingInd?: boolean;
  sorSnpnSiSupported?: boolean;
  udrRestartInd?: boolean;
  lastSynchronizationTime?: string;
  ueSnpnSubscriptionInd?: boolean;
}

export interface AmfNon3GppAccessRegistrationModification {
  guami: Guami;
  purgeFlag?: boolean;
  pei?: string;
  imsVoPs?: ImsVoPs;
  backupAmfInfo?: BackupAmfInfo[];
}

export interface SmfRegistration {
  smfInstanceId: string;
  smfSetId?: string;
  supportedFeatures?: string;
  pduSessionId: number;
  singleNssai: Snssai;
  dnn?: string;
  emergencyServices?: boolean;
  pcscfRestorationCallbackUri?: string;
  plmnId: PlmnId;
  pgwFqdn?: string;
  pgwIpAddr?: IpAddress;
  epdgInd?: boolean;
  deregCallbackUri?: string;
  registrationReason?: RegistrationReason;
  registrationTime?: string;
  contextInfo?: ContextInfo;
  pcfId?: string;
  dataRestorationCallbackUri?: string;
  resetIds?: string[];
  udrRestartInd?: boolean;
  lastSynchronizationTime?: string;
  pduSessionReActivationRequired?: boolean;
  staleCheckCallbackUri?: string;
  udmStaleCheckCallbackUri?: string;
  wildcardInd?: boolean;
}

export interface PduSessionIds {
  pduSessionIdList?: number[];
}

export interface SmsfRegistration {
  smsfInstanceId: string;
  smsfSetId?: string;
  supportedFeatures?: string;
  plmnId: PlmnId;
  smsfMAPAddress?: string;
  smsfDiameterAddress?: NetworkNodeDiameterAddress;
  registrationTime?: string;
  contextInfo?: ContextInfo;
  dataRestorationCallbackUri?: string;
  resetIds?: string[];
  smsfSbiSupInd?: boolean;
  udrRestartInd?: boolean;
  lastSynchronizationTime?: string;
  ueMemoryAvailableInd?: true;
}

export interface DeregistrationData {
  deregReason: DeregistrationReason;
  accessType?: AccessType;
  pduSessionId?: number;
  newSmfInstanceId?: string;
  oldGuami?: Guami;
}

export interface PcscfRestorationNotification {
  supi: Supi;
  failedPcscf?: PcscfAddress;
  oldGuami?: Guami;
}

export interface NetworkNodeDiameterAddress {
  name: string;
  realm: string;
}

export interface TriggerRequest {
  supi: Supi;
  failedPcscf?: PcscfAddress;
}

export interface SmfRegistrationInfo {
  smfRegistrationList: SmfRegistration[];
}

export interface IpSmGwRegistration {
  ipSmGwMapAddress?: string;
  ipSmGwDiameterAddress?: NetworkNodeDiameterAddress;
  ipsmgwIpv4?: string;
  ipsmgwIpv6?: string;
  ipsmgwFqdn?: string;
  nfInstanceId?: string;
  unriIndicator?: boolean;
  resetIds?: string[];
  ipSmGwSbiSupInd?: boolean;
}

export interface AmfDeregInfo {
  deregReason: DeregistrationReason;
}

export interface LocationInfo {
  supi?: Supi;
  gpsi?: Gpsi;
  registrationLocationInfoList: RegistrationLocationInfo[];
  supportedFeatures?: string;
}

export interface RegistrationLocationInfo {
  amfInstanceId: string;
  guami?: Guami;
  plmnId?: PlmnId;
  vgmlcAddress?: VgmlcAddress;
  accessTypeList: AccessType[];
}

export interface VgmlcAddress {
  vgmlcAddressIpv4?: string;
  vgmlcAddressIpv6?: string;
  vgmlcFqdn?: string;
}

export interface PeiUpdateInfo {
  pei: string;
}

export type RegistrationDatasetNames = RegistrationDataSetName[];

export interface RegistrationDataSets {
  amf3Gpp?: Amf3GppAccessRegistration;
  amfNon3Gpp?: AmfNon3GppAccessRegistration;
  smfRegistration?: SmfRegistrationInfo;
  smsf3Gpp?: SmsfRegistration;
  smsfNon3Gpp?: SmsfRegistration;
  ipSmGw?: IpSmGwRegistration;
  nwdafRegistration?: NwdafRegistrationInfo;
}

export interface NwdafRegistration {
  nwdafInstanceId: string;
  analyticsIds: string[];
  nwdafSetId?: string;
  registrationTime?: string;
  contextInfo?: ContextInfo;
  supportedFeatures?: string;
  resetIds?: string[];
}

export interface NwdafRegistrationModification {
  nwdafInstanceId: string;
  nwdafSetId?: string;
  analyticsIds?: string[];
  supportedFeatures?: string;
}

export interface SmfRegistrationModification {
  smfInstanceId: string;
  smfSetId?: string;
  pgwFqdn?: string | null;
}

export interface DataRestorationNotification {
  lastReplicationTime?: string;
  recoveryTime?: string;
  plmnId?: PlmnId;
  supiRanges?: SupiRange[];
  gpsiRanges?: IdentityRange[];
  resetIds?: string[];
  sNssaiList?: Snssai[];
  dnnList?: string[];
  udmGroupId?: string;
  rediscoveryInd?: boolean;
  noResynchronizationRequired?: boolean;
  resynchronizationTime?: string;
  dataToResync?: UdmDataToResynchronize[];
  anyUeInd?: boolean;
  ausfRediscoveryInd?: boolean;
}

export interface RoamingInfoUpdate {
  roaming?: boolean;
  servingPlmn: PlmnId;
}

export interface PcscfAddress {
  ipv4Addrs?: string[];
  ipv6Addrs?: string[];
  fqdn?: string;
}

export interface NwdafRegistrationInfo {
  nwdafRegistrationList: NwdafRegistration[];
}

export interface RoutingInfoSmRequest {
  ipSmGwInd?: boolean;
  correlationId?: string;
  supportedFeatures?: string;
}

export interface RoutingInfoSmResponse {
  supi?: Supi;
  smsf3Gpp?: SmsfRegistration;
  smsfNon3Gpp?: SmsfRegistration;
  ipSmGw?: IpSmGwInfo;
  smsRouter?: SmsRouterInfo;
  mpsMsgIndication?: boolean;
}

export interface IpSmGwInfo {
  ipSmGwRegistration?: IpSmGwRegistration;
  ipSmGwGuidance?: IpSmGwGuidance;
}

export interface IpSmGwGuidance {
  minDeliveryTime: number;
  recommDeliveryTime: number;
}

export interface SmsRouterInfo {
  nfInstanceId?: string;
  diameterAddress?: NetworkNodeDiameterAddress;
  mapAddress?: string;
  routerIpv4?: string;
  routerIpv6?: string;
  routerFqdn?: string;
}

export interface SmsfRegistrationModification {
  smsfInstanceId: string;
  smsfSetId?: string;
  ueMemoryAvailableInd?: true;
}

export interface ReauthNotificationInfo {
  supi: Supi;
  oldGuami?: Guami;
  ausfRediscoveryInd?: boolean;
}

export interface AuthTriggerInfo {
  supi?: Supi;
}

export interface DeregistrationRespData {
  smfEventRemovedInd?: true;
}

export interface Guami {
  plmnId: PlmnId;
  amfId: string;
}

export interface PlmnId {
  mcc: string;
  mnc: string;
}

export interface BackupAmfInfo {
  backupAmf: string;
  guamiList?: Guami[];
}

export interface Snssai {
  sst: number;
  sd?: string;
}

export interface ContextInfo {
  originalAmfId?: string;
  supportedFeatures?: string;
}

export interface IpAddress {
  ipv4Addr?: string;
  ipv6Addr?: string;
  ipv6Prefix?: string;
}

export interface SupiRange {
  pattern?: string;
  start?: string;
  end?: string;
}

export interface IdentityRange {
  pattern?: string;
  start?: string;
  end?: string;
}

export type RatType = 'NR' | 'EUTRA' | 'WLAN' | 'VIRTUAL' | 'NBIOT' | 'WIRELINE' | 'WIRELINE_CABLE' | 'WIRELINE_BBF' | string;

export type AccessType = '3GPP_ACCESS' | 'NON_3GPP_ACCESS' | string;

export type ImsVoPs = 'HOMOGENEOUS_SUPPORT' | 'HOMOGENEOUS_NON_SUPPORT' | 'NON_HOMOGENEOUS_OR_UNKNOWN' | string;

export type DeregistrationReason = 
  | 'UE_INITIAL_REGISTRATION'
  | 'UE_REGISTRATION_AREA_CHANGE'
  | 'SUBSCRIPTION_WITHDRAWN'
  | '5GS_TO_EPS_MOBILITY'
  | '5GS_TO_EPS_MOBILITY_UE_INITIAL_REGISTRATION'
  | 'REREGISTRATION_REQUIRED'
  | 'SMF_CONTEXT_TRANSFERRED'
  | 'DUPLICATE_PDU_SESSION'
  | 'PDU_SESSION_REACTIVATION_REQUIRED'
  | 'DISASTER_CONDITION_TERMINATED'
  | 'OPERATOR_DETERMINED_BARRING'
  | 'DUPLICATE_PDU_SESSION_EPDG'
  | string;

export type RegistrationReason = 'SMF_CONTEXT_TRANSFERRED' | string;

export type RegistrationDataSetName = 
  | 'AMF_3GPP'
  | 'AMF_NON_3GPP'
  | 'SMF_PDU_SESSIONS'
  | 'SMSF_3GPP'
  | 'SMSF_NON_3GPP'
  | 'IP_SM_GW'
  | 'NWDAF'
  | string;

export type UeReachableInd = 'REACHABLE' | 'NOT_REACHABLE' | 'UNKNOWN' | string;

export type UdmDataToResynchronize = 
  | 'UDM_UECM_REGISTRATION'
  | 'UDM_SDM_SUBSCRIBE'
  | 'UDM_EE_SUBSCRIBE'
  | string;
