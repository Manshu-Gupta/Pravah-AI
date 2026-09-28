import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Wind, 
  CloudRain, 
  Waves, 
  Clock, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Activity, 
  ChevronRight, 
  Compass, 
  Eye, 
  MapPin, 
  Flame, 
  CheckCircle2, 
  Users, 
  Navigation, 
  FileText, 
  Sparkles, 
  Send, 
  SlidersHorizontal, 
  Check,
  Truck,
  HeartPulse,
  Building,
  Layers
} from 'lucide-react';
import { InfrastructureAsset, CycloneScenario, DepartmentType } from '../../types';
import { LocationConfig, SCENARIO_CONFIGS } from '../../data/locationDatasets';
import { DifferentiatorBanner } from '../DifferentiatorBanner';
import { DataIngestionStatus } from '../DataIngestionStatus';
import { DisasterMap } from '../DisasterMap';

interface OverviewViewProps {
  scenario: CycloneScenario;
  kpis: {
    assets: number;
    roads: number;
    hospitals: number;
    shelters: number;
    power: number;
  };
  assets: InfrastructureAsset[];
  selectedDepartment: DepartmentType;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onNavigateToTab: (tab: any) => void;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
  selectedAsset: InfrastructureAsset | null;
  locationConfig?: LocationConfig;
  selectedLocation?: string;
  currentScenarioKey?: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  scenario,
  kpis,
  assets,
  selectedDepartment,
  onSelectAsset,
  onNavigateToTab,
  onDraftAdvisory,
  selectedAsset,
  locationConfig,
  selectedLocation = 'East Godavari, Andhra Pradesh',
  currentScenarioKey = 'standard',
}) => {
  // Bottom tab state
  const [bottomTab, setBottomTab] = useState<
    'damage_chain' | 'evacuation' | 'shelters' | 'gemini_copilot' | 'role_advisories'
  >('damage_chain');

  // Currently inspected asset for right-side insights
  const currentAsset = selectedAsset || assets[0] || ({} as InfrastructureAsset);

  // Dynamic statistics from locationConfig
  const highRiskWardsCount = locationConfig?.highRiskWards || 16;
  const populationAtRiskFormatted = (locationConfig?.populationAtRisk || 180000).toLocaleString();
  const roadScourEstimate = (locationConfig?.roadScourEstimateKm || 18.5).toFixed(1);
  const primaryChain = locationConfig?.damageChains?.[0];
  const roadsList = locationConfig?.roads || [];
  const primaryAdvisory = locationConfig?.advisories?.[0];

  return (
    <div className="space-y-6">
      {/* Visual Differentiator Banner */}
      <DifferentiatorBanner />

      {/* Sector Focus Notice when active */}
      {selectedDepartment !== 'ALL' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span>ACTIVE SECTOR DIRECTIVE: {selectedDepartment}</span>
          </div>
          <span className="text-slate-600">
            Filtering dashboard metrics, GIS overlays, and action protocols specifically for {selectedDepartment} teams.
          </span>
          <button
            onClick={() => onNavigateToTab('action-plan')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-2xs"
          >
            Open Sector Action Matrix →
          </button>
        </div>
      )}

      {/* 5 Enterprise KPI Cards (Clean White / Light Slate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-rose-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-mono font-bold uppercase tracking-wider">
            <span>Critical Assets at Risk</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {kpis.assets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>{locationConfig?.shortName || 'Coastal'} Sector</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-mono font-bold uppercase tracking-wider">
            <span>High-Risk Roads</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {kpis.roads}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>{roadScourEstimate} km scour risk</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-blue-700 font-mono font-bold uppercase tracking-wider">
            <span>Hospitals in Zone</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {kpis.hospitals}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>Trauma & ICU standby</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab('shelters')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-mono font-bold uppercase tracking-wider">
            <span>Shelters Active</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {kpis.shelters}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>Fuel & drinking water logged</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-purple-700 font-mono font-bold uppercase tracking-wider">
            <span>Power Assets at Risk</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {kpis.power}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>Substations facing surge/wind</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD: CENTER INTERACTIVE MAP (7 cols) + RIGHT KEY INSIGHTS (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CENTER: Real Interactive DisasterMap */}
        <div className="lg:col-span-7 h-[580px] flex flex-col">
          <DisasterMap
            assets={assets}
            selectedAsset={currentAsset}
            onSelectAsset={onSelectAsset}
            onOpenDamageChain={(assetId) => {
              setBottomTab('damage_chain');
            }}
            onDraftAdvisory={onDraftAdvisory}
            activeScenarioName={scenario.name}
            showEvacuationRoute={bottomTab === 'evacuation'}
            selectedLocation={selectedLocation}
            selectedDepartment={selectedDepartment}
            currentScenarioKey={currentScenarioKey}
            locationConfig={locationConfig}
          />
        </div>

        {/* RIGHT: Key Insights, Asset Risk Details & Actions */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Tactical Impact Insights
                </h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                T-MINUS {locationConfig?.baseTimeToLandfallHours || 18} HOURS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">High-Risk Wards</span>
                <span className="text-lg font-black text-rose-700">{highRiskWardsCount} Sectors</span>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{locationConfig?.name || selectedLocation}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Population at Risk</span>
                <span className="text-lg font-black text-amber-700">{populationAtRiskFormatted}</span>
                <div className="text-[10px] text-slate-500 mt-0.5">Low-lying surge zone</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estimated Road Scour</span>
                <span className="text-lg font-black text-blue-700">{roadScourEstimate} km</span>
                <div className="text-[10px] text-slate-500 mt-0.5">Coastal highways & tidal links</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Projected Grid Outage</span>
                <span className="text-lg font-black text-purple-700">{kpis.power} Substations</span>
                <div className="text-[10px] text-slate-500 mt-0.5">Auxiliary fuel alerts staged</div>
              </div>
            </div>

            {/* Currently Selected Asset Risk Dossier */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  INSPECTED ASSET: {currentAsset.id || 'N/A'}
                </span>
                <span className="font-mono text-rose-700 font-bold">
                  RISK: {currentAsset.riskScore || 0}/100 [{currentAsset.riskLevel || 'N/A'}]
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{currentAsset.name || 'Select an asset from the map'}</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                <strong className="text-slate-700">Vulnerability:</strong> {currentAsset.vulnerability || 'N/A'}
              </p>
              <div className="text-xs text-purple-700 font-mono font-medium">
                Dependencies: {currentAsset.dependencies?.join(', ') || 'None identified'}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
              <div className="text-[10px] font-mono uppercase text-blue-700 font-bold mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                Priority Directive:
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                {currentAsset.recommendedActions?.[0] || 'Maintain real-time telemetry and storm barricades.'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => onSelectAsset(currentAsset)}
                className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
              >
                Open Full Asset Profile →
              </button>
              {onDraftAdvisory && (
                <button
                  onClick={() => onDraftAdvisory(currentAsset)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Advisory
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: MULTI-TAB INTELLIGENCE CONSOLE */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] mr-2 font-bold">Operational Console:</span>
          
          <button
            onClick={() => setBottomTab('damage_chain')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              bottomTab === 'damage_chain'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Damage Chain Analysis
          </button>

          <button
            onClick={() => setBottomTab('evacuation')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              bottomTab === 'evacuation'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Evacuation Route Recommendation
          </button>

          <button
            onClick={() => setBottomTab('shelters')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              bottomTab === 'shelters'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Shelter Status & Logistics
          </button>

          <button
            onClick={() => setBottomTab('gemini_copilot')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              bottomTab === 'gemini_copilot'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Gemini Advisory Copilot
          </button>

          <button
            onClick={() => setBottomTab('role_advisories')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              bottomTab === 'role_advisories'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Role-Specific Directives
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-5 text-xs">
          {/* TAB 1: DAMAGE CHAIN ANALYSIS */}
          {bottomTab === 'damage_chain' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    {primaryChain?.title || 'Infrastructure Dependency Intelligence — Primary Active Cascade'}
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    Trigger Hazard: {primaryChain?.triggerHazard || 'Storm surge and inland river swelling'}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('damage-chain')}
                  className="text-blue-600 hover:underline font-bold font-mono cursor-pointer"
                >
                  Full Graph View →
                </button>
              </div>

              {/* Chain Diagram Flow */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                {(primaryChain?.nodes || [
                  { id: '1', label: '1. TRIGGER', description: 'Surge Inundation', riskLevel: 'CRITICAL' },
                  { id: '2', label: '2. ARTERIAL BREACH', description: 'Coastal Road Submerged', riskLevel: 'CRITICAL' },
                  { id: '3', label: '3. GRID INTERRUPTION', description: 'Transformer Trip', riskLevel: 'HIGH' },
                  { id: '4', label: '4. HOSPITAL IMPACT', description: 'Auxiliary Power Only', riskLevel: 'CRITICAL' },
                  { id: '5', label: '5. INTERVENTION', description: 'Staged Diesel Buffer', riskLevel: 'MEDIUM' },
                ]).map((node, idx, arr) => (
                  <React.Fragment key={node.id}>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center min-w-[140px] shadow-2xs">
                      <span className="text-[9px] font-mono uppercase text-blue-700 block font-bold">NODE {idx + 1}</span>
                      <span className="font-bold text-slate-900 text-xs block">{node.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{node.description}</span>
                    </div>
                    {idx < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>

              {primaryChain?.potentialConsequence && (
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 font-medium">
                  <strong>Cascading Consequence:</strong> {primaryChain.potentialConsequence}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EVACUATION ROUTE RECOMMENDATION */}
          {bottomTab === 'evacuation' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Recommended Evacuation Corridors ({locationConfig?.name || selectedLocation})
                  </h4>
                  <p className="text-slate-500">
                    Real-time hydrodynamic clearance comparison for hospital transfer & public evacuation convoys.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('evacuation-routes')}
                  className="text-blue-600 hover:underline font-bold font-mono cursor-pointer"
                >
                  Interactive Routing Engine →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadsList.length >= 2 ? (
                  <>
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                      <div className="flex items-center justify-between text-rose-800 font-bold mb-1">
                        <span>Route A: {roadsList[0].name}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                          NOT RECOMMENDED
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        Flood Depth: {roadsList[0].floodDepth} • {roadsList[0].expectedDisruption}.
                        Ambulances and low-clearance vehicles strictly restricted.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                      <div className="flex items-center justify-between text-emerald-800 font-bold mb-1">
                        <span>Route B: {roadsList[1].name}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        Passage clear • Flood Depth: {roadsList[1].floodDepth}.
                        {roadsList[1].expectedDisruption}. Priority corridor designated for emergency convoys.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                    Loading district evacuation corridors for {locationConfig?.shortName || selectedLocation}...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SHELTER STATUS & LOGISTICS */}
          {bottomTab === 'shelters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Designated Cyclone Shelters Roster ({locationConfig?.shortName || selectedLocation})
                  </h4>
                  <p className="text-slate-500">Multi-purpose cyclone refuges monitored for capacity, fuel, and drinking water.</p>
                </div>
                <button
                  onClick={() => onNavigateToTab('shelters')}
                  className="text-blue-600 hover:underline font-bold font-mono cursor-pointer"
                >
                  Full Shelters Roster →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {assets.filter(a => a.type === 'Emergency Shelter').slice(0, 3).map(shelter => (
                  <div key={shelter.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-blue-700 block font-bold">{shelter.id}: {shelter.name}</span>
                    <div className="font-bold text-slate-900 mt-1">{shelter.capacity || 'Capacity: 2,000 persons'}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Backup Power: {shelter.backupPower || 'Verified standby generator'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI ADVISORY COPILOT */}
          {bottomTab === 'gemini_copilot' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Gemini AI Advisory Copilot (Structured Model Explanation)
                  </h4>
                  <p className="text-slate-500">
                    Translates multi-hazard risk numbers into authoritative drafts for authorized officer review.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('advisories')}
                  className="text-blue-600 hover:underline font-bold font-mono cursor-pointer"
                >
                  Open AI Advisory Studio →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800 leading-relaxed font-sans">
                &ldquo;{primaryAdvisory?.situationSummary || `Based on simulated multi-hazard projections for ${scenario.name}, District facilities in ${locationConfig?.shortName || selectedLocation} exhibit elevated exposure. Authorities should verify emergency backup power and clear designated evacuation corridors.`}&rdquo;
              </div>
            </div>
          )}

          {/* TAB 5: ROLE-SPECIFIC DIRECTIVES */}
          {bottomTab === 'role_advisories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-rose-700 font-bold block mb-1">HEALTH COMMAND:</span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Prioritize ICU rooftop generator circuits; reroute 108 emergency ambulance dispatch to bypass corridors; maintain 72hr medical oxygen buffers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-purple-700 font-bold block mb-1">POWER DEPARTMENT:</span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Pre-position mobile transformer trailers and submersible dewatering pumps in low-lying switchyards; isolate non-critical coastal feeder loops.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-amber-700 font-bold block mb-1">ROADS & BRIDGES (PWD):</span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Close vulnerable coastal bridges to heavy commercial trucks; mobilize front-end loaders and motorized chainsaws along bypass corridors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Source Ingestion Telemetry Footer Component */}
      <DataIngestionStatus />
    </div>
  );
};
