// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.1.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

import { PlmnId, Snssai, RatType, AccessType, PduSessionType } from './common-types';

export type DefaultDnnIndicator = boolean;

export type LboRoamingAllowed = boolean;

export type UeUsageType = number;

export type MpsPriorityIndicator = boolean;

export type McsPriorityIndicator = boolean;

export type ThreeGppChargingCharacteristics = string;

export type MicoAllowed = boolean;

export type SmsSubscribed = boolean;

export type SharedDataId = string;

export type IwkEpsInd = boolean;

export type SecuredPacket = string;

export type UpuRegInd = boolean;

export type ExtGroupId = string;

export type NbIoTUePriority = number;

export type CodeWord = string;

export type AfId = string;

export type LcsClientId = string;

export type SorTransparentContainer = string;

export type UpuTransparentContainer = string;

export type SorCmci = string;

export enum DataSetName {
  AM = "AM",
  SMF_SEL = "SMF_SEL",
  UEC_SMF = "UEC_SMF",
  UEC_SMSF = "UEC_SMSF",
  SMS_SUB = "SMS_SUB",
  SM = "SM",
  TRACE = "TRACE",
  SMS_MNG = "SMS_MNG",
  LCS_PRIVACY = "LCS_PRIVACY",
  LCS_MO = "LCS_MO",
  UEC_AMF = "UEC_AMF",
  V2X = "V2X",
  LCS_BCA = "LCS_BCA",
  PROSE = "PROSE",
  UC = "UC",
  MBS = "MBS"
}

export enum PduSessionContinuityInd {
  MAINTAIN_PDUSESSION = "MAINTAIN_PDUSESSION",
  RECONNECT_PDUSESSION = "RECONNECT_PDUSESSION",
  RELEASE_PDUSESSION = "RELEASE_PDUSESSION"
}

export enum LocationPrivacyInd {
  LOCATION_DISALLOWED = "LOCATION_DISALLOWED",
  LOCATION_ALLOWED = "LOCATION_ALLOWED"
}

export enum PrivacyCheckRelatedAction {
  LOCATION_NOT_ALLOWED = "LOCATION_NOT_ALLOWED",
  LOCATION_ALLOWED_WITH_NOTIFICATION = "LOCATION_ALLOWED_WITH_NOTIFICATION",
  LOCATION_ALLOWED_WITHOUT_NOTIFICATION = "LOCATION_ALLOWED_WITHOUT_NOTIFICATION",
  LOCATION_ALLOWED_WITHOUT_RESPONSE = "LOCATION_ALLOWED_WITHOUT_RESPONSE",
  LOCATION_RESTRICTED_WITHOUT_RESPONSE = "LOCATION_RESTRICTED_WITHOUT_RESPONSE"
}

export enum LcsClientClass {
  BROADCAST_SERVICE = "BROADCAST_SERVICE",
  OM_IN_HPLMN = "OM_IN_HPLMN",
  OM_IN_VPLMN = "OM_IN_VPLMN",
  ANONYMOUS_LOCATION_SERVICE = "ANONYMOUS_LOCATION_SERVICE",
  SPECIFIC_SERVICE = "SPECIFIC_SERVICE"
}

export enum LcsMoServiceClass {
  BASIC_SELF_LOCATION = "BASIC_SELF_LOCATION",
  AUTONOMOUS_SELF_LOCATION = "AUTONOMOUS_SELF_LOCATION",
  TRANSFER_TO_THIRD_PARTY = "TRANSFER_TO_THIRD_PARTY"
}

export enum OperationMode {
  WB_S1 = "WB_S1",
  NB_S1 = "NB_S1",
  WB_N1 = "WB_N1",
  NB_N1 = "NB_N1",
  NR_N1 = "NR_N1"
}

export enum SorUpdateIndicator {
  INITIAL_REGISTRATION = "INITIAL_REGISTRATION",
  EMERGENCY_REGISTRATION = "EMERGENCY_REGISTRATION"
}

export enum CodeWordInd {
  CODEWORD_CHECK_IN_UE = "CODEWORD_CHECK_IN_UE",
  CODEWORD_CHECK_IN_GMLC = "CODEWORD_CHECK_IN_GMLC"
}

export enum MdtUserConsent {
  CONSENT_GIVEN = "CONSENT_GIVEN",
  CONSENT_NOT_GIVEN = "CONSENT_NOT_GIVEN"
}

export enum SharedDataTreatmentInstruction {
  USE_IF_NO_CLASH = "USE_IF_NO_CLASH",
  OVERWRITE = "OVERWRITE",
  MAX = "MAX",
  MIN = "MIN"
}

export enum GpsiType {
  MSISDN = "MSISDN",
  EXT_ID = "EXT_ID",
  EXT_GROUP_ID = "EXT_GROUP_ID"
}

export enum AerialUeIndication {
  AERIAL_UE_ALLOWED = "AERIAL_UE_ALLOWED",
  AERIAL_UE_NOT_ALLOWED = "AERIAL_UE_NOT_ALLOWED"
}

export enum ProseDirectAllowed {
  ANNOUNCE = "ANNOUNCE",
  MONITOR = "MONITOR",
  RESTRICTD_ANNOUNCE = "RESTRICTD_ANNOUNCE",
  RESTRICTD_MONITOR = "RESTRICTD_MONITOR",
  DISCOVERER = "DISCOVERER",
  DISCOVEREE = "DISCOVEREE",
  BROADCAST = "BROADCAST",
  GROUPCAST = "GROUPCAST",
  UNICAST = "UNICAST",
  LAYER2_RELAY = "LAYER2_RELAY",
  LAYER3_RELAY = "LAYER3_RELAY"
}

export enum UcPurpose {
  ANALYTICS = "ANALYTICS",
  MODEL_TRAINING = "MODEL_TRAINING",
  NW_CAP_EXPOSURE = "NW_CAP_EXPOSURE",
  EDGEAPP_UE_LOCATION = "EDGEAPP_UE_LOCATION"
}

export enum UserConsent {
  CONSENT_NOT_GIVEN = "CONSENT_NOT_GIVEN",
  CONSENT_GIVEN = "CONSENT_GIVEN"
}

export enum PruInd {
  NON_PRU = "NON_PRU",
  STATIONARY_PRU = "STATIONARY_PRU",
  NON_STATIONARY_PRU = "NON_STATIONARY_PRU"
}

export interface Nssai {
  supportedFeatures?: string;
  defaultSingleNssais: Snssai[];
  singleNssais?: Snssai[];
  provisioningTime?: string;
  additionalSnssaiData?: Record<string, AdditionalSnssaiData>;
  suppressNssrgInd?: boolean;
}

export interface SdmSubscription {
  nfInstanceId: string;
  implicitUnsubscribe?: boolean;
  expires?: string;
  callbackReference: string;
  amfServiceName?: string;
  monitoredResourceUris: string[];
  singleNssai?: Snssai;
  dnn?: string;
  subscriptionId?: string;
  plmnId?: PlmnId;
  immediateReport?: boolean;
  report?: ImmediateReport;
  supportedFeatures?: string;
  contextInfo?: ContextInfo;
  nfChangeFilter?: boolean;
  uniqueSubscription?: boolean;
  resetIds?: string[];
  ueConSmfDataSubFilter?: UeContextInSmfDataSubFilter;
  dataRestorationCallbackUri?: string;
  udrRestartInd?: boolean;
}

export interface AccessAndMobilitySubscriptionData {
  supportedFeatures?: string;
  gpsis?: string[];
  internalGroupIds?: string[];
  sharedVnGroupDataIds?: Record<string, SharedDataId>;
  hssGroupId?: string;
  subscribedUeAmbr?: AmbrRm;
  nssai?: Nssai;
  ratRestrictions?: RatType[];
  forbiddenAreas?: Area[];
  serviceAreaRestriction?: ServiceAreaRestriction;
  coreNetworkTypeRestrictions?: CoreNetworkType[];
  rfspIndex?: number | null;
  subsRegTimer?: number | null;
  ueUsageType?: UeUsageType;
  mpsPriority?: MpsPriorityIndicator;
  mcsPriority?: McsPriorityIndicator;
  activeTime?: number | null;
  sorInfo?: SorInfo;
  sorInfoExpectInd?: boolean;
  sorafRetrieval?: boolean;
  sorUpdateIndicatorList?: SorUpdateIndicator[];
  upuInfo?: UpuInfo;
  routingIndicator?: string;
  micoAllowed?: MicoAllowed;
  sharedAmDataIds?: SharedDataId[];
  odbPacketServices?: string;
  subscribedDnnList?: string[];
  serviceGapTime?: number;
  mdtUserConsent?: MdtUserConsent;
  mdtConfiguration?: MdtConfiguration;
  traceData?: TraceData | null;
  cagData?: CagData;
  stnSr?: string;
  cMsisdn?: string;
  nbIoTUePriority?: NbIoTUePriority;
  nssaiInclusionAllowed?: boolean;
  rgWirelineCharacteristics?: string;
  ecRestrictionDataWb?: EcRestrictionDataWb;
  ecRestrictionDataNb?: boolean;
  expectedUeBehaviourList?: ExpectedUeBehaviourData;
  primaryRatRestrictions?: RatType[];
  secondaryRatRestrictions?: RatType[];
  edrxParametersList?: EdrxParameters[];
  ptwParametersList?: PtwParameters[];
  iabOperationAllowed?: boolean;
  adjacentPlmnRestrictions?: Record<string, PlmnRestriction>;
  wirelessForbiddenAreas?: WirelineArea[];
  wirelineServiceAreaRestriction?: WirelineServiceAreaRestriction;
  pcfSelectionAssistanceInfos?: PcfSelectionAssistanceInfo[];
  aerialUeSubInfo?: AerialUeSubscriptionInfo;
  roamingRestrictions?: RoamingRestrictions;
  remoteProvInd?: boolean;
  threeGppChargingCharacteristics?: ThreeGppChargingCharacteristics;
}

export interface SmfSelectionSubscriptionData {
  supportedFeatures?: string;
  subscribedSnssaiInfos?: Record<string, SnssaiInfo>;
  sharedSnssaiInfosId?: SharedDataId;
  hssGroupId?: string;
}

export interface DnnInfo {
  dnn: string;
  defaultDnnIndicator?: DefaultDnnIndicator;
  lboRoamingAllowed?: LboRoamingAllowed;
  iwkEpsInd?: IwkEpsInd;
  dnnBarred?: boolean;
  invokeNefInd?: boolean;
  smfList?: string[];
  sameSmfInd?: boolean;
}

export interface SnssaiInfo {
  dnnInfos: DnnInfo[];
}

export interface SessionManagementSubscriptionData {
  singleNssai: Snssai;
  dnnConfigurations?: Record<string, DnnConfiguration>;
  internalGroupIds?: string[];
  sharedVnGroupDataIds?: Record<string, SharedDataId>;
  traceData?: TraceData;
  sharedDnnConfigurationsId?: SharedDataId;
  sharedTraceDataId?: SharedDataId;
  odbPacketServices?: string;
  expectedUeBehavioursList?: Record<string, ExpectedUeBehaviourData>;
  suggestedPacketNumDlList?: Record<string, SuggestedPacketNumDl>;
  threeGppChargingCharacteristics?: ThreeGppChargingCharacteristics;
  supportedFeatures?: string;
}

export interface DnnConfiguration {
  pduSessionTypes: PduSessionTypes;
  sscModes: SscModes;
  iwkEpsInd?: IwkEpsInd;
  fiveGQosProfile?: SubscribedDefaultQos;
  sessionAmbr?: Ambr;
  threeGppChargingCharacteristics?: ThreeGppChargingCharacteristics;
  staticIpAddress?: IpAddress[];
  upSecurity?: UpSecurity;
  pduSessionContinuityInd?: PduSessionContinuityInd;
  niddNefId?: string;
  niddInfo?: NiddInformation;
  redundantSessionAllowed?: boolean;
  acsInfo?: AcsInfo;
  ipv4FrameRouteList?: FrameRouteInfo[];
  ipv6FrameRouteList?: FrameRouteInfo[];
  atsssAllowed?: boolean;
  secondaryAuth?: boolean;
  uavSecondaryAuth?: boolean;
  dnAaaIpAddressAllocation?: boolean;
  dnAaaAddress?: IpAddress;
  additionalDnAaaAddresses?: IpAddress[];
  dnAaaFqdn?: string;
  iptvAccCtrlInfo?: string;
  ipv4Index?: IpIndex;
  ipv6Index?: IpIndex;
  ecsAddrConfigInfo?: EcsAddrConfigInfo;
  additionalEcsAddrConfigInfos?: EcsAddrConfigInfo[];
  sharedEcsAddrConfigInfoId?: SharedDataId;
  additionalSharedEcsAddrConfigInfoIds?: SharedDataId[];
  easDiscoveryAuthorized?: boolean;
  onboardingInd?: boolean;
  aerialUeInd?: AerialUeIndication;
  subscribedMaxIpv6PrefixSize?: number;
}

export interface PduSessionTypes {
  defaultSessionType?: PduSessionType;
  allowedSessionTypes?: PduSessionType[];
}

export interface SscModes {
  defaultSscMode: SscMode;
  allowedSscModes?: SscMode[];
}

export interface SmsSubscriptionData {
  smsSubscribed?: SmsSubscribed;
  sharedSmsSubsDataId?: SharedDataId;
  supportedFeatures?: string;
}

export interface SmsManagementSubscriptionData {
  supportedFeatures?: string;
  mtSmsSubscribed?: boolean;
  mtSmsBarringAll?: boolean;
  mtSmsBarringRoaming?: boolean;
  moSmsSubscribed?: boolean;
  moSmsBarringAll?: boolean;
  moSmsBarringRoaming?: boolean;
  traceData?: TraceData;
  sharedSmsMngDataIds?: SharedDataId[];
}

export interface SubscriptionDataSets {
  amData?: AccessAndMobilitySubscriptionData;
  smfSelData?: SmfSelectionSubscriptionData;
  uecAmfData?: UeContextInAmfData;
  uecSmfData?: UeContextInSmfData;
  uecSmsfData?: UeContextInSmsfData;
  smsSubsData?: SmsSubscriptionData;
  smData?: SmSubsData;
  traceData?: TraceData | null;
  smsMngData?: SmsManagementSubscriptionData;
  lcsPrivacyData?: LcsPrivacyData;
  lcsMoData?: LcsMoData;
  lcsSubscriptionData?: LcsSubscriptionData;
  v2xData?: V2xSubscriptionData;
  lcsBroadcastAssistanceTypesData?: LcsBroadcastAssistanceTypesData;
  proseData?: ProseSubscriptionData;
  mbsData?: MbsSubscriptionData;
  ucData?: UcSubscriptionData;
}

export interface UeContextInSmfData {
  pduSessions?: Record<string, PduSession>;
  pgwInfo?: PgwInfo[];
  emergencyInfo?: EmergencyInfo;
}

export interface PduSession {
  dnn: string;
  smfInstanceId: string;
  plmnId: PlmnId;
  singleNssai?: Snssai;
}

export interface IdTranslationResult {
  supportedFeatures?: string;
  supi: string;
  gpsi?: string;
  additionalSupis?: string[];
  additionalGpsis?: string[];
}

export interface ModificationNotification {
  notifyItems: NotifyItem[];
}

export interface IpAddress {
  ipv4Addr?: string;
  ipv6Addr?: string;
  ipv6Prefix?: string;
}

export interface UeContextInSmsfData {
  smsfInfo3GppAccess?: SmsfInfo;
  smsfInfoNon3GppAccess?: SmsfInfo;
}

export interface SmsfInfo {
  smsfInstanceId: string;
  plmnId: PlmnId;
  smsfSetId?: string;
}

export interface AcknowledgeInfo {
  sorMacIue?: string;
  upuMacIue?: string;
  provisioningTime: string;
  sorTransparentContainer?: SorTransparentContainer;
  ueNotReachable?: boolean;
  upuTransparentContainer?: UpuTransparentContainer;
}

export interface SorInfo {
  ackInd: boolean;
  sorMacIausf?: string;
  countersor?: string;
  steeringContainer?: SteeringContainer;
  provisioningTime: string;
  sorTransparentContainer?: SorTransparentContainer;
  sorCmci?: SorCmci;
  storeSorCmciInMe?: boolean;
  usimSupportOfSorCmci?: boolean;
}

export interface SharedData {
  sharedDataId: SharedDataId;
  sharedAmData?: AccessAndMobilitySubscriptionData;
  sharedSmsSubsData?: SmsSubscriptionData;
  sharedSmsMngSubsData?: SmsManagementSubscriptionData;
  sharedDnnConfigurations?: Record<string, DnnConfiguration>;
  sharedTraceData?: TraceData;
  sharedSnssaiInfos?: Record<string, SnssaiInfo>;
  sharedVnGroupDatas?: Record<string, VnGroupData>;
  treatmentInstructions?: Record<string, SharedDataTreatmentInstruction>;
  sharedSmSubsData?: SessionManagementSubscriptionData;
  sharedEcsAddrConfigInfo?: EcsAddrConfigInfo;
}

export interface PgwInfo {
  dnn: string;
  pgwFqdn: string;
  pgwIpAddr?: IpAddress;
  plmnId?: PlmnId;
  epdgInd?: boolean;
  pcfId?: string;
  registrationTime?: string;
}

export interface TraceDataResponse {
  traceData?: TraceData;
  sharedTraceDataId?: SharedDataId;
}

export type SteeringContainer = SteeringInfo[] | SecuredPacket;

export interface SdmSubsModification {
  expires?: string;
  monitoredResourceUris?: string[];
}

export interface EmergencyInfo {
  pgwFqdn?: string;
  pgwIpAddress?: IpAddress;
  smfInstanceId?: string;
  epdgInd?: boolean;
  plmnId?: PlmnId;
}

export interface UpuInfo {
  upuDataList?: UpuData[];
  upuRegInd?: UpuRegInd;
  upuAckInd?: boolean;
  upuMacIausf?: string;
  counterUpu?: string;
  provisioningTime: string;
  upuTransparentContainer?: UpuTransparentContainer;
}

export interface GroupIdentifiers {
  extGroupId?: ExtGroupId;
  intGroupId?: string;
  ueIdList?: UeId[];
}

export interface NiddInformation {
  afId: string;
  gpsi?: string;
  extGroupId?: string;
}

export interface CagData {
  cagInfos: Record<string, CagInfo>;
  provisioningTime?: string;
}

export interface CagInfo {
  allowedCagList: string[];
  cagOnlyIndicator?: boolean;
}

export interface AdditionalSnssaiData {
  requiredAuthnAuthz?: boolean;
  subscribedUeSliceMbr?: SliceMbrRm;
  subscribedNsSrgList?: string[];
}

export interface VnGroupData {
  pduSessionTypes: PduSessionTypes;
  dnn?: string;
  singleNssai?: Snssai;
  appDescriptors?: AppDescriptor[];
}

export interface AppDescriptor {
  osId?: string;
  appId?: string;
}

export interface AppPortId {
  destinationPort?: number;
  originatorPort?: number;
}

export interface LcsPrivacyData {
  lpi?: Lpi;
  unrelatedClass?: UnrelatedClass;
  plmnOperatorClasses?: PlmnOperatorClass[];
}

export interface Lpi {
  locationPrivacyInd: LocationPrivacyInd;
  validTimePeriod?: ValidTimePeriod;
}

export interface UnrelatedClass {
  defaultUnrelatedClass: DefaultUnrelatedClass;
  externalUnrelatedClass?: ExternalUnrelatedClass;
  serviceTypeUnrelatedClasses?: ServiceTypeUnrelatedClass[];
}

export interface PlmnOperatorClass {
  lcsClientClass: LcsClientClass;
  lcsClientIds: LcsClientId[];
}

export interface ValidTimePeriod {
  startTime?: string;
  endTime?: string;
}

export interface LcsMoData {
  allowedServiceClasses: LcsMoServiceClass[];
  moAssistanceDataTypes?: LcsBroadcastAssistanceTypesData;
}

export interface LcsSubscriptionData {
  configuredLmfId?: string;
  pruInd?: PruInd;
  lpHapType?: string;
  userPlanePosIndLmf?: boolean;
}

export interface EcRestrictionDataWb {
  ecModeARestricted?: boolean;
  ecModeBRestricted?: boolean;
}

export interface ExpectedUeBehaviourData {
  stationaryIndication?: StationaryIndication;
  communicationDurationTime?: number;
  periodicTime?: number;
  scheduledCommunicationTime?: ScheduledCommunicationTime;
  scheduledCommunicationType?: ScheduledCommunicationType;
  expectedUmts?: LocationArea[];
  trafficProfile?: TrafficProfile;
  batteryIndication?: BatteryIndication;
  validityTime?: string;
}

export interface SuggestedPacketNumDl {
  suggestedPacketNumDl: number;
  validityTime?: string;
}

export interface FrameRouteInfo {
  ipv4Mask?: string;
  ipv6Prefix?: string;
}

export interface SorUpdateInfo {
  vplmnId: PlmnId;
  supportedFeatures?: string;
}

export interface EnhancedCoverageRestrictionData {
  plmnEcInfoList?: PlmnEcInfo[];
}

export interface EdrxParameters {
  ratType: RatType;
  edrxValue: string;
}

export interface PtwParameters {
  operationMode: OperationMode;
  ptwValue: string;
  extendedPtwValue?: string;
}

export interface ExternalUnrelatedClass {
  lcsClientExternals?: LcsClientExternal[];
  afExternals?: AfExternal[];
  lcsClientGroupExternals?: LcsClientGroupExternal[];
}

export interface AfExternal {
  afId?: AfId;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface LcsClientExternal {
  lcsClientId?: LcsClientId;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface LcsClientGroupExternal {
  lcsClientGroupId?: ExtGroupId;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface ServiceTypeUnrelatedClass {
  serviceType: LcsServiceType;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  codeWordInd?: CodeWordInd;
  validTimePeriod?: ValidTimePeriod;
  codeWordList?: CodeWord[];
}

export interface UeId {
  supi: string;
  gpsiList?: string[];
}

export interface DefaultUnrelatedClass {
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  codeWordInd?: CodeWordInd;
  validTimePeriod?: ValidTimePeriod;
  codeWordList?: CodeWord[];
}

export interface ContextInfo {
  origHeaders?: string[];
  requestHeaders?: string[];
}

export interface UeContextInAmfData {
  epsInterworkingInfo?: EpsInterworkingInfo;
  amfInfo?: AmfInfo[];
}

export interface V2xSubscriptionData {
  nrV2xServicesAuth?: NrV2xAuth;
  lteV2xServicesAuth?: LteV2xAuth;
  nrUePc5Ambr?: string;
  ltePc5Ambr?: string;
}

export interface LcsBroadcastAssistanceTypesData {
  locationAssistanceType: string;
}

export interface DatasetNames {
  datasetNames: DataSetName[];
}

export interface PlmnRestriction {
  ratRestrictions?: RatType[];
  forbiddenAreas?: Area[];
  serviceAreaRestriction?: ServiceAreaRestriction;
  coreNetworkTypeRestrictions?: CoreNetworkType[];
  primaryRatRestrictions?: RatType[];
  secondaryRatRestrictions?: RatType[];
}

export interface PcfSelectionAssistanceInfo {
  dnn: string;
  singleNssai: Snssai;
}

export interface ProseSubscriptionData {
  proseServiceAuth?: ProseServiceAuth;
  nrUePc5Ambr?: string;
  proseAllowedPlmn?: ProSeAllowedPlmn[];
}

export type IpIndex = number | string;

export interface AerialUeSubscriptionInfo {
  aerialUeInd: AerialUeIndication;
  threeGppUavId?: string;
}

export type SmSubsData = SessionManagementSubscriptionData[] | ExtendedSmSubsData;

export interface ExtendedSmSubsData {
  individualSmSubsData?: SessionManagementSubscriptionData[];
  sharedSmSubsDataIds: SharedDataId[];
}

export interface AmfInfo {
  amfInstanceId: string;
  guami: Guami;
  accessType: AccessType;
}

export interface ProSeAllowedPlmn {
  visitedPlmn: PlmnId;
  proseDirectAllowed?: ProseDirectAllowed[];
}

export type ImmediateReport = SubscriptionDataSets | SharedData[];

export interface MbsSubscriptionData {
  mbsAllowed?: boolean;
  mbsSessionIdList?: string[];
}

export interface UcSubscriptionData {
  userConsentPerPurposeList?: Record<string, UserConsent>;
}

export interface UeContextInSmfDataSubFilter {
  dnnList?: string[];
  snssaiList?: Snssai[];
  emergencyInd?: boolean;
}

export interface UeIdentifiers {
  ueIdList?: Record<string, SupiInfo>;
}

export interface SupiInfo {
  supiList: string[];
}

export interface Guami {
  plmnId: PlmnId;
  amfId: string;
}

export enum CoreNetworkType {
  FIVE_GC = "5GC",
  EPC = "EPC"
}

export enum SscMode {
  SSC_MODE_1 = "SSC_MODE_1",
  SSC_MODE_2 = "SSC_MODE_2",
  SSC_MODE_3 = "SSC_MODE_3"
}

export interface Ambr {
  uplink: string;
  downlink: string;
}

export interface AmbrRm {
  uplink: string;
  downlink: string;
}

export interface SliceMbrRm {
  uplink: string;
  downlink: string;
}

export interface SubscribedDefaultQos {
  fiveQi: number;
  arp?: Arp;
  priorityLevel?: number;
}

export interface Arp {
  priorityLevel: number;
  preemptCap: PreemptionCapability;
  preemptVuln: PreemptionVulnerability;
}

export enum PreemptionCapability {
  NOT_PREEMPT = "NOT_PREEMPT",
  MAY_PREEMPT = "MAY_PREEMPT"
}

export enum PreemptionVulnerability {
  NOT_PREEMPTABLE = "NOT_PREEMPTABLE",
  PREEMPTABLE = "PREEMPTABLE"
}

export interface Area {
  tacs?: string[];
  areaCodes?: string;
}

export interface ServiceAreaRestriction {
  restrictionType?: RestrictionType;
  areas?: Area[];
  maxNumOfTAs?: number;
  maxNumOfTAsForNotAllowedAreas?: number;
}

export enum RestrictionType {
  ALLOWED_AREAS = "ALLOWED_AREAS",
  NOT_ALLOWED_AREAS = "NOT_ALLOWED_AREAS"
}

export interface MdtConfiguration {
  jobType: JobType;
  reportType?: ReportType;
  areaScope?: AreaScope;
  measurementLteList?: string[];
  measurementNrList?: string[];
  sensorNameList?: string[];
  reportingTriggerList?: string[];
  reportInterval?: ReportInterval;
  reportAmount?: ReportAmount;
  eventThresholdRsrp?: number;
  eventThresholdRsrq?: number;
  logginDuration?: LoggingDuration;
  loggingInterval?: LoggingInterval;
  positioningMethod?: PositioningMethod;
  addPositioningMethodList?: PositioningMethod[];
  collectionPeriodRmmLte?: CollectionPeriodRmmLte;
  collectionPeriodRmmNr?: CollectionPeriodRmmNr;
  measurementPeriodLte?: MeasurementPeriodLte;
  mdtAllowedPlmnIdList?: PlmnId[];
  mbsfnAreaList?: MbsfnArea[];
  interFreqTargetList?: string[];
  areaConfigurationList?: AreaConfiguration[];
}

export enum JobType {
  IMMEDIATE_MDT_ONLY = "IMMEDIATE_MDT_ONLY",
  LOGGED_MDT_ONLY = "LOGGED_MDT_ONLY",
  TRACE_ONLY = "TRACE_ONLY",
  IMMEDIATE_MDT_AND_TRACE = "IMMEDIATE_MDT_AND_TRACE",
  RLF_REPORT_ONLY = "RLF_REPORT_ONLY",
  RCEF_REPORT_ONLY = "RCEF_REPORT_ONLY",
  LOGGED_MBSFN_MDT = "LOGGED_MBSFN_MDT"
}

export interface TraceData {
  traceRef: string;
  traceDepth: TraceDepth;
  neTypeList: string;
  eventList: string;
  collectionEntityIpv4Addr?: string;
  collectionEntityIpv6Addr?: string;
  interfaceList?: string;
}

export enum TraceDepth {
  MINIMUM = "MINIMUM",
  MEDIUM = "MEDIUM",
  MAXIMUM = "MAXIMUM",
  MINIMUM_WO_VENDOR_EXT = "MINIMUM_WO_VENDOR_EXT",
  MEDIUM_WO_VENDOR_EXT = "MEDIUM_WO_VENDOR_EXT",
  MAXIMUM_WO_VENDOR_EXT = "MAXIMUM_WO_VENDOR_EXT"
}

export interface EpsInterworkingInfo {
  epsIwkPgws?: Record<string, EpsIwkPgw>;
}

export interface EpsIwkPgw {
  pgwFqdn: string;
  smfInstanceId: string;
  plmnId?: PlmnId;
}

export interface SteeringInfo {
  plmnId: PlmnId;
  accessTechList?: AccessTech[];
}

export enum AccessTech {
  NR = "NR",
  EUTRAN_IN_WBS1_MODE_AND_NBS1_MODE = "EUTRAN_IN_WBS1_MODE_AND_NBS1_MODE",
  EUTRAN_IN_WBS1_MODE = "EUTRAN_IN_WBS1_MODE",
  EUTRAN_IN_NBS1_MODE = "EUTRAN_IN_NBS1_MODE",
  UTRAN = "UTRAN",
  GSM_AND_ECGSM_IoT = "GSM_AND_ECGSM_IoT",
  GSM_WITHOUT_ECGSM_IoT = "GSM_WITHOUT_ECGSM_IoT",
  ECGSM_IoT_ONLY = "ECGSM_IoT_ONLY",
  CDMA_1xRTT = "CDMA_1xRTT",
  CDMA_HRPD = "CDMA_HRPD",
  CDMA_EHRPD = "CDMA_EHRPD"
}

export interface UpuData {
  secPacket?: string;
  defaultConfNssai?: Snssai[];
  routingId?: string;
  disasterRoamingEnabled?: boolean;
  useOfPduSessInd?: boolean;
}

export interface NotifyItem {
  resourceId: string;
  changes?: ChangeItem[];
}

export interface ChangeItem {
  op: ChangeType;
  path: string;
  from?: string;
  origValue?: any;
  newValue?: any;
}

export enum ChangeType {
  ADD = "add",
  REMOVE = "remove",
  REPLACE = "replace",
  MOVE = "move",
  COPY = "copy"
}

export interface UpSecurity {
  upIntegr: UpIntegrity;
  upConfid: UpConfidentiality;
}

export enum UpIntegrity {
  REQUIRED = "REQUIRED",
  PREFERRED = "PREFERRED",
  NOT_NEEDED = "NOT_NEEDED"
}

export enum UpConfidentiality {
  REQUIRED = "REQUIRED",
  PREFERRED = "PREFERRED",
  NOT_NEEDED = "NOT_NEEDED"
}

export interface AcsInfo {
  acsUrl?: string;
  acsIpv4Addr?: string;
  acsIpv6Addr?: string;
}

export interface EcsAddrConfigInfo {
  ecsServerAddr: EcsServerAddr;
  spatialValidityCond?: SpatialValidityCond;
}

export interface EcsServerAddr {
  ecsServerAddrString?: string;
  ecsServerAddrFqdn?: string;
}

export interface SpatialValidityCond {
  countries?: string[];
  trackingAreaList?: Tai[];
}

export interface Tai {
  plmnId: PlmnId;
  tac: string;
}

export interface NrV2xAuth {
  vehicleUe?: boolean;
  pedestrianUe?: boolean;
  v2xPermission?: V2xPermission;
}

export interface LteV2xAuth {
  vehicleUe?: boolean;
  pedestrianUe?: boolean;
  v2xPermission?: V2xPermission;
}

export interface V2xPermission {
  v2xCommunicationPermission?: boolean;
  v2xMessagingPermission?: boolean;
}

export interface ProseServiceAuth {
  proseDirectDiscoveryAuth?: boolean;
  proseDirectCommunicationAuth?: boolean;
  proseL2RelayAuth?: boolean;
  proseL3RelayAuth?: boolean;
  proseL2RemoteAuth?: boolean;
}

export interface RoamingRestrictions {
  supportedFeatures?: string;
}

export interface WirelineArea {
  globalLineIds?: string[];
  hfcNIds?: string[];
}

export interface WirelineServiceAreaRestriction {
  restrictionType?: RestrictionType;
  areas?: WirelineArea[];
}

export interface GeographicArea {
  [key: string]: any;
}

export interface LocationArea {
  [key: string]: any;
}

export interface LcsServiceType {
  [key: string]: any;
}

export interface ScheduledCommunicationTime {
  [key: string]: any;
}

export interface ScheduledCommunicationType {
  [key: string]: any;
}

export interface StationaryIndication {
  [key: string]: any;
}

export interface TrafficProfile {
  [key: string]: any;
}

export interface BatteryIndication {
  [key: string]: any;
}

export interface PlmnEcInfo {
  [key: string]: any;
}

export interface AreaScope {
  [key: string]: any;
}

export enum ReportType {
  PERIODICAL = "PERIODICAL",
  EVENT_TRIGGERED = "EVENT_TRIGGERED"
}

export enum ReportInterval {
  UMTS_250_MS = "UMTS_250_MS",
  UMTS_500_MS = "UMTS_500_MS",
  UMTS_1000_MS = "UMTS_1000_MS",
  UMTS_2000_MS = "UMTS_2000_MS",
  UMTS_3000_MS = "UMTS_3000_MS",
  UMTS_4000_MS = "UMTS_4000_MS",
  UMTS_6000_MS = "UMTS_6000_MS",
  UMTS_8000_MS = "UMTS_8000_MS",
  UMTS_12000_MS = "UMTS_12000_MS",
  UMTS_16000_MS = "UMTS_16000_MS",
  UMTS_20000_MS = "UMTS_20000_MS",
  UMTS_24000_MS = "UMTS_24000_MS",
  UMTS_28000_MS = "UMTS_28000_MS",
  UMTS_32000_MS = "UMTS_32000_MS",
  UMTS_64000_MS = "UMTS_64000_MS",
  LTE_120_MS = "LTE_120_MS",
  LTE_240_MS = "LTE_240_MS",
  LTE_480_MS = "LTE_480_MS",
  LTE_640_MS = "LTE_640_MS",
  LTE_1024_MS = "LTE_1024_MS",
  LTE_2048_MS = "LTE_2048_MS",
  LTE_5120_MS = "LTE_5120_MS",
  LTE_10240_MS = "LTE_10240_MS",
  LTE_60000_MS = "LTE_60000_MS",
  LTE_360000_MS = "LTE_360000_MS",
  LTE_720000_MS = "LTE_720000_MS",
  LTE_1800000_MS = "LTE_1800000_MS",
  LTE_3600000_MS = "LTE_3600000_MS",
  NR_120_MS = "NR_120_MS",
  NR_240_MS = "NR_240_MS",
  NR_480_MS = "NR_480_MS",
  NR_640_MS = "NR_640_MS",
  NR_1024_MS = "NR_1024_MS",
  NR_2048_MS = "NR_2048_MS",
  NR_5120_MS = "NR_5120_MS",
  NR_10240_MS = "NR_10240_MS",
  NR_20480_MS = "NR_20480_MS",
  NR_40960_MS = "NR_40960_MS",
  NR_60000_MS = "NR_60000_MS",
  NR_360000_MS = "NR_360000_MS",
  NR_720000_MS = "NR_720000_MS",
  NR_1800000_MS = "NR_1800000_MS",
  NR_3600000_MS = "NR_3600000_MS"
}

export enum ReportAmount {
  R1 = "1",
  R2 = "2",
  R4 = "4",
  R8 = "8",
  R16 = "16",
  R32 = "32",
  R64 = "64",
  INFINITY = "infinity"
}

export enum LoggingDuration {
  D600_SEC = "600_SEC",
  D1200_SEC = "1200_SEC",
  D2400_SEC = "2400_SEC",
  D3600_SEC = "3600_SEC",
  D5400_SEC = "5400_SEC",
  D7200_SEC = "7200_SEC"
}

export enum LoggingInterval {
  I1280_MS = "1280_MS",
  I2560_MS = "2560_MS",
  I5120_MS = "5120_MS",
  I10240_MS = "10240_MS",
  I20480_MS = "20480_MS",
  I30720_MS = "30720_MS",
  I40960_MS = "40960_MS",
  I61440_MS = "61440_MS"
}

export enum PositioningMethod {
  CELLID = "CELLID",
  ECID = "ECID",
  OTDOA = "OTDOA",
  BAROMETRIC_PRESSURE = "BAROMETRIC_PRESSURE",
  WLAN = "WLAN",
  BLUETOOTH = "BLUETOOTH",
  MBS = "MBS",
  MOTION_SENSOR = "MOTION_SENSOR",
  DL_TDOA = "DL_TDOA",
  DL_AOD = "DL_AOD",
  MULTI_RTT = "MULTI_RTT",
  NR_ECID = "NR_ECID",
  UL_TDOA = "UL_TDOA",
  UL_AOA = "UL_AOA",
  NETWORK_SPECIFIC = "NETWORK_SPECIFIC"
}

export enum CollectionPeriodRmmLte {
  M1024_MS = "1024_MS",
  M2048_MS = "2048_MS",
  M5120_MS = "5120_MS",
  M10240_MS = "10240_MS",
  M60000_MS = "60000_MS"
}

export enum CollectionPeriodRmmNr {
  M1024_MS = "1024_MS",
  M2048_MS = "2048_MS",
  M5120_MS = "5120_MS",
  M10240_MS = "10240_MS",
  M20480_MS = "20480_MS",
  M60000_MS = "60000_MS"
}

export enum MeasurementPeriodLte {
  M1024_MS = "1024_MS",
  M2048_MS = "2048_MS",
  M5120_MS = "5120_MS",
  M10240_MS = "10240_MS",
  M60000_MS = "60000_MS"
}

export interface MbsfnArea {
  mbsfnAreaId?: number;
  carrierFreq?: number;
}

export interface AreaConfiguration {
  [key: string]: any;
}
