// 3GPP TS 29.503 version 17.12.0 Release 17
// Section 6.?.6
// https://www.etsi.org/deliver/etsi_ts/129500_129599/129503/17.12.00_60/ts_129503v171200p.pdf

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
  OVERWRITE = "OVERWRITE",
  MERGE_ADD = "MERGE_ADD"
}

export enum GpsiType {
  MSISDN = "MSISDN",
  EXTERNAL_ID = "EXTERNAL_ID"
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
  L2_RELAY = "L2_RELAY",
  L3_RELAY = "L3_RELAY",
  L2_REMOTE = "L2_REMOTE",
  L3_REMOTE = "L3_REMOTE"
}

export enum UcPurpose {
  LOCATION_PRIVACY = "LOCATION_PRIVACY"
}

export enum UserConsent {
  CONSENT_GIVEN = "CONSENT_GIVEN",
  CONSENT_NOT_GIVEN = "CONSENT_NOT_GIVEN"
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
  subscribedUeAmbr?: Ambr;
  nssai?: Nssai;
  ratRestrictions?: RatType[];
  forbiddenAreas?: Area[];
  serviceAreaRestriction?: ServiceAreaRestriction;
  coreNetworkTypeRestrictions?: CoreNetworkType[];
  rfspIndex?: number;
  subsRegTimer?: number;
  ueUsageType?: UeUsageType;
  mpsPriority?: MpsPriorityIndicator;
  mcsPriority?: McsPriorityIndicator;
  activeTime?: number;
  sorInfo?: SorInfo;
  sorInfoExpectInd?: boolean;
  sorafRetrieval?: boolean;
  sorUpdateIndicatorList?: SorUpdateIndicator[];
  upuInfo?: UpuInfo;
  routingIndicator?: string;
  micoAllowed?: MicoAllowed;
  sharedAmDataIds?: SharedDataId[];
  odbPacketServices?: OdbPacketServices;
  subscribedDnnList?: string[];
  serviceGapTime?: number;
  mdtUserConsent?: MdtUserConsent;
  mdtConfiguration?: MdtConfiguration;
  traceData?: TraceData;
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
  odbPacketServices?: OdbPacketServices;
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
  traceData?: TraceData;
  smsMngData?: SmsManagementSubscriptionData;
  lcsPrivacyData?: LcsPrivacyData;
  lcsM oData?: LcsMoData;
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
  steeringContainer?: SteeringContainer;
  ackInd: boolean;
  sorMacIausf?: string;
  countersor?: string;
  provisioningTime: string;
  sorTransparentInfo?: string;
  steeringInfoList?: SteeringInfo[];
  sorCmci?: SorCmci;
}

export interface SharedData {
  sharedDataId: string;
  sharedAmData?: AccessAndMobilitySubscriptionData;
  sharedSmsSubsData?: SmsSubscriptionData;
  sharedSmsMngSubsData?: SmsManagementSubscriptionData;
  sharedDnnConfigurations?: Record<string, DnnConfiguration>;
  sharedTraceData?: TraceData;
  sharedSnssaiInfos?: Record<string, SnssaiInfo>;
  sharedVnGroupDatas?: Record<string, VnGroupData>;
  treatmentInstructions?: Record<string, SharedDataTreatmentInstruction>;
}

export interface PgwInfo {
  dnn: string;
  pgwFqdn: string;
  plmnId?: PlmnId;
}

export interface TraceDataResponse {
  traceData?: TraceData;
  sharedTraceDataId?: SharedDataId;
}

export interface SteeringContainer {
  [key: string]: any;
}

export interface SdmSubsModification {
  expires?: string;
  monitoredResourceUris?: string[];
}

export interface EmergencyInfo {
  pgwFqdn?: string;
  pgwIpAddress?: IpAddress;
  smfInstanceId?: string;
  smfSetId?: string;
  plmnId?: PlmnId;
}

export interface UpuInfo {
  upuData: UpuData;
  upuRegInd?: UpuRegInd;
  upuAckInd?: boolean;
  upuMacIausf?: string;
  counterUpu?: string;
  provisioningTime: string;
  upuTransparentInfo?: string;
  upuHeader?: string;
}

export interface GroupIdentifiers {
  extGroupIds?: ExtGroupId[];
  intGroupIds?: string[];
}

export interface NiddInformation {
  afId?: AfId;
  gpsi?: string;
  extGroupId?: ExtGroupId;
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
  nssrgs?: string[];
}

export interface VnGroupData {
  dnn: string;
  sNssai: Snssai;
  pduSessionTypes?: PduSessionTypes;
  appDescriptors?: AppDescriptor[];
}

export interface AppDescriptor {
  osId?: string;
  appId: string;
}

export interface AppPortId {
  destinationPort?: number;
  originatorPort?: number;
}

export interface LcsPrivacyData {
  lpi?: Lpi;
  unrelatedClass?: UnrelatedClass;
  plmnOperatorClasses?: Record<string, PlmnOperatorClass>;
}

export interface Lpi {
  locationPrivacyInd: LocationPrivacyInd;
  validTimePeriod?: ValidTimePeriod;
}

export interface UnrelatedClass {
  lcsClientType: LcsClientClass;
  lcsClientIds?: LcsClientId[];
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  codeWordInd?: CodeWordInd;
  validTimePeriod?: ValidTimePeriod;
}

export interface PlmnOperatorClass {
  lcsClientIds?: LcsClientId[];
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface ValidTimePeriod {
  startTime?: string;
  endTime?: string;
}

export interface LcsMoData {
  lcsServiceTypeList?: LcsServiceType[];
}

export interface EcRestrictionDataWb {
  ecRestricted?: boolean;
  ecModeARestricted?: boolean;
  ecModeBRestricted?: boolean;
}

export interface ExpectedUeBehaviourData {
  stationaryIndication?: StationaryIndication;
  communicationDurationTime?: number;
  periodicTime?: number;
  scheduledCommunicationType?: ScheduledCommunicationType;
  scheduledCommunicationTime?: ScheduledCommunicationTime;
  expectedUmts?: GeographicArea[];
  trafficProfile?: TrafficProfile;
  batteryIndication?: BatteryIndication;
  validityTime?: string;
}

export interface SuggestedPacketNumDl {
  suggestedPacketNumDl?: number;
  validityTime?: string;
}

export interface FrameRouteInfo {
  ipv4Mask?: string;
  ipv6Prefix?: string;
}

export interface SorUpdateInfo {
  vplmnId?: PlmnId;
  macSor?: string;
}

export interface EnhancedCoverageRestrictionData {
  plmnEcInfos?: Record<string, PlmnEcInfo>;
}

export interface EdrxParameters {
  ratType: RatType;
  edrxValue: string;
}

export interface PtwParameters {
  ratType: RatType;
  ptwValue: string;
}

export interface ExternalUnrelatedClass {
  lcsClientExternal?: LcsClientExternal;
  afExternal?: AfExternal;
  lcsClientType: LcsClientClass;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  codeWordInd?: CodeWordInd;
  validTimePeriod?: ValidTimePeriod;
}

export interface AfExternal {
  afId: AfId;
  afEventsIds?: string[];
  applicationPort?: AppPortId;
  allowedGpsis?: string[];
}

export interface LcsClientExternal {
  lcsClientExtId?: LcsClientId;
  lcsClientExtType?: LcsClientClass;
  lcsClientGroupExtIds?: string[];
}

export interface LcsClientGroupExternal {
  lcsClientGroupId?: string;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface ServiceTypeUnrelatedClass {
  lcsServiceType: LcsServiceType;
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  codeWordInd?: CodeWordInd;
  codeWord?: CodeWord;
  validTimePeriod?: ValidTimePeriod;
}

export interface UeId {
  supi?: string;
  gpsi?: string[];
}

export interface DefaultUnrelatedClass {
  allowedGeographicArea?: GeographicArea[];
  privacyCheckRelatedAction?: PrivacyCheckRelatedAction;
  validTimePeriod?: ValidTimePeriod;
}

export interface ContextInfo {
  [key: string]: any;
}

export interface UeContextInAmfData {
  amfInfo?: AmfInfo;
}

export interface V2xSubscriptionData {
  nrV2xServicesAuth?: NrV2xAuth;
  lteV2xServicesAuth?: LteV2xAuth;
  nrUeSidelinkAggregateMaxBitrate?: string;
  lteUeSidelinkAggregateMaxBitrate?: string;
}

export interface LcsBroadcastAssistanceTypesData {
  locationAssistanceTypes: number[];
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

export interface IpIndex {
  indexValue?: number | string;
}

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

export interface PlmnId {
  mcc: string;
  mnc: string;
}

export interface Snssai {
  sst: number;
  sd?: string;
}

export interface Guami {
  plmnId: PlmnId;
  amfId: string;
}

export enum AccessType {
  THREE_GPP_ACCESS = "3GPP_ACCESS",
  NON_3GPP_ACCESS = "NON_3GPP_ACCESS",
  THREE_GPP_AND_NON_3GPP = "3GPP_AND_NON_3GPP"
}

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

export enum CoreNetworkType {
  FIVE_GC = "5GC",
  EPC = "EPC"
}

export enum PduSessionType {
  IPV4 = "IPV4",
  IPV6 = "IPV6",
  IPV4V6 = "IPV4V6",
  UNSTRUCTURED = "UNSTRUCTURED",
  ETHERNET = "ETHERNET"
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
  [key: string]: any;
}

export interface ServiceAreaRestriction {
  [key: string]: any;
}

export interface WirelineArea {
  [key: string]: any;
}

export interface WirelineServiceAreaRestriction {
  [key: string]: any;
}

export interface OdbPacketServices {
  [key: string]: any;
}

export interface MdtConfiguration {
  [key: string]: any;
}

export interface TraceData {
  [key: string]: any;
}

export interface UpSecurity {
  [key: string]: any;
}

export interface AcsInfo {
  [key: string]: any;
}

export interface EcsAddrConfigInfo {
  [key: string]: any;
}

export interface NotifyItem {
  [key: string]: any;
}

export interface UpuData {
  [key: string]: any;
}

export interface SteeringInfo {
  [key: string]: any;
}

export interface GeographicArea {
  [key: string]: any;
}

export interface LcsServiceType {
  [key: string]: any;
}

export interface StationaryIndication {
  [key: string]: any;
}

export interface ScheduledCommunicationType {
  [key: string]: any;
}

export interface ScheduledCommunicationTime {
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

export interface NrV2xAuth {
  [key: string]: any;
}

export interface LteV2xAuth {
  [key: string]: any;
}

export interface ProseServiceAuth {
  [key: string]: any;
}

export interface RoamingRestrictions {
  [key: string]: any;
}
