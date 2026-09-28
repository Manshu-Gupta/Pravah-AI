import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Activity, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface DifferentiatorBannerProps {
  compact?: boolean;
}

export const DifferentiatorBanner: React.FC<DifferentiatorBannerProps> = ({ compact = false }) => {
  const steps = [
    { label: 'HAZARD', sub: 'Wind / Rain / Surge', icon: AlertTriangle, color: 'text-amber-700 border-amber-200 bg-amber-50' },
    { label: 'EXPOSURE', sub: 'Geospatial Inundation', icon: Activity, color: 'text-sky-700 border-sky-200 bg-sky-50' },
    { label: 'ASSET RISK', sub: 'Structural Vulnerability', icon: Zap, color: 'text-rose-700 border-rose-200 bg-rose-50' },
    { label: 'DAMAGE CHAIN', sub: 'Dependency Cascades', icon: ShieldCheck, color: 'text-purple-700 border-purple-200 bg-purple-50' },
    { label: 'ACTION', sub: 'T-Minus Timelines', icon: CheckCircle2, color: 'text-teal-700 border-teal-200 bg-teal-50' },
    { label: 'AI ADVISORY', sub: 'Human-in-the-Loop', icon: FileText, color: 'text-blue-700 border-blue-200 bg-blue-50' },
  ];

  if (compact) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold tracking-tight text-slate-800 uppercase flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Operational Intelligence Loop:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {steps.map((step, idx) => (
              <React.Fragment key={step.label}>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold border ${step.color}`}>
                  {step.label}
                </span>
                {idx < steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Core Architectural Differentiator
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            PRAVAH AI does not stop at predicting where the cyclone may go.
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            We connect <strong className="text-amber-700 font-semibold">hazards to infrastructure</strong>,{' '}
            <strong className="text-purple-700 font-semibold">infrastructure to dependencies</strong>, and{' '}
            <strong className="text-teal-700 font-semibold">dependencies to prioritized, department-specific actions</strong>.
          </p>
        </div>

        {/* Chain Flow */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.label}>
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[96px] text-center transition-transform hover:scale-105 ${step.color}`}>
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="font-mono text-[11px] font-bold tracking-tight">{step.label}</span>
                  <span className="text-[9px] opacity-80 mt-0.5 font-medium whitespace-nowrap">{step.sub}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
