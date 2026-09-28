import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowDown, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Layers, 
  ArrowRight, 
  Flame, 
  FileText,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { DamageChain, RiskLevel, DepartmentType, DependencyChainNode } from '../../types';
import { MOCK_DAMAGE_CHAINS } from '../../data/mockData';

interface DamageChainsViewProps {
  onDraftAdvisoryForAsset?: (assetId: string) => void;
  selectedDepartment: DepartmentType;
}

export const DamageChainsView: React.FC<DamageChainsViewProps> = ({
  onDraftAdvisoryForAsset,
  selectedDepartment,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<string>(MOCK_DAMAGE_CHAINS[0].id);
  const [mitigationApplied, setMitigationApplied] = useState<Record<string, boolean>>({});

  const currentChain = MOCK_DAMAGE_CHAINS.find(c => c.id === selectedChainId) || MOCK_DAMAGE_CHAINS[0];
  const isMitigated = !!mitigationApplied[currentChain.id];

  const toggleMitigation = (chainId: string) => {
    setMitigationApplied(prev => ({
      ...prev,
      [chainId]: !prev[chainId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <GitFork className="w-3.5 h-3.5" />
              Cascading Infrastructure Failure Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Damage Chain Analysis & Dependency Cascades
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Standard cyclone models stop at wind envelopes. PRAVAH AI analyzes multi-tiered failure chains: how storm surge flooding a substation subsequently triggers ICU power failures and cuts water supply.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold">
              Active Chains: <strong className="text-purple-700">{MOCK_DAMAGE_CHAINS.length} Modelled</strong>
            </span>
          </div>
        </div>

        {/* Chain Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          {MOCK_DAMAGE_CHAINS.map((chain) => {
            const isSelected = chain.id === selectedChainId;
            const chainMitigated = !!mitigationApplied[chain.id];

            return (
              <div
                key={chain.id}
                onClick={() => setSelectedChainId(chain.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-purple-50/70 border-purple-300 shadow-xs ring-1 ring-purple-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="font-bold text-slate-500">{chain.id}</span>
                  {chainMitigated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      ✓ MITIGATED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                      {chain.priority}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {chain.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {chain.potentialConsequence}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Cascade Interactive Visualizer */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Cascade Title & Simulation Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {currentChain.title}
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                {currentChain.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentChain.potentialConsequence}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleMitigation(currentChain.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                isMitigated
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isMitigated ? 'Mitigation Active (Neutralized)' : 'Simulate Pre-Emptive Mitigation'}</span>
            </button>

            {onDraftAdvisoryForAsset && (
              <button
                onClick={() => onDraftAdvisoryForAsset(currentChain.primaryAssetId || 'H-07')}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Draft Advisory
              </button>
            )}
          </div>
        </div>

        {/* Node Cascade Workflow Graphic */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
            Cascading Impact Propagation Sequence:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {currentChain.nodes.map((node: DependencyChainNode, idx: number) => {
              const nodeNeutralized = isMitigated && idx >= 2;

              return (
                <div key={node.id} className="relative flex flex-col justify-between">
                  <div
                    className={`p-4 rounded-xl border text-xs flex flex-col justify-between h-full transition-all ${
                      nodeNeutralized
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                        : idx === 0
                        ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                        : idx === 1
                        ? 'bg-rose-50/80 border-rose-200 text-slate-800'
                        : idx === 2
                        ? 'bg-purple-50/80 border-purple-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          STAGE {idx + 1}
                        </span>
                        {nodeNeutralized ? (
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">
                            PROTECTED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-600 font-bold">
                            {node.riskLevel}
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        {node.type}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mt-1 leading-snug">
                        {node.label}
                      </h4>

                      <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                        {nodeNeutralized ? 'Contingency measure engaged. Chain broken before lifeline failure.' : node.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                      Node ID: <strong className="text-slate-700">{node.id}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Department Action Triggered by this Chain */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-blue-700 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Prioritized Inter-Agency Intervention
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
              DIRECTIVE: HIGH PRIORITY
            </span>
          </div>

          <p className="text-slate-800 font-medium leading-relaxed">
            {currentChain.recommendedAction}
          </p>

          <div className="text-[11px] text-slate-600 flex items-center gap-4 pt-1 font-mono">
            <span>Primary Sector: <strong>{currentChain.affectedDepartments.join(', ')}</strong></span>
            <span>Trigger Hazard: <strong>{currentChain.triggerHazard}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
