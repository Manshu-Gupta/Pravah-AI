import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Clock, 
  SlidersHorizontal,
  Sparkles,
  Download
} from 'lucide-react';
import { InfrastructureAsset, AssetType, RiskLevel, DepartmentType } from '../../types';

interface CriticalAssetsViewProps {
  assets: InfrastructureAsset[];
  selectedDepartment: DepartmentType;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
}

export const CriticalAssetsView: React.FC<CriticalAssetsViewProps> = ({
  assets,
  selectedDepartment,
  onSelectAsset,
  onDraftAdvisory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'timeToImpact'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const assetTypes = useMemo(() => {
    const types = new Set<string>();
    assets.forEach(a => types.add(a.type));
    return ['ALL', ...Array.from(types)];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Department filter
      if (selectedDepartment !== 'ALL' && asset.department !== selectedDepartment) {
        return false;
      }
      // Type filter
      if (selectedType !== 'ALL' && asset.type !== selectedType) {
        return false;
      }
      // Risk filter
      if (selectedRisk !== 'ALL' && asset.riskLevel !== selectedRisk) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const match = 
          asset.name.toLowerCase().includes(q) ||
          asset.id.toLowerCase().includes(q) ||
          asset.district.toLowerCase().includes(q) ||
          asset.type.toLowerCase().includes(q) ||
          asset.hazards.some(h => h.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'riskScore') {
        return sortOrder === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
      } else {
        return sortOrder === 'desc' ? b.timeToImpactHours - a.timeToImpactHours : a.timeToImpactHours - b.timeToImpactHours;
      }
    });
  }, [assets, selectedDepartment, selectedType, selectedRisk, search, sortBy, sortOrder]);

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {score} • CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            {score} • HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
            {score} • MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {score} • LOW
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Type', 'District', 'Risk Score', 'Risk Level', 'Time to Impact', 'Status'];
    const rows = filteredAssets.map(a => [
      a.id,
      `"${a.name}"`,
      a.type,
      a.district,
      a.riskScore,
      a.riskLevel,
      `"${a.timeToImpact}"`,
      a.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pravah_infrastructure_risk_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Filter Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              State Critical Lifelines Registry
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Infrastructure Asset Risk Inventory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-sector exposure analytics spanning hospitals, power feeders, arterial roads, and cyclone shelters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Export CSV
            </button>
            <span className="text-xs font-mono px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold">
              Showing: <strong className="text-blue-700">{filteredAssets.length}</strong> Assets
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, name, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              {assetTypes.map(t => (
                <option key={t} value={t}>Type: {t}</option>
              ))}
            </select>
          </div>

          {/* Risk filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (80-100)</option>
              <option value="HIGH">High (60-79)</option>
              <option value="MEDIUM">Medium (40-59)</option>
              <option value="LOW">Low (0-39)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sortBy === 'riskScore') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('riskScore');
                  setSortOrder('desc');
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer ${
                sortBy === 'riskScore'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Risk ({sortOrder.toUpperCase()})
            </button>

            <button
              onClick={() => {
                if (sortBy === 'timeToImpact') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('timeToImpact');
                  setSortOrder('asc');
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer ${
                sortBy === 'timeToImpact'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Impact Time
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-3">District</th>
                <th className="py-3.5 px-3">Risk Score</th>
                <th className="py-3.5 px-3">Hazards</th>
                <th className="py-3.5 px-3">Time to Impact</th>
                <th className="py-3.5 px-3">Dependencies</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => {
                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-blue-700 font-bold border border-slate-200">
                          {asset.id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {asset.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {asset.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {asset.type}
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {asset.district}
                    </td>

                    <td className="py-3 px-3">
                      {getRiskBadge(asset.riskLevel, asset.riskScore)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {asset.hazards.map(h => (
                          <span key={h} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      {asset.timeToImpact}
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] text-purple-700 font-mono font-medium truncate max-w-[140px] block" title={asset.dependencies.join(', ')}>
                        {asset.dependencies.length > 0 ? asset.dependencies.join(', ') : 'None'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Open Deep Profile"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        {onDraftAdvisory && (
                          <button
                            onClick={() => onDraftAdvisory(asset)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors shadow-xs flex items-center gap-1"
                            title="Generate AI Advisory"
                          >
                            <Sparkles className="w-3 h-3" />
                            Draft
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
