import React from 'react';
import { 
  AlertTriangle, 
  Truck, 
  HeartPulse, 
  Building2, 
  Users, 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  GitFork, 
  ShieldAlert, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { InfrastructureAsset, CycloneScenario, DepartmentType } from '../../types';
import { LocationConfig } from '../../data/locationDatasets';
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
  // Key assets for "What Needs Attention Now?"
  const criticalRoad = assets.find(a => a.type === 'Arterial Road' || a.type === 'Coastal Bridge') || assets[0];
  const criticalPower = assets.find(a => a.type === 'Power Substation') || assets[1];
  const criticalHospital = assets.find(a => a.type === 'Hospital') || assets[2];
  const criticalShelter = assets.find(a => a.type === 'Emergency Shelter') || assets[3];

  const primaryChain = locationConfig?.damageChains?.[0];

  const populationAtRiskFormatted = (locationConfig?.populationAtRisk || 142000).toLocaleString();

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* SECTION 7: TOP RISK SUMMARY (ONLY 4–5 IMPORTANT CLEAN KPI CARDS)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Critical Assets */}
        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #FDF8F9 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-4 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-rose-400 hover:border-rose-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#607D94] uppercase tracking-wider">
            <span className="truncate">Critical Assets</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#102A43] font-mono mt-1.5">
            {kpis.assets}
          </div>
          <div className="text-[11px] text-[#607D94] mt-1 flex items-center justify-between">
            <span>At risk in sector</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: High-Risk Roads */}
        <div 
          onClick={() => onNavigateToTab('evacuation-routes')}
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #FEFAF6 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-4 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-amber-400 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#607D94] uppercase tracking-wider">
            <span className="truncate">High-Risk Roads</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#102A43] font-mono mt-1.5">
            {kpis.roads}
          </div>
          <div className="text-[11px] text-[#607D94] mt-1 flex items-center justify-between">
            <span>Flood overtopping risk</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Hospital Access Risk */}
        <div 
          onClick={() => onNavigateToTab('infrastructure')}
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F9FE 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-4 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-blue-400 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#607D94] uppercase tracking-wider">
            <span className="truncate">Hospital Access Risk</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#102A43] font-mono mt-1.5">
            {kpis.hospitals}
          </div>
          <div className="text-[11px] text-[#607D94] mt-1 flex items-center justify-between">
            <span>Trauma &amp; ICU standby</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Shelters Needing Attention */}
        <div 
          onClick={() => onNavigateToTab('shelters')}
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F3FAF6 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-4 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-emerald-400 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#607D94] uppercase tracking-wider">
            <span className="truncate">Shelters Needing Attention</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#102A43] font-mono mt-1.5">
            {kpis.shelters}
          </div>
          <div className="text-[11px] text-[#607D94] mt-1 flex items-center justify-between">
            <span>Capacity &amp; food buffers</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 5: Population At Risk */}
        <div 
          onClick={() => onNavigateToTab('hazard-map')}
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9F7FD 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-4 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-purple-400 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#607D94] uppercase tracking-wider">
            <span className="truncate">Population at Risk</span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#102A43] font-mono mt-1.5">
            {populationAtRiskFormatted}
          </div>
          <div className="text-[11px] text-[#607D94] mt-1 flex items-center justify-between">
            <span>In low-elevation zone</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DASHBOARD: MAP IS THE HERO (68% width) + RIGHT ACTION COL (32% width) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CENTER / LEFT: MAIN MAP IS THE HERO (~68% width) */}
        <div className="lg:col-span-8 h-[700px] xl:h-[740px] flex flex-col">
          <DisasterMap
            assets={assets}
            selectedAsset={selectedAsset}
            onSelectAsset={onSelectAsset}
            onOpenDamageChain={() => onNavigateToTab('damage-chain')}
            onDraftAdvisory={onDraftAdvisory}
            activeScenarioName={scenario.name}
            showEvacuationRoute={true}
            selectedLocation={selectedLocation}
            selectedDepartment={selectedDepartment}
            currentScenarioKey={currentScenarioKey}
            locationConfig={locationConfig}
          />
        </div>

        {/* RIGHT COLUMN: ACTION SUMMARY (32% width) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: WHAT NEEDS ATTENTION NOW? (Section 10) */}
          <div 
            style={{ 
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FBFE 100%)', 
              boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
            }}
            className="border border-[#DCEAF3] rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCEAF3]/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <h3 className="text-xs font-bold text-[#102A43] uppercase font-mono tracking-wider">
                  What Needs Attention Now?
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#607D94] font-semibold">Priority Triage</span>
            </div>

            <div className="space-y-2.5">
              {/* Item 1: Road Risk */}
              <div className="p-3 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3] hover:border-blue-300 transition-colors flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                    <span>{criticalRoad.name.split('(')[0] || 'ROAD R17'}</span>
                  </div>
                  <p className="text-[11px] text-[#607D94] leading-snug">
                    Flood risk may make the route unsafe. Expected overtopping &gt;1.2m.
                  </p>
                </div>
                <button
                  onClick={() => onSelectAsset(criticalRoad)}
                  className="px-2.5 py-1 bg-white border border-[#DCEAF3] hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  View Details
                </button>
              </div>

              {/* Item 2: Power Substation */}
              <div className="p-3 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3] hover:border-amber-300 transition-colors flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span>{criticalPower.name.split('(')[0] || 'SUBSTATION P3'}</span>
                  </div>
                  <p className="text-[11px] text-[#607D94] leading-snug">
                    Storm surge exposure — auxiliary backup generator and fuel review required.
                  </p>
                </div>
                <button
                  onClick={() => onSelectAsset(criticalPower)}
                  className="px-2.5 py-1 bg-white border border-[#DCEAF3] hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  View Details
                </button>
              </div>

              {/* Item 3: Hospital Access */}
              <div className="p-3 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3] hover:border-rose-300 transition-colors flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                    <span>{criticalHospital.name.split('(')[0] || 'HOSPITAL H2'}</span>
                  </div>
                  <p className="text-[11px] text-[#607D94] leading-snug">
                    Ambulance access risk detected. Emergency detour route R-21 staging required.
                  </p>
                </div>
                <button
                  onClick={() => onSelectAsset(criticalHospital)}
                  className="px-2.5 py-1 bg-white border border-[#DCEAF3] hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  View Details
                </button>
              </div>

              {/* Item 4: Shelter Capacity */}
              <div className="p-3 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3] hover:border-emerald-300 transition-colors flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{criticalShelter.name.split('(')[0] || 'SHELTER S4'}</span>
                  </div>
                  <p className="text-[11px] text-[#607D94] leading-snug">
                    Review occupancy threshold and emergency drinking water buffer.
                  </p>
                </div>
                <button
                  onClick={() => onSelectAsset(criticalShelter)}
                  className="px-2.5 py-1 bg-white border border-[#DCEAF3] hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: SIMPLE DAMAGE CHAIN (Section 11) */}
          <div 
            style={{ 
              background: 'linear-gradient(145deg, #FFFFFF 0%, #FAF8FE 100%)', 
              boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
            }}
            className="border border-[#DCEAF3] rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCEAF3]/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <GitFork className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#102A43] uppercase font-mono tracking-wider">
                  Damage Chain
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                Cascading Impact
              </span>
            </div>

            {/* Simple Step-by-Step Chain */}
            <div className="space-y-1.5 text-xs text-[#102A43] font-medium bg-[#F0F6FA] p-3 rounded-xl border border-[#DCEAF3]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Heavy Rain &amp; Storm Surge</span>
              </div>
              <div className="text-[#607D94] pl-3.5 text-[10px]">&darr;</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Road R17 Flooding (&gt;1.2m)</span>
              </div>
              <div className="text-[#607D94] pl-3.5 text-[10px]">&darr;</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Ambulance Access Blockage</span>
              </div>
              <div className="text-[#607D94] pl-3.5 text-[10px]">&darr;</div>
              <div className="flex items-center gap-2 font-bold text-[#102A43]">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Hospital H2 Oxygen &amp; Trauma Crisis</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('damage-chain')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-200 shadow-2xs"
            >
              <span>Explore Damage Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: SIMPLE ACTION PLAN (Section 12) */}
          <div 
            style={{ 
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F5FAFD 100%)', 
              boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
            }}
            className="border border-[#DCEAF3] rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCEAF3]/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#102A43] uppercase font-mono tracking-wider">
                  Next Actions
                </h3>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                Timeline Triage
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="font-mono font-bold text-[#102A43]">T−24h</span>
                <span className="text-[#607D94] text-[11px]">Review critical assets</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Done</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200">
                <span className="font-mono font-bold text-amber-900">T−12h</span>
                <span className="text-[#102A43] text-[11px] font-medium">Prepare emergency resources</span>
                <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="font-mono font-bold text-[#102A43]">T−6h</span>
                <span className="text-[#607D94] text-[11px]">Confirm hospital &amp; shelter readiness</span>
                <span className="text-[10px] font-mono text-[#607D94]">Scheduled</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="font-mono font-bold text-[#102A43]">T−3h</span>
                <span className="text-[#607D94] text-[11px]">Verify evacuation routes</span>
                <span className="text-[10px] font-mono text-[#607D94]">Scheduled</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('action-plan')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200 shadow-2xs"
            >
              <span>Open Full Action Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
