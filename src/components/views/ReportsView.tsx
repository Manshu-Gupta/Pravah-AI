import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Printer, 
  FileSpreadsheet, 
  FileCode, 
  Building2, 
  Clock, 
  Layers 
} from 'lucide-react';
import { InfrastructureAsset, AIAdvisory } from '../../types';

interface ReportsViewProps {
  assets: InfrastructureAsset[];
  advisories: AIAdvisory[];
  activeScenarioName: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  assets,
  advisories,
  activeScenarioName,
}) => {
  const [reportType, setReportType] = useState<'risk' | 'assets' | 'chains' | 'advisories'>('risk');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'assets' || reportType === 'risk') {
      csvContent += 'Asset ID,Asset Name,Type,District,Risk Score,Risk Level,Time To Impact,Dependencies,Potential Impact\n';
      assets.forEach(a => {
        csvContent += `"${a.id}","${a.name}","${a.type}","${a.district}",${a.riskScore},"${a.riskLevel}","${a.timeToImpact}","${a.dependencies.join('; ')}","${a.potentialImpact.replace(/"/g, '""')}"\n`;
      });
    } else {
      csvContent += 'Advisory ID,Department,Asset,Severity,Status,Generated,Reviewer\n';
      advisories.forEach(adv => {
        csvContent += `"${adv.id}","${adv.department}","${adv.assetName}","${adv.severity || adv.urgency}","${adv.status}","${adv.generatedAt}","${adv.reviewer || adv.approvedBy || 'Command'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PRAVAH_AI_${reportType.toUpperCase()}_REPORT.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`CSV Report for ${reportType.toUpperCase()} exported successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      system: 'PRAVAH AI Disaster Command Platform',
      scenario: activeScenarioName,
      generatedAt: new Date().toISOString(),
      reportType,
      assets: reportType === 'assets' || reportType === 'risk' ? assets : undefined,
      advisories: reportType === 'advisories' ? advisories : undefined,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PRAVAH_AI_${reportType.toUpperCase()}_REPORT.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`JSON Manifest exported successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              Executive Assessment & Reporting Suite
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Operational Briefings & Formal Audit Dossiers
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Export verified multi-hazard exposure tables, dependency cascade diagrams, and approved AI advisories for inter-agency coordination.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-blue-600" />
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Dossier
            </button>
          </div>
        </div>

        {/* Report Category Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'risk', title: 'Multi-Hazard Risk Summary', count: '32 Nodes' },
            { id: 'assets', title: 'Critical Infrastructure Audit', count: '10 Roads / 6 Hospitals' },
            { id: 'chains', title: 'Damage Chain Intelligence', count: '3 Key Cascades' },
            { id: 'advisories', title: 'Approved AI Advisories', count: `${advisories.length} Bulletins` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setReportType(item.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                reportType === item.id
                  ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] font-mono text-blue-700 uppercase font-bold">{item.count}</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{item.title}</div>
            </button>
          ))}
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono text-center font-bold">
          ✓ {downloadSuccess}
        </div>
      )}

      {/* Main Report Viewable Sheet */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              STATE DISASTER MANAGEMENT COMMISSION • PROTOCOL 2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Official Situation Report: {activeScenarioName}
            </h3>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div className="text-emerald-600 font-bold">STATUS: AUTHORIZED BRIEFING</div>
          </div>
        </div>

        {/* Report Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-bold">
              <tr>
                <th className="py-2.5 px-3">Item / Entity</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Time Window</th>
                <th className="py-2.5 px-3">Key Vulnerability / Action Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.slice(0, 10).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <span className="font-mono text-blue-700 text-[10px] mr-1.5 font-bold">[{a.id}]</span>
                    {a.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{a.type}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">
                    <span className={a.riskLevel === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}>
                      {a.riskScore}/100 [{a.riskLevel}]
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{a.timeToImpact}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{a.recommendedActions[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
