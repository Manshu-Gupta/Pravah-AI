import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Zap, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  FileText, 
  SlidersHorizontal 
} from 'lucide-react';
import { InfrastructureAsset } from '../types';

interface AssetDetailModalProps {
  asset: InfrastructureAsset | null;
  onClose: () => void;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
  onSimulateWhatIf?: (asset: InfrastructureAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onDraftAdvisory,
  onSimulateWhatIf,
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {asset.id}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                {asset.type} • {asset.district} District
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {asset.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Calculated Risk</span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">
              {asset.riskScore}/100
            </div>
            <span className="text-[10px] font-bold text-rose-700">Level: {asset.riskLevel}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Time to Impact</span>
            <div className="text-xl font-black text-blue-700 font-mono mt-0.5">
              {asset.timeToImpact}
            </div>
            <span className="text-[10px] font-semibold text-slate-500">T-Minus Window</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Department</span>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {asset.department}
            </div>
            <span className="text-[10px] font-mono text-slate-500">Sector Owner</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Coordinates</span>
            <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
              {asset.latitude.toFixed(3)}°N, {asset.longitude.toFixed(3)}°E
            </div>
            <span className="text-[10px] font-semibold text-emerald-700">GIS Anchored</span>
          </div>
        </div>

        {/* Vulnerability & Exposure Sections */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Exposure & Hydrodynamic Vulnerability
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              {asset.vulnerability}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-purple-700 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              Critical Dependencies & Downstream Linkages
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {asset.dependencies.map((dep, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-purple-800 font-mono font-bold text-xs">
                  {dep}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-blue-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Primary Pre-Landfall Directives
            </h4>
            <ul className="space-y-1 text-slate-800 font-medium">
              {asset.recommendedActions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          {onSimulateWhatIf && (
            <button
              onClick={() => {
                onSimulateWhatIf(asset);
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
              Simulate in What-If
            </button>
          )}

          {onDraftAdvisory && (
            <button
              onClick={() => {
                onDraftAdvisory(asset);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Gemini Advisory Draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
