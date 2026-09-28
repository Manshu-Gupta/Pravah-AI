import React, { useState } from 'react';
import { 
  History, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { PostEventRecord } from '../../types';
import { MOCK_POST_EVENT_RECORDS } from '../../data/mockData';

export const PostEventAnalysisView: React.FC = () => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    MOCK_POST_EVENT_RECORDS[0].id
  );

  const selectedRecord = MOCK_POST_EVENT_RECORDS.find(r => r.id === selectedRecordId) || MOCK_POST_EVENT_RECORDS[0];

  // Benchmark stats
  const avgAccuracy = 95.9;
  const totalAssetsVerified = 32;
  const falsePositives = '3.1%';
  const leadTimeAccuracy = '98.2%';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Continuous Model Learning & Calibration
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Post-Event Verification & Accuracy Analysis
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              &ldquo;Use verified post-event observations to improve future risk assessments.&rdquo; 
              Evaluate synthetic ground-truth sensor reports against predictive multi-hazard forecasts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Notice: Simulated historical / event ground-truth data
            </span>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> Overall Model Accuracy
            </span>
            <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
              {avgAccuracy}%
            </div>
            <span className="text-[10px] text-slate-400">Average cross-asset precision</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Validated Nodes
            </span>
            <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
              {totalAssetsVerified} / {totalAssetsVerified}
            </div>
            <span className="text-[10px] text-slate-400">100% telemetry coverage</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Inundation Alignment
            </span>
            <div className="text-2xl font-black text-sky-300 font-mono mt-1">
              {leadTimeAccuracy}
            </div>
            <span className="text-[10px] text-slate-400">Hydraulic model correlation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> False Alarm Rate
            </span>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">
              {falsePositives}
            </div>
            <span className="text-[10px] text-slate-400">Minimal unnecessary evacuation</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Comparison: Predicted vs Observed Risk Scores */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Predicted Risk vs Observed Ground Impact (Variance & Delta)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across major audited infrastructure sectors.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500"></span>
              <span className="text-slate-300">Predicted Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span className="text-slate-300">Observed Impact</span>
            </div>
          </div>
        </div>

        {/* SVG Comparative Bar Chart */}
        <div className="space-y-4">
          {MOCK_POST_EVENT_RECORDS.map((record) => {
            const isSelected = selectedRecordId === record.id;
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecordId(record.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {record.assetName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({record.zone})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-cyan-300">Pred: {record.predictedRiskScore}</span>
                    <span className="text-amber-300">Obs: {record.observedImpactScore}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]">
                      {record.predictionAccuracy}
                    </span>
                  </div>
                </div>

                {/* Progress Dual Bars */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-cyan-400 w-12">PRED</span>
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${record.predictedRiskScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-amber-400 w-12">OBSVD</span>
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${record.observedImpactScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Inspection Panel for Selected Audit Record */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-3 mb-3 border-b border-slate-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Field After-Action Report (AAR) — {selectedRecord.assetName}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-semibold text-rose-300 block mb-1 text-[11px] uppercase tracking-wider font-mono">
              Observed Physical Damage & Disruptions
            </span>
            <p className="text-slate-200 leading-relaxed">
              {selectedRecord.damageObserved}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30">
            <span className="font-semibold text-teal-300 block mb-1 text-[11px] uppercase tracking-wider font-mono">
              Key Policy & Tactical Calibration Takeaway
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              {selectedRecord.keyLearning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
