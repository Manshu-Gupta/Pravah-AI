import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Filter, 
  Compass, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Wind, 
  Waves, 
  Building2,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';
import { InfrastructureAsset, RiskLevel, DepartmentType } from '../../types';
import { LocationConfig } from '../../data/locationDatasets';
import { DisasterMap } from '../DisasterMap';

interface RiskMapViewProps {
  assets: InfrastructureAsset[];
  onSelectAsset: (asset: InfrastructureAsset) => void;
  selectedAsset: InfrastructureAsset | null;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
  selectedLocation?: string;
  selectedDepartment?: DepartmentType;
  currentScenarioKey?: string;
  locationConfig?: LocationConfig;
}

export const RiskMapView: React.FC<RiskMapViewProps> = ({
  assets,
  onSelectAsset,
  selectedAsset,
  onDraftAdvisory,
  selectedLocation,
  selectedDepartment = 'ALL',
  currentScenarioKey = 'standard',
  locationConfig,
}) => {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [assetSearch, setAssetSearch] = useState<string>('');

  const filteredAssets = assets.filter(a => {
    if (selectedRiskFilter !== 'ALL' && a.riskLevel !== selectedRiskFilter) return false;
    if (assetSearch.trim()) {
      const q = assetSearch.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.district.toLowerCase().includes(q);
    }
    return true;
  });

  const criticalCount = assets.filter(a => a.riskLevel === 'CRITICAL').length;
  const highCount = assets.filter(a => a.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-4">
      {/* Top Filter & Metric Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick Risk Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
            Severity Filter:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedRiskFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedRiskFilter === lvl
                  ? lvl === 'CRITICAL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : lvl === 'HIGH'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : lvl === 'MEDIUM'
                    ? 'bg-yellow-600 text-white shadow-xs'
                    : lvl === 'LOW'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Center: Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search asset or district..."
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filteredAssets.length}</strong> of {assets.length} Assets
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
            {criticalCount} Critical
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
            {highCount} High
          </span>
        </div>
      </div>

      {/* Main Real Interactive Map Area */}
      <div className="h-[calc(100vh-230px)] min-h-[600px] w-full">
        <DisasterMap
          assets={filteredAssets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          onDraftAdvisory={onDraftAdvisory}
          activeScenarioName="Simulated Cyclone Varun / Coastal Threat Envelope"
          showEvacuationRoute={true}
          selectedLocation={selectedLocation}
          selectedDepartment={selectedDepartment}
          currentScenarioKey={currentScenarioKey}
          locationConfig={locationConfig}
        />
      </div>
    </div>
  );
};
