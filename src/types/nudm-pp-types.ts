// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.5.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

import { ReferenceId, PlmnId, Snssai, PduSessionType } from './common-types';

export type PpDlPacketCount = number | null;

export interface PpData {
  supportedFeatures?: string;
  communicationCharacteristics?: CommunicationCharacteristics;
  expectedUeBehaviour?: ExpectedUeBehaviour;
  ecRestriction?: EcRestriction;
  acsInfo?: AcsInfoRm;
  stnSr?: string | null;
  lcsPrivacy?: LcsPrivacy;
  sorInfo?: SorInfo;
  "5mbsAuthorizationInfo"?: FiveMbsAuthorizationInfo;
}

export interface CommunicationCharacteristics {
  ppSubsRegTimer?: PpSubsRegTimer;
  ppActiveTime?: PpActiveTime;
  ppDlPacketCount?: PpDlPacketCount;
  ppDlPacketCountExt?: PpDlPacketCountExt;
  ppMaximumResponseTime?: PpMaximumResponseTime;
  ppMaximumLatency?: PpMaximumLatency;
}

export interface PpSubsRegTimer {
  subsRegTimer: number;
  afInstanceId: string;
  referenceId: ReferenceId;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface PpActiveTime {
  activeTime: number;
  afInstanceId: string;
  referenceId: ReferenceId;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface FiveGVnGroupConfiguration {
  "5gVnGroupData"?: FiveGVnGroupData;
  members?: string[];
  referenceId?: ReferenceId;
  afInstanceId?: string;
  internalGroupIdentifier?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface FiveGVnGroupData {
  dnn: string;
  sNssai: Snssai;
  pduSessionTypes?: PduSessionType[];
  appDescriptors?: AppDescriptor[];
  secondaryAuth?: boolean;
  dnAaaIpAddressAllocation?: boolean;
  dnAaaAddress?: string;
  additionalDnAaaAddresses?: string[];
  dnAaaFqdn?: string;
}

export interface ExpectedUeBehaviour {
  afInstanceId: string;
  referenceId: ReferenceId;
  stationaryIndication?: StationaryIndicationRm;
  communicationDurationTime?: number | null;
  periodicTime?: number | null;
  scheduledCommunicationTime?: ScheduledCommunicationTimeRm;
  scheduledCommunicationType?: ScheduledCommunicationTypeRm;
  expectedUmts?: LocationArea[];
  trafficProfile?: TrafficProfileRm;
  batteryIndication?: BatteryIndicationRm;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface LocationArea {
  geographicAreas?: GeographicArea[];
  civicAddresses?: CivicAddress[];
  nwAreaInfo?: NetworkAreaInfo;
  umtTime?: UmtTime;
}

export interface NetworkAreaInfo {
  ecgis?: Ecgi[];
  ncgis?: Ncgi[];
  gRanNodeIds?: GlobalRanNodeId[];
  tais?: Tai[];
}

export interface EcRestriction {
  afInstanceId: string;
  referenceId: ReferenceId;
  plmnEcInfos?: PlmnEcInfo[];
  mtcProviderInformation?: MtcProviderInformation;
}

export interface PlmnEcInfo {
  plmnId: PlmnId;
  ecRestrictionDataWb?: EcRestrictionDataWb;
  ecRestrictionDataNb?: boolean;
}

export interface PpDlPacketCountExt {
  afInstanceId: string;
  referenceId: ReferenceId;
  dnn?: string;
  singleNssai?: Snssai;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface PpMaximumResponseTime {
  maximumResponseTime: number;
  afInstanceId: string;
  referenceId: ReferenceId;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface PpMaximumLatency {
  maximumLatency: number;
  afInstanceId: string;
  referenceId: ReferenceId;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface LcsPrivacy {
  afInstanceId?: string;
  referenceId?: ReferenceId;
  lpi?: Lpi;
  mtcProviderInformation?: MtcProviderInformation;
}

export interface UmtTime {
  timeOfDay: string;
  dayOfWeek: number;
}

export interface PpDataEntry {
  communicationCharacteristics?: CommunicationCharacteristicsAF;
  referenceId: ReferenceId;
  validityTime?: string;
  mtcProviderInformation?: MtcProviderInformation;
  supportedFeatures?: string;
  ecsAddrConfigInfo?: EcsAddrConfigInfo;
  additionalEcsAddrConfigInfos?: EcsAddrConfigInfo[];
  ecRestriction?: EcRestriction;
}

export interface CommunicationCharacteristicsAF {
  ppDlPacketCount?: PpDlPacketCount;
  maximumResponseTime?: number;
  maximumLatency?: number;
}

export interface EcsAddrConfigInfo {
  ecsServerAddr?: EcsServerAddr;
  spatialValidityCond?: SpatialValidityCond;
}

export interface FiveMbsAuthorizationInfo {
  "5mbsSessionIds": MbsSessionId[];
}

export interface MulticastMbsGroupMemb {
  multicastGroupMemb: string[];
  afInstanceId?: string;
  internalGroupIdentifier?: string;
}

export type MtcProviderInformation = any;

export type SorInfo = any;

export type AcsInfoRm = any;

export type GeographicArea = any;

export type CivicAddress = any;

export type Ecgi = any;

export type Ncgi = any;

export type GlobalRanNodeId = any;

export type Tai = any;

export type StationaryIndicationRm = any;

export type ScheduledCommunicationTimeRm = any;

export type ScheduledCommunicationTypeRm = any;

export type TrafficProfileRm = any;

export type BatteryIndicationRm = any;

export type EcRestrictionDataWb = any;

export type Lpi = any;

export type AppDescriptor = any;

export type EcsServerAddr = any;

export type SpatialValidityCond = any;

export type MbsSessionId = any;
