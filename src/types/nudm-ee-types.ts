export type MaxNumOfReports = number;

export type ReferenceId = number;

export enum EventType {
  LOSS_OF_CONNECTIVITY = "LOSS_OF_CONNECTIVITY",
  UE_REACHABILITY_FOR_DATA = "UE_REACHABILITY_FOR_DATA",
  UE_REACHABILITY_FOR_SMS = "UE_REACHABILITY_FOR_SMS",
  LOCATION_REPORTING = "LOCATION_REPORTING",
  CHANGE_OF_SUPI_PEI_ASSOCIATION = "CHANGE_OF_SUPI_PEI_ASSOCIATION",
  ROAMING_STATUS = "ROAMING_STATUS",
  COMMUNICATION_FAILURE = "COMMUNICATION_FAILURE",
  AVAILABILITY_AFTER_DDN_FAILURE = "AVAILABILITY_AFTER_DDN_FAILURE",
  CN_TYPE_CHANGE = "CN_TYPE_CHANGE",
  DL_DATA_DELIVERY_STATUS = "DL_DATA_DELIVERY_STATUS",
  PDN_CONNECTIVITY_STATUS = "PDN_CONNECTIVITY_STATUS",
  UE_CONNECTION_MANAGEMENT_STATE = "UE_CONNECTION_MANAGEMENT_STATE",
  ACCESS_TYPE_REPORT = "ACCESS_TYPE_REPORT",
  REGISTRATION_STATE_REPORT = "REGISTRATION_STATE_REPORT",
  CONNECTIVITY_STATE_REPORT = "CONNECTIVITY_STATE_REPORT",
  TYPE_ALLOCATION_CODE_REPORT = "TYPE_ALLOCATION_CODE_REPORT",
  FREQUENT_MOBILITY_REGISTRATION_REPORT = "FREQUENT_MOBILITY_REGISTRATION_REPORT",
  PDU_SES_REL = "PDU_SES_REL",
  PDU_SES_EST = "PDU_SES_EST",
  UE_MEMORY_AVAILABLE_FOR_SMS = "UE_MEMORY_AVAILABLE_FOR_SMS"
}

export enum LocationAccuracy {
  CELL_LEVEL = "CELL_LEVEL",
  RAN_NODE_LEVEL = "RAN_NODE_LEVEL",
  TA_LEVEL = "TA_LEVEL",
  N3IWF_LEVEL = "N3IWF_LEVEL",
  UE_IP = "UE_IP",
  UE_PORT = "UE_PORT"
}

export enum CnType {
  SINGLE_4G = "SINGLE_4G",
  SINGLE_5G = "SINGLE_5G",
  DUAL_4G5G = "DUAL_4G5G"
}

export enum AssociationType {
  IMEI_CHANGE = "IMEI_CHANGE",
  IMEISV_CHANGE = "IMEISV_CHANGE"
}

export enum EventReportMode {
  PERIODIC = "PERIODIC",
  ON_EVENT_DETECTION = "ON_EVENT_DETECTION"
}

export enum ReachabilityForSmsConfiguration {
  REACHABILITY_FOR_SMS_OVER_NAS = "REACHABILITY_FOR_SMS_OVER_NAS",
  REACHABILITY_FOR_SMS_OVER_IP = "REACHABILITY_FOR_SMS_OVER_IP"
}

export enum PdnConnectivityStatus {
  ESTABLISHED = "ESTABLISHED",
  RELEASED = "RELEASED"
}

export enum ReachabilityForDataReportConfig {
  DIRECT_REPORT = "DIRECT_REPORT",
  INDIRECT_REPORT = "INDIRECT_REPORT"
}

export enum RevokedCause {
  NOT_ALLOWED = "NOT_ALLOWED",
  EXCLUDED_FROM_GROUP = "EXCLUDED_FROM_GROUP",
  GPSI_REMOVED = "GPSI_REMOVED"
}

export enum FailedCause {
  AF_NOT_ALLOWED = "AF_NOT_ALLOWED",
  MTC_PROVIDER_NOT_ALLOWED = "MTC_PROVIDER_NOT_ALLOWED",
  MONITORING_NOT_ALLOWED = "MONITORING_NOT_ALLOWED",
  UNSUPPORTED_MONITORING_EVENT_TYPE = "UNSUPPORTED_MONITORING_EVENT_TYPE",
  UNSUPPORTED_MONITORING_REPORT_OPTIONS = "UNSUPPORTED_MONITORING_REPORT_OPTIONS",
  UNSPECIFIED = "UNSPECIFIED"
}

export interface EeSubscription {
  callbackReference: string;
  monitoringConfigurations: Record<string, MonitoringConfiguration>;
  reportingOptions?: ReportingOptions;
  supportedFeatures?: string;
  subscriptionId?: string;
  contextInfo?: ContextInfo;
  epcAppliedInd?: boolean;
  scefDiamHost?: string;
  scefDiamRealm?: string;
  notifyCorrelationId?: string;
  secondCallbackRef?: string;
  gpsi?: string;
  excludeGpsiList?: string[];
  includeGpsiList?: string[];
  dataRestorationCallbackUri?: string;
  udrRestartInd?: boolean;
}

export interface MonitoringConfiguration {
  eventType: EventType;
  immediateFlag?: boolean;
  locationReportingConfiguration?: LocationReportingConfiguration;
  associationType?: AssociationType;
  datalinkReportCfg?: DatalinkReportingConfiguration;
  lossConnectivityCfg?: LossConnectivityCfg;
  maximumLatency?: number;
  maximumResponseTime?: number;
  suggestedPacketNumDl?: number;
  dnn?: string;
  singleNssai?: Snssai;
  reachabilityForDataCfg?: ReachabilityForDataConfiguration;
  pduSessionStatusCfg?: PduSessionStatusCfg;
  reachabilityForSmsCfg?: ReachabilityForSmsConfiguration;
  mtcProviderInformation?: MtcProviderInformation;
  afId?: string;
  idleStatusInd?: boolean;
}

export interface MonitoringReport {
  referenceId: ReferenceId;
  eventType: EventType;
  report?: Report;
  reachabilityForSmsReport?: ReachabilityForSmsReport;
  reachabilityReport?: ReachabilityReport;
  gpsi?: string;
  timeStamp: string;
}

export type Report = 
  | ChangeOfSupiPeiAssociationReport
  | RoamingStatusReport
  | CnTypeChangeReport
  | CmInfoReport
  | LossConnectivityReport
  | LocationReport
  | PdnConnectivityStatReport;

export interface ReportingOptions {
  reportMode?: EventReportMode;
  maxNumOfReports?: MaxNumOfReports;
  expiry?: string;
  samplingRatio?: number;
  guardTime?: number;
  reportPeriod?: number;
  notifFlag?: NotificationFlag;
}

export interface ChangeOfSupiPeiAssociationReport {
  newPei: string;
}

export interface RoamingStatusReport {
  roaming: boolean;
  newServingPlmn: PlmnId;
  accessType?: AccessType;
}

export interface CreatedEeSubscription {
  eeSubscription: EeSubscription;
  numberOfUes?: number;
  eventReports?: MonitoringReport[];
  epcStatusInd?: boolean;
  failedMonitoringConfigs?: Record<string, FailedMonitoringConfiguration>;
  failedMoniConfigsEPC?: Record<string, FailedMonitoringConfiguration>;
  resetIds?: string[];
}

export interface LocationReportingConfiguration {
  currentLocation: boolean;
  oneTime?: boolean;
  accuracy?: LocationAccuracy;
  n3gppAccuracy?: LocationAccuracy;
}

export interface CnTypeChangeReport {
  oldCnType?: CnType;
  newCnType: CnType;
}

export interface ReachabilityForSmsReport {
  smsfAccessType: AccessType;
  maxAvailabilityTime?: string;
}

export interface DatalinkReportingConfiguration {
  dddTrafficDes?: DddTrafficDescriptor[];
  dnn?: string;
  slice?: Snssai;
  dddStatusList?: DlDataDeliveryStatus[];
}

export interface CmInfoReport {
  oldCmInfoList?: CmInfo[];
  newCmInfoList: CmInfo[];
}

export interface LossConnectivityCfg {
  maxDetectionTime?: number;
}

export interface PduSessionStatusCfg {
  dnn?: string;
}

export interface LossConnectivityReport {
  lossOfConnectReason: LossOfConnectivityReason;
}

export interface LocationReport {
  location: UserLocation;
}

export interface PdnConnectivityStatReport {
  pdnConnStat: PdnConnectivityStatus;
  dnn?: string;
  pduSeId?: number;
  ipv4Addr?: string;
  ipv6Prefixes?: string[];
  ipv6Addrs?: string[];
  pduSessType?: PduSessionType;
}

export interface ReachabilityReport {
  amfInstanceId?: string;
  accessTypeList?: AccessType[];
  reachability?: UeReachability;
  maxAvailabilityTime?: string;
  idleStatusIndication?: IdleStatusIndication;
}

export interface ReachabilityForDataConfiguration {
  reportCfg: ReachabilityForDataReportConfig;
  minInterval?: number;
}

export interface EeMonitoringRevoked {
  revokedMonitoringEventList: Record<string, MonitoringEvent>;
  removedGpsi?: string;
  excludeGpsiList?: string[];
}

export interface MonitoringEvent {
  eventType: EventType;
  revokedCause?: RevokedCause;
}

export interface FailedMonitoringConfiguration {
  eventType: EventType;
  failedCause: FailedCause;
}

export interface PlmnId {
  mcc: string;
  mnc: string;
}

export interface Snssai {
  sst: number;
  sd?: string;
}

export interface ContextInfo {
  [key: string]: any;
}

export interface DddTrafficDescriptor {
  [key: string]: any;
}

export interface CmInfo {
  [key: string]: any;
}

export interface MtcProviderInformation {
  [key: string]: any;
}

export interface UserLocation {
  [key: string]: any;
}

export enum AccessType {
  THREE_GPP_ACCESS = "3GPP_ACCESS",
  NON_3GPP_ACCESS = "NON_3GPP_ACCESS",
  THREE_GPP_AND_NON_3GPP = "3GPP_AND_NON_3GPP"
}

export enum PduSessionType {
  IPV4 = "IPV4",
  IPV6 = "IPV6",
  IPV4V6 = "IPV4V6",
  UNSTRUCTURED = "UNSTRUCTURED",
  ETHERNET = "ETHERNET"
}

export enum NotificationFlag {
  ACTIVATE = "ACTIVATE",
  DEACTIVATE = "DEACTIVATE",
  RETRIEVAL = "RETRIEVAL"
}

export enum UeReachability {
  REACHABLE = "REACHABLE",
  NOT_REACHABLE = "NOT_REACHABLE",
  UNKNOWN = "UNKNOWN"
}

export enum LossOfConnectivityReason {
  DEREGISTERED = "DEREGISTERED",
  MAX_DETECTION_TIME_EXPIRED = "MAX_DETECTION_TIME_EXPIRED",
  PURGED = "PURGED"
}

export enum DlDataDeliveryStatus {
  BUFFERED = "BUFFERED",
  DISCARDED = "DISCARDED",
  TRANSMITTED = "TRANSMITTED"
}

export interface IdleStatusIndication {
  timeStamp: string;
  activeTime?: number;
  subsRegTimer?: number;
  edrxCycleLength?: number;
  suggestedNumOfDlPackets?: number;
  idleStatusTimestamp?: string;
}
