export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type UserRole = 'ADMIN' | 'CITIZEN';

export type CitizenLanguage = 'en' | 'hi' | 'te' | 'or';

export type AssetType = 
  | 'Hospital' 
  | 'Power Substation' 
  | 'Arterial Road' 
  | 'Coastal Bridge' 
  | 'Emergency Shelter' 
  | 'Water Treatment' 
  | 'Telecom Tower' 
  | 'Port Facility';

export type DepartmentType = 
  | 'ALL'
  | 'DISASTER MANAGEMENT'
  | 'MUNICIPAL'
  | 'ROADS'
  | 'POWER'
  | 'HEALTH';

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: AssetType;
  district: string;
  latitude: number;
  longitude: number;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  hazards: string[];
  exposure: string;
  vulnerability: string;
  dependencies: string[];
  dependencyDetails?: {
    id: string;
    type: string;
    impactIfFailed: string;
  }[];
  potentialImpact: string;
  timeToImpact: string; // e.g. "5 hours"
  timeToImpactHours: number;
  recommendedActions: string[];
  status: 'Operational' | 'Vulnerable' | 'At Risk' | 'Impaired';
  department: DepartmentType;
  alternateRoute?: string;
  capacity?: string;
  backupPower?: string;
  // Road & Population Dependency Metrics
  dailyUsers?: number;
  populationDependencePercent?: number; // e.g. 53%
  congestionLevel?: 'Normal' | 'Slow' | 'Heavy' | 'Severe' | 'Blocked';
  expectedDisruptionTime?: string;
  connectedHospitalsCount?: number;
  connectedSheltersCount?: number;
  isSimulatedData?: boolean;
}

export interface CycloneScenario {
  id: string;
  name: string;
  status: string; // "PRE-LANDFALL"
  category: string; // "Very Severe Cyclonic Storm"
  maxSustainedWind: string; // "145 km/h"
  expectedRainfall: string; // "240 mm"
  stormSurgeEstimate: string; // "2.8 m"
  timeToLandfall: string; // "8 hours"
  landfallWindow: string; // "28 Sep, 02:00 - 06:00 IST"
  coordinates: { lat: number; lng: number };
  bearing: string; // "NNW at 16 km/h"
  centralPressure: string; // "968 hPa"
}

export interface DependencyChainNode {
  id: string;
  label: string;
  type: 'hazard' | 'asset' | 'dependency' | 'impact' | 'outcome';
  description: string;
  riskLevel: RiskLevel;
}

export interface DamageChain {
  id: string;
  title: string;
  triggerHazard: string;
  primaryAssetId: string;
  primaryAssetName: string;
  priority: RiskLevel;
  nodes: DependencyChainNode[];
  potentialConsequence: string;
  recommendedAction: string;
  affectedDepartments: DepartmentType[];
}

export type ActionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Escalated';

export interface AnticipatoryAction {
  id: string;
  phase: 'T - 24 HOURS' | 'T - 12 HOURS' | 'T - 6 HOURS' | 'T - 3 HOURS';
  phaseTitle: 'PREPARE' | 'MOBILIZE' | 'COORDINATE' | 'VERIFY';
  department: DepartmentType;
  priority: RiskLevel;
  deadline: string;
  relatedAssetId: string;
  relatedAssetName: string;
  actionText: string;
  status: ActionStatus;
  responsibleOfficer: string;
  verificationCriteria: string;
}

export type AdvisoryStatus = 'Draft' | 'Under Review' | 'Approved' | 'Dispatched';

export interface AIAdvisory {
  id: string;
  department: DepartmentType;
  district: string;
  assetId: string;
  assetName: string;
  severity: RiskLevel;
  generatedAt: string;
  status: AdvisoryStatus;
  reviewer: string;
  situationSummary: string;
  whyAssetMatters: string;
  potentialImpact: string;
  recommendedPreparatoryActions: string[];
  urgency: string;
  evidenceInputs: string;
  dispatchedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  recommendedActions?: string[];
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  triggerEvent: string;
  primaryAffectedAsset: string;
  cascadingImpacts: {
    assetId: string;
    assetName: string;
    beforeRisk: RiskLevel;
    afterRisk: RiskLevel;
    beforeScore: number;
    afterScore: number;
    details: string;
  }[];
  mitigationRequirement: string;
  alternativeRouteOrPlan: string;
}

export interface PostEventRecord {
  id: string;
  zone: string;
  assetName: string;
  predictedRiskScore: number;
  observedImpactScore: number;
  hazardType: string;
  variance: number;
  predictionAccuracy: string;
  damageObserved: string;
  keyLearning: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  path: [number, number][];
  riskLevel: RiskLevel;
  riskScore: number;
  floodDepth: string; // e.g. "1.2 m"
  windExposure: string;
  expectedDisruption: string;
  status: 'Operational' | 'Vulnerable' | 'At Risk' | 'Closed';
  dailyUsers: number;
  populationDependencePercent: number; // e.g. 53
  alternateRouteId?: string;
  alternateRouteName?: string;
  detourTime?: string; // e.g. "+14 min"
  isClosed?: boolean;
  isRecommendedAlternative?: boolean;
  destinationShelterId?: string;
  destinationShelterName?: string;
  distanceKm?: number;
  travelTimeMin?: number;
}

export interface LocationDataset {
  id: string;
  name: string;
  shortName: string;
  state: string;
  center: { lat: number; lng: number };
  zoom: number;
  populationAtRisk: number;
  highRiskWards: number;
  weather: {
    temp: string;
    windSpeed: string;
    windDir: string;
    pressure: string;
    rainfall24h: string;
    humidity: string;
    surgeHeight: string;
    forecastSummary: string;
    timeToImpact: string;
  };
  cycloneTrack: {
    past: [number, number][];
    current: [number, number];
    forecast: [number, number][];
    cone: [number, number][];
    galeRadiusKm: number;
    outerWindRadiusKm: number;
  };
  surgePolygon: [number, number][];
  floodPolygon: [number, number][];
  windPolygon: [number, number][];
  roads: RoadSegment[];
  assets: InfrastructureAsset[];
  damageChains: DamageChain[];
  actions: AnticipatoryAction[];
  advisories: AIAdvisory[];
  citizenWarnings: {
    id: string;
    title: string;
    desc: string;
    severity: 'RED' | 'ORANGE' | 'YELLOW';
    closedRoad?: string;
    recommendedRoad?: string;
    nearestShelter?: string;
    shelterDistance?: string;
  }[];
}

