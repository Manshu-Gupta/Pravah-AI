import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  TrendingUp, 
  MapPin, 
  Building2, 
  RefreshCw 
} from 'lucide-react';
import { WhatIfScenario, InfrastructureAsset } from '../../types';
import { MOCK_WHAT_IF_SCENARIOS, MOCK_ASSETS } from '../../data/mockData';
import { DisasterMap } from '../DisasterMap';

interface WhatIfSimulatorViewProps {
  onDraftAdvisoryForAsset?: (assetId: string) => void;
  onOpenAssetDetailById?: (id: string) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  onDraftAdvisoryForAsset,
  onOpenAssetDetailById,
}) => {
  // Slider states as specified in prompt
  const [surgeHeight, setSurgeHeight] = useState<number>(2.8);
  const [rainfallMm, setRainfallMm] = useState<number>(240);
  const [windSpeed, setWindSpeed] = useState<number>(145);

  // Infrastructure failure checkboxes
  const [roadR17Blocked, setRoadR17Blocked] = useState<boolean>(true);
  const [substationP03Down, setSubstationP03Down] = useState<boolean>(false);
  const [shelterS04Cutoff, setShelterS04Cutoff] = useState<boolean>(false);

  // Active scenario preset
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    MOCK_WHAT_IF_SCENARIOS[0].id
  );

  const [mapUpdateTimestamp, setMapUpdateTimestamp] = useState<string>('Just now');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const scenario = MOCK_WHAT_IF_SCENARIOS.find(s => s.id === selectedScenarioId) || MOCK_WHAT_IF_SCENARIOS[0];

  const handleUpdateMap = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setMapUpdateTimestamp(new Date().toLocaleTimeString());
    }, 250);
  };

  const handleResetSliders = () => {
    setSurgeHeight(2.8);
    setRainfallMm(240);
    setWindSpeed(145);
    setRoadR17Blocked(true);
    setSubstationP03Down(false);
    setShelterS04Cutoff(false);
    handleUpdateMap();
  };

  // Dynamically calculate impacts based on sliders
  const dynamicAffectedCount = Math.min(
    32,
    Math.round(8 + (surgeHeight / 1.2) * 4 + (rainfallMm / 100) * 3 + (roadR17Blocked ? 4 : 0) + (substationP03Down ? 6 : 0))
  );

  const dynamicPopulationAtRisk = Math.round(
    95000 + (surgeHeight * 22000) + (rainfallMm * 180) + (substationP03Down ? 45000 : 0)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Counterfactual Stress-Testing Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interactive What-If Hazard & Infrastructure Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Stress-test infrastructure defenses by simulating heightened storm surge, compound torrential precipitation, or simultaneous asset outages before cyclone landfall.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSliders}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Parameters
            </button>
            <button
              onClick={handleUpdateMap}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              Update Map Overlays
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_WHAT_IF_SCENARIOS.map(s => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedScenarioId(s.id);
                if (s.id.includes('surge')) {
                  setSurgeHeight(3.8);
                  setSubstationP03Down(true);
                } else if (s.id.includes('rain')) {
                  setRainfallMm(350);
                  setRoadR17Blocked(true);
                } else {
                  setWindSpeed(175);
                }
                handleUpdateMap();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenarioId === s.id
                  ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-bold text-blue-700">{s.id}</span>
                <span className="font-bold text-slate-500 uppercase">{s.triggerEvent.split(' ')[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{s.title}</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls (Left) + Interactive Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Hazard Stress Parameters
              </h3>
              <span className="text-[10px] font-mono text-slate-400">UPDATED: {mapUpdateTimestamp}</span>
            </div>

            {/* Slider 1: Surge Height */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-700">Storm Surge Amplitude</span>
                <span className="text-blue-700 text-sm font-black">{surgeHeight.toFixed(1)} Meters</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={surgeHeight}
                onChange={e => setSurgeHeight(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.5m (Tidal)</span>
                <span>2.8m (Base)</span>
                <span>5.0m (Extreme)</span>
              </div>
            </div>

            {/* Slider 2: Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-700">Cumulative 24h Rainfall</span>
                <span className="text-blue-700 text-sm font-black">{rainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={rainfallMm}
                onChange={e => setRainfallMm(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>50mm (Moderate)</span>
                <span>240mm (Heavy)</span>
                <span>500mm (Deluge)</span>
              </div>
            </div>

            {/* Slider 3: Wind Speed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-700">Peak Landfall Wind Speed</span>
                <span className="text-amber-700 text-sm font-black">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="90"
                max="220"
                step="5"
                value={windSpeed}
                onChange={e => setWindSpeed(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>90 km/h (CS)</span>
                <span>145 km/h (VSCS)</span>
                <span>220 km/h (Super)</span>
              </div>
            </div>

            {/* Infrastructure Failure Switches */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-mono uppercase font-bold text-slate-500">
                Lifeline Failure Injections:
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Arterial Road R-17 Blocked</div>
                  <div className="text-[10px] text-slate-500">Cuts direct ambulance access to District Hospital H-07</div>
                </div>
                <input
                  type="checkbox"
                  checked={roadR17Blocked}
                  onChange={e => setRoadR17Blocked(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Substation P-03 Flooded / Offline</div>
                  <div className="text-[10px] text-slate-500">Forces hospital H-07 & shelter S-04 onto backup generators</div>
                </div>
                <input
                  type="checkbox"
                  checked={substationP03Down}
                  onChange={e => setSubstationP03Down(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Cyclone Shelter S-04 Road Cutoff</div>
                  <div className="text-[10px] text-slate-500">Requires amphibious boat or helicopter relief supply</div>
                </div>
                <input
                  type="checkbox"
                  checked={shelterS04Cutoff}
                  onChange={e => setShelterS04Cutoff(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Projected Impact Output Summary */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-800">
                <span>SIMULATED OUTCOME:</span>
                <span>{dynamicAffectedCount} ASSETS COMPROMISED</span>
              </div>
              <div className="text-xs text-slate-700">
                Estimated civilian population exposed to service interruption: <strong className="text-slate-900">{dynamicPopulationAtRisk.toLocaleString()} Residents</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Map Display (7 cols) */}
        <div className="lg:col-span-7 h-[620px]">
          <DisasterMap
            assets={MOCK_ASSETS}
            selectedAsset={null}
            onSelectAsset={() => {}}
            activeScenarioName={`Simulated Stress Test (Surge: ${surgeHeight}m, Rain: ${rainfallMm}mm)`}
            showEvacuationRoute={roadR17Blocked}
            whatIfDisruptions={{
              roadR17Blocked,
              substationP03Down,
              shelterS04Cutoff,
              surgeHeight,
              rainfallMm,
            }}
          />
        </div>
      </div>
    </div>
  );
};
