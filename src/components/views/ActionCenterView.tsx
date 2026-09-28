import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Hourglass, 
  AlertTriangle, 
  Building2, 
  User, 
  ShieldCheck, 
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { AnticipatoryAction, ActionStatus, DepartmentType, RiskLevel } from '../../types';

interface ActionCenterViewProps {
  actions: AnticipatoryAction[];
  onUpdateActionStatus: (id: string, newStatus: ActionStatus) => void;
  selectedDepartment: DepartmentType;
  onOpenAssetDetailById?: (id: string) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  actions,
  onUpdateActionStatus,
  selectedDepartment,
  onOpenAssetDetailById,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');

  const phases = ['ALL', 'T - 24 HOURS', 'T - 12 HOURS', 'T - 6 HOURS', 'T - 3 HOURS'];

  const filteredActions = actions.filter(action => {
    if (selectedDepartment !== 'ALL' && action.department !== selectedDepartment) {
      return false;
    }
    if (selectedPhase !== 'ALL' && action.phase !== selectedPhase) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Escalated':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getPriorityBadge = (priority: RiskLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const completedCount = actions.filter(a => a.status === 'Completed').length;
  const inProgressCount = actions.filter(a => a.status === 'In Progress').length;
  const pendingCount = actions.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              Pre-Landfall Action Protocols
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Anticipatory Action Command Center
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Standard operating procedures structured into deterministic T-minus operational windows (T-24h, T-12h, T-6h) prior to projected landfall.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Completed</span>
              <span className="text-lg font-black text-emerald-700 font-mono">{completedCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">In Flight</span>
              <span className="text-lg font-black text-blue-700 font-mono">{inProgressCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Pending</span>
              <span className="text-lg font-black text-amber-700 font-mono">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1">Phase:</span>
          {phases.map(phase => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedPhase === phase
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredActions.map(action => (
          <div
            key={action.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  {action.id}
                </span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(action.priority)}`}>
                  {action.priority} PRIORITY
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {action.phase}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Sector: <strong className="text-slate-700">{action.department}</strong>
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                {action.actionText}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                Verification Criteria: {action.verificationCriteria}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                <span>Officer: <strong className="text-slate-700">{action.responsibleOfficer}</strong></span>
                <span>Deadline: <strong className="text-slate-700">{action.deadline}</strong></span>
                {action.relatedAssetId && (
                  <button
                    onClick={() => onOpenAssetDetailById?.(action.relatedAssetId)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Asset: {action.relatedAssetId} ({action.relatedAssetName}) →
                  </button>
                )}
              </div>
            </div>

            {/* Status Change Selector */}
            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getStatusBadge(action.status)}`}>
                {action.status.toUpperCase()}
              </span>

              <select
                value={action.status}
                onChange={e => onUpdateActionStatus(action.id, e.target.value as ActionStatus)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Pending">Mark Pending</option>
                <option value="In Progress">Mark In Progress</option>
                <option value="Completed">Mark Completed</option>
                <option value="Escalated">Mark Escalated</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
