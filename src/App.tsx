import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { AssetDetailModal } from './components/AssetDetailModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './components/LandingPage';

import { OverviewView } from './components/views/OverviewView';
import { RiskMapView } from './components/views/RiskMapView';
import { CriticalAssetsView } from './components/views/CriticalAssetsView';
import { DamageChainsView } from './components/views/DamageChainsView';
import { ActionCenterView } from './components/views/ActionCenterView';
import { EvacuationRoutesView } from './components/views/EvacuationRoutesView';
import { SheltersView } from './components/views/SheltersView';
import { AdvisoryCenterView } from './components/views/AdvisoryCenterView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { ReportsView } from './components/views/ReportsView';
import { CitizenDashboardView } from './components/views/CitizenDashboardView';

import { 
  InfrastructureAsset, 
  DepartmentType, 
  ActionStatus, 
  AIAdvisory, 
  AdvisoryStatus,
  UserRole,
  CycloneScenario,
  RiskLevel
} from './types';
import { 
  ALL_LOCATION_CONFIGS, 
  SCENARIO_CONFIGS, 
  LocationConfig 
} from './data/locationDatasets';
import { Shield, Users, Building2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  // Role is null on start so the user lands on the clean landing page first
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentScenarioKey, setCurrentScenarioKey] = useState<string>('standard');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('East Godavari, Andhra Pradesh');
  
  // Officer Profile
  const [officerName, setOfficerName] = useState<string>('Officer S. Patnaik');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Selected asset for modal inspector
  const [selectedAssetForModal, setSelectedAssetForModal] = useState<InfrastructureAsset | null>(null);
  
  // Direct pre-selection for Advisory Center
  const [advisoryTargetAssetId, setAdvisoryTargetAssetId] = useState<string>('');

  // Active location and scenario configurations
  const locationConfig: LocationConfig = useMemo(() => {
    return ALL_LOCATION_CONFIGS[selectedLocation] || ALL_LOCATION_CONFIGS['East Godavari, Andhra Pradesh'];
  }, [selectedLocation]);

  const scenarioConfig = useMemo(() => {
    return SCENARIO_CONFIGS[currentScenarioKey] || SCENARIO_CONFIGS['standard'];
  }, [currentScenarioKey]);

  // Dynamically computed Active Cyclone Scenario
  const activeScenario: CycloneScenario = useMemo(() => {
    const windSpeedKm = Math.round(locationConfig.baseWindKm * scenarioConfig.windMultiplier);
    const rainfallMm = Math.round(locationConfig.baseRainfallMm * scenarioConfig.rainMultiplier);
    const surgeM = (locationConfig.baseSurgeM * scenarioConfig.surgeMultiplier).toFixed(1);
    const timeHours = Math.max(4, locationConfig.baseTimeToLandfallHours + scenarioConfig.timeHoursDelta);

    return {
      id: `SCENARIO-${currentScenarioKey.toUpperCase()}`,
      name: scenarioConfig.name,
      status: 'PRE-LANDFALL',
      category: locationConfig.category,
      maxSustainedWind: `${windSpeedKm} km/h (Gusto ${windSpeedKm + 20} km/h)`,
      expectedRainfall: `${rainfallMm} mm in 24 hrs`,
      stormSurgeEstimate: `${surgeM} m above astronomical tide`,
      timeToLandfall: `${timeHours} hours`,
      landfallWindow: locationConfig.baseLandfallWindow,
      coordinates: locationConfig.center,
      bearing: 'NNW at 16 km/h',
      centralPressure: '968 hPa',
    };
  }, [locationConfig, scenarioConfig, currentScenarioKey]);

  // Dynamically scaled assets for location & scenario
  const assets: InfrastructureAsset[] = useMemo(() => {
    return locationConfig.assets.map(asset => {
      let riskDelta = 0;

      // Extreme rain affects roads and hospitals
      if (scenarioConfig.rainMultiplier > 1.2 && (asset.type === 'Arterial Road' || asset.type === 'Hospital' || asset.type === 'Water Treatment')) {
        riskDelta += 8;
      }
      // Extreme surge affects power, coastal roads, bridges, and ports
      if (scenarioConfig.surgeMultiplier > 1.2 && (asset.type === 'Power Substation' || asset.type === 'Coastal Bridge' || asset.type === 'Port Facility')) {
        riskDelta += 10;
      }
      // High wind affects power substations and shelters
      if (scenarioConfig.windMultiplier > 1.2 && (asset.type === 'Power Substation' || asset.type === 'Emergency Shelter')) {
        riskDelta += 7;
      }

      const newScore = Math.min(99, Math.max(20, asset.riskScore + riskDelta));
      let newLevel: RiskLevel = 'LOW';
      if (newScore >= 82) newLevel = 'CRITICAL';
      else if (newScore >= 68) newLevel = 'HIGH';
      else if (newScore >= 45) newLevel = 'MEDIUM';

      return {
        ...asset,
        riskScore: newScore,
        riskLevel: newLevel,
        status: newLevel === 'CRITICAL' ? 'At Risk' : newLevel === 'HIGH' ? 'Vulnerable' : 'Operational',
      };
    });
  }, [locationConfig, scenarioConfig]);

  // Actions & Advisories from location
  const [actions, setActions] = useState(locationConfig.actions);
  const [advisories, setAdvisories] = useState<AIAdvisory[]>(locationConfig.advisories);

  // Keep actions & advisories synced when location changes
  React.useEffect(() => {
    setActions(locationConfig.actions);
    setAdvisories(locationConfig.advisories);
    if (locationConfig.assets[0]) {
      setAdvisoryTargetAssetId(locationConfig.assets[0].id);
    }
  }, [locationConfig]);

  const currentKPIs = scenarioConfig.kpiMultipliers;

  // Handlers
  const handleOpenAssetDetail = (asset: InfrastructureAsset) => {
    setSelectedAssetForModal(asset);
  };

  const handleOpenAssetDetailById = (assetId: string) => {
    const found = assets.find(a => a.id === assetId);
    if (found) {
      setSelectedAssetForModal(found);
    }
  };

  const handleDraftAdvisoryFromAsset = (asset: InfrastructureAsset) => {
    setAdvisoryTargetAssetId(asset.id);
    setActiveTab('advisories');
  };

  const handleDraftAdvisoryFromAssetId = (assetId: string) => {
    setAdvisoryTargetAssetId(assetId);
    setActiveTab('advisories');
  };

  const handleSimulateWhatIfFromAsset = (asset: InfrastructureAsset) => {
    setActiveTab('what-if');
  };

  const handleUpdateActionStatus = (actionId: string, newStatus: ActionStatus) => {
    setActions(prev => 
      prev.map(act => act.id === actionId ? { ...act, status: newStatus } : act)
    );
  };

  const handleAddNewAdvisory = (newAdvisory: AIAdvisory) => {
    setAdvisories(prev => [newAdvisory, ...prev]);
  };

  const handleUpdateAdvisoryStatus = (advisoryId: string, newStatus: AdvisoryStatus) => {
    setAdvisories(prev => 
      prev.map(adv => adv.id === advisoryId ? { ...adv, status: newStatus } : adv)
    );
  };

  const handleRoleSelect = (role: UserRole, officer?: string, loc?: string) => {
    if (officer) setOfficerName(officer);
    if (loc) setSelectedLocation(loc);
    setUserRole(role);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  // If no role is selected, show the Landing Page!
  if (userRole === null) {
    return (
      <LandingPage
        onSelectRole={handleRoleSelect}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Enterprise Header with no role switch toggle, but with location, scenario, sector filters, and logout */}
      <Header
        currentScenarioKey={currentScenarioKey}
        onScenarioChange={setCurrentScenarioKey}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        userRole={userRole}
        officerName={officerName}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onLogout={handleLogout}
        windSpeedText={activeScenario.maxSustainedWind.split('(')[0].trim()}
        surgeText={activeScenario.stormSurgeEstimate.split('above')[0].trim()}
        landfallText={activeScenario.timeToLandfall}
      />

      {/* Main Workspace: Authority (Sidebar + Viewport) OR Citizen (Public Portal) */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1720px] mx-auto overflow-hidden">
        {userRole === 'ADMIN' ? (
          <>
            {/* Left Sidebar for Authority */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenAssetDetailById={handleOpenAssetDetailById}
              userRole={userRole}
              officerName={officerName}
            />

            {/* Viewport Content Area */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-115px)]">
              {activeTab === 'overview' && (
                <OverviewView
                  scenario={activeScenario}
                  kpis={currentKPIs}
                  assets={assets}
                  selectedDepartment={selectedDepartment}
                  onSelectAsset={handleOpenAssetDetail}
                  onNavigateToTab={setActiveTab}
                  onDraftAdvisory={handleDraftAdvisoryFromAsset}
                  selectedAsset={selectedAssetForModal}
                  locationConfig={locationConfig}
                  selectedLocation={selectedLocation}
                  currentScenarioKey={currentScenarioKey}
                />
              )}

              {activeTab === 'hazard-map' && (
                <RiskMapView
                  assets={assets}
                  onSelectAsset={handleOpenAssetDetail}
                  selectedAsset={selectedAssetForModal}
                  onDraftAdvisory={handleDraftAdvisoryFromAsset}
                  selectedLocation={selectedLocation}
                  selectedDepartment={selectedDepartment}
                  currentScenarioKey={currentScenarioKey}
                  locationConfig={locationConfig}
                />
              )}

              {activeTab === 'infrastructure' && (
                <CriticalAssetsView
                  assets={assets}
                  selectedDepartment={selectedDepartment}
                  onSelectAsset={handleOpenAssetDetail}
                  onDraftAdvisory={handleDraftAdvisoryFromAsset}
                />
              )}

              {activeTab === 'damage-chain' && (
                <DamageChainsView
                  onDraftAdvisoryForAsset={handleDraftAdvisoryFromAssetId}
                  selectedDepartment={selectedDepartment}
                />
              )}

              {activeTab === 'action-plan' && (
                <ActionCenterView
                  actions={actions}
                  onUpdateActionStatus={handleUpdateActionStatus}
                  selectedDepartment={selectedDepartment}
                  onOpenAssetDetailById={handleOpenAssetDetailById}
                />
              )}

              {activeTab === 'evacuation-routes' && (
                <EvacuationRoutesView
                  assets={assets}
                  onSelectAsset={handleOpenAssetDetail}
                  selectedAsset={selectedAssetForModal}
                  onDraftAdvisory={handleDraftAdvisoryFromAsset}
                />
              )}

              {activeTab === 'shelters' && (
                <SheltersView
                  assets={assets}
                  onSelectAsset={handleOpenAssetDetail}
                  onDraftAdvisory={handleDraftAdvisoryFromAsset}
                />
              )}

              {activeTab === 'what-if' && (
                <WhatIfSimulatorView
                  onDraftAdvisoryForAsset={handleDraftAdvisoryFromAssetId}
                  onOpenAssetDetailById={handleOpenAssetDetailById}
                />
              )}

              {activeTab === 'advisories' && (
                <AdvisoryCenterView
                  assets={assets}
                  advisories={advisories}
                  onAddNewAdvisory={handleAddNewAdvisory}
                  onUpdateAdvisoryStatus={handleUpdateAdvisoryStatus}
                  initialSelectedAssetId={advisoryTargetAssetId || assets[0]?.id || 'H-07'}
                  selectedDepartment={selectedDepartment}
                  officerName={officerName}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  assets={assets}
                  advisories={advisories}
                  activeScenarioName={activeScenario.name}
                />
              )}

              {/* Trust, Safety & Ethics Footer */}
              <footer className="mt-8 pt-4 pb-2 border-t border-slate-200 text-center text-xs text-slate-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto px-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      PRAVAH AI is an operational decision-support prototype. Risk estimates are probabilistic and depend on simulated forecast & infrastructure data. Recommendations require review by authorized officials before operational use.
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-blue-600 shrink-0 font-bold">
                    ODISHA & ANDHRA COASTAL PROTOCOL • 2026
                  </span>
                </div>
              </footer>
            </main>
          </>
        ) : (
          /* CITIZEN DASHBOARD EXPERIENCE */
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-115px)]">
            <CitizenDashboardView
              scenario={activeScenario}
              assets={assets}
              onSelectShelter={handleOpenAssetDetail}
              onLogout={handleLogout}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              locationConfig={locationConfig}
            />

            {/* Public Safety Footer */}
            <footer className="mt-8 pt-4 pb-2 border-t border-slate-200 text-center text-xs text-slate-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto px-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>
                    Emergency Helpline Numbers: 1070 (State EOC) • 112 (National Disaster Line) • 108 (Ambulance). Keep battery torches and drinking water ready.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  PUBLIC SAFETY CITIZEN PORTAL • PRAVAH AI
                </span>
              </div>
            </footer>
          </main>
        )}
      </div>

      {/* Asset Deep Profile Modal */}
      <AssetDetailModal
        asset={selectedAssetForModal}
        onClose={() => setSelectedAssetForModal(null)}
        onDraftAdvisory={handleDraftAdvisoryFromAsset}
        onSimulateWhatIf={handleSimulateWhatIfFromAsset}
      />
    </div>
  );
}
