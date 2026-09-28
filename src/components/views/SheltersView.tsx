import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Zap, 
  Fuel, 
  Droplets, 
  Search, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Phone
} from 'lucide-react';
import { InfrastructureAsset } from '../../types';

interface SheltersViewProps {
  assets: InfrastructureAsset[];
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
}

export const SheltersView: React.FC<SheltersViewProps> = ({
  assets,
  onSelectAsset,
  onDraftAdvisory,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'OPERATIONAL'>('ALL');

  const shelters = assets.filter(a => a.type === 'Emergency Shelter');

  const filteredShelters = shelters.filter(s => {
    if (filterStatus === 'CRITICAL' && s.riskLevel !== 'CRITICAL') return false;
    if (filterStatus === 'HIGH' && s.riskLevel !== 'HIGH') return false;
    if (filterStatus === 'OPERATIONAL' && s.status !== 'Operational') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.district.toLowerCase().includes(q);
    }
    return true;
  });

  const totalCapacity = 10600;
  const currentOccupancy = 9640;
  const criticalSheltersCount = shelters.filter(s => s.riskLevel === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Regional Cyclone Shelter Network & Logistics
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Emergency Shelter Readiness & Occupancy Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Monitoring 8 dedicated multi-purpose cyclone shelters across coastal districts. Tracks live occupancy ratios, auxiliary generator diesel reserves, potable drinking water, and road isolation risk.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Total Sites</span>
              <span className="text-lg font-black text-slate-900 font-mono">{shelters.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Occupancy</span>
              <span className="text-lg font-black text-blue-700 font-mono">91%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">At Risk</span>
              <span className="text-lg font-black text-rose-700 font-mono">{criticalSheltersCount}</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search shelters by name, Gram Panchayat, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['ALL', 'CRITICAL', 'HIGH', 'OPERATIONAL'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShelters.map((shelter) => {
          const isCritical = shelter.riskLevel === 'CRITICAL';
          const isHigh = shelter.riskLevel === 'HIGH';

          return (
            <div
              key={shelter.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    {shelter.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isCritical
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : isHigh
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {shelter.riskLevel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {shelter.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  District: {shelter.district}
                </p>

                {/* Capacity metric */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-500 font-semibold">Occupancy vs Capacity</span>
                    <strong className="text-slate-900">{shelter.capacity || '1,200 Persons'}</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCritical ? 'bg-rose-600' : isHigh ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: isCritical ? '94%' : isHigh ? '86%' : '72%' }}
                    ></div>
                  </div>
                </div>

                {/* Vulnerability Note */}
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>
                    <strong className="text-slate-700">Hazards:</strong> {shelter.hazards.join(', ')}
                  </div>
                  <div>
                    <strong className="text-slate-700">Dependencies:</strong> {shelter.dependencies.join(', ')}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectAsset(shelter)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Inspect Site →
                </button>
                {onDraftAdvisory && (
                  <button
                    onClick={() => onDraftAdvisory(shelter)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Draft Advisory
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
