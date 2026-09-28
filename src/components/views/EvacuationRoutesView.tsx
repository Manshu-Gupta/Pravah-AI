import React, { useState } from 'react';
import { 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Waves,
  Building2,
  Check,
  XCircle,
  TrendingDown
} from 'lucide-react';
import { DisasterMap } from '../DisasterMap';
import { InfrastructureAsset } from '../../types';

interface EvacuationRoutesViewProps {
  assets: InfrastructureAsset[];
  onSelectAsset: (asset: InfrastructureAsset) => void;
  selectedAsset: InfrastructureAsset | null;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
}

export const EvacuationRoutesView: React.FC<EvacuationRoutesViewProps> = ({
  assets,
  onSelectAsset,
  selectedAsset,
  onDraftAdvisory,
}) => {
  const [originId, setOriginId] = useState<string>('H-07');
  const [destinationId, setDestinationId] = useState<string>('S-04');
  const [selectedRouteId, setSelectedRouteId] = useState<'route_a' | 'route_b'>('route_b');

  const originAsset = assets.find(a => a.id === originId) || assets[0];
  const destinationAsset = assets.find(a => a.id === destinationId) || assets.find(a => a.type === 'Emergency Shelter') || assets[0];

  const routeData = {
    origin: `${originAsset.name} (${originAsset.id})`,
    destination: `${destinationAsset.name} (${destinationAsset.id})`,
    recommendedRoute: 'route_b',
    routes: [
      {
        id: 'route_a' as const,
        name: 'Route A: Direct Coastal Highway SH-12 / R-17 Corridor',
        distance: '3.2 km',
        time: '14 min',
        floodExposure: 'HIGH (1.2m depth over 800m stretch)',
        bridgeStatus: 'Vulnerable (Bridge B-12 pier scour risk)',
        status: 'NOT RECOMMENDED',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        summary: 'Direct trajectory, but passes through low-elevation delta basin at +0.6m MSL subject to acute tidal surge overtopping.',
      },
      {
        id: 'route_b' as const,
        name: 'Route B: Western Elevated Bypass R-21 Corridor',
        distance: '4.8 km',
        time: '22 min',
        floodExposure: 'LOW (Clear elevated bund +3.5m MSL)',
        bridgeStatus: 'Clear (High-level box culverts installed 2024)',
        status: 'RECOMMENDED',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        summary: '1.6 km longer, but avoids all tidal flood zones. Police escort posts and clearance tractors staged along alignment.',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              Dynamic Inundation-Aware Navigation
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Evacuation Corridor Analysis & Route Recommendation
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Standard GPS navigators route via shortest distance (Coastal SH-12) ignoring storm surge. PRAVAH AI evaluates terrain elevation, hydrodynamic flood vectors, and infrastructure integrity to recommend life-safe corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Safe Bypass: R-21 Verified
            </span>
          </div>
        </div>

        {/* Origin & Destination Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              Evacuation Origin (Hospital / Facility)
            </label>
            <select
              value={originId}
              onChange={e => setOriginId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {assets.filter(a => a.type === 'Hospital' || a.riskLevel === 'CRITICAL').map(a => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.name} ({a.district})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Safe Destination (Designated Cyclone Shelter)
            </label>
            <select
              value={destinationId}
              onChange={e => setDestinationId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {assets.filter(a => a.type === 'Emergency Shelter').map(a => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.name} ({a.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Route Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View */}
        <div className="lg:col-span-7 h-[540px]">
          <DisasterMap
            assets={assets}
            selectedAsset={originAsset}
            onSelectAsset={onSelectAsset}
            onDraftAdvisory={onDraftAdvisory}
            showEvacuationRoute={true}
            selectedRouteId={selectedRouteId}
          />
        </div>

        {/* Route Comparison Cards */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Corridor Comparison Assessment:
            </div>

            {routeData.routes.map(r => {
              const isSelected = selectedRouteId === r.id;
              const isRecommended = r.id === 'route_b';

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isRecommended
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400 shadow-xs'
                        : 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {r.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${r.badgeClass}`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {r.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Distance & Time</span>
                      <strong className="text-slate-900">{r.distance} ({r.time})</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Flood Threat</span>
                      <strong className={isRecommended ? 'text-emerald-700' : 'text-rose-700'}>
                        {r.floodExposure.split(' ')[0]}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Directive */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-blue-700 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Special Relief Commissioner Directive:
              </span>
              <span className="text-blue-800 font-mono text-[10px] font-bold">
                ENFORCED BY POLICE
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              Order traffic diversion checkpoints at KM 28 to prohibit civilian transit along SH-12. Issue advisory to 108 Emergency Ambulance fleet to take Route B (R-21 Elevated Corridor).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
