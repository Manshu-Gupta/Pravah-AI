import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Edit3, 
  RotateCw, 
  Copy, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Check, 
  Flame, 
  Building2, 
  ChevronRight, 
  Radio, 
  ExternalLink,
  Download
} from 'lucide-react';
import { InfrastructureAsset, AIAdvisory, DepartmentType, AdvisoryStatus, RiskLevel } from '../../types';
import { generateAdvisoryWithAI } from '../../services/geminiService';

interface AdvisoryCenterViewProps {
  assets: InfrastructureAsset[];
  advisories: AIAdvisory[];
  onAddNewAdvisory: (advisory: AIAdvisory) => void;
  onUpdateAdvisoryStatus: (id: string, newStatus: AdvisoryStatus) => void;
  initialSelectedAssetId?: string;
  selectedDepartment: DepartmentType;
  officerName: string;
}

export const AdvisoryCenterView: React.FC<AdvisoryCenterViewProps> = ({
  assets,
  advisories,
  onAddNewAdvisory,
  onUpdateAdvisoryStatus,
  initialSelectedAssetId,
  selectedDepartment,
  officerName,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    initialSelectedAssetId || 'H-07'
  );
  const [department, setDepartment] = useState<DepartmentType>(
    selectedDepartment !== 'ALL' ? selectedDepartment : 'HEALTH'
  );
  const [district, setDistrict] = useState<string>('Kendrapara');
  const [riskEvent, setRiskEvent] = useState<string>(
    'Simulated Cyclone Varun Pre-Landfall Front (Surge 2.8m, Rain 240mm)'
  );
  const [severity, setSeverity] = useState<RiskLevel>('CRITICAL');
  const [customInstructions, setCustomInstructions] = useState<string>(
    'Focus on ambulance route continuity and standby generator test compliance.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDraft, setActiveDraft] = useState<Partial<AIAdvisory> | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const targetAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAdvisoryWithAI({
        department,
        district,
        riskEvent,
        asset: targetAsset,
        severity,
        customInstructions,
      });
      setActiveDraft(res.advisory);
    } catch (err) {
      console.error('Error generating advisory:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveDraft = () => {
    if (!activeDraft) return;
    const newAdvisory: AIAdvisory = {
      id: activeDraft.id || `ADV-${Date.now().toString().slice(-4)}`,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      department: department,
      district: district,
      severity: severity,
      reviewer: officerName,
      situationSummary: activeDraft.situationSummary || '',
      whyAssetMatters: activeDraft.whyAssetMatters || '',
      potentialImpact: activeDraft.potentialImpact || '',
      recommendedPreparatoryActions: activeDraft.recommendedPreparatoryActions || activeDraft.recommendedActions || targetAsset.recommendedActions,
      urgency: severity,
      evidenceInputs: `Hydrodynamic Inundation + ${targetAsset.type} Structural Lifeline Analysis`,
      recommendedActions: activeDraft.recommendedActions || targetAsset.recommendedActions,
      status: 'Approved',
      approvedBy: officerName,
      approvedAt: new Date().toLocaleTimeString(),
      generatedAt: 'Just now',
    };
    onAddNewAdvisory(newAdvisory);
    setActiveDraft(null);
  };

  const handleCopy = () => {
    if (!activeDraft) return;
    const text = `
PRAVAH AI — OFFICIAL ADVISORY BULLETIN [${activeDraft.id}]
Target: ${targetAsset.name} (${targetAsset.id})
Department: ${department} | District: ${district} | Urgency: ${severity}

1. SITUATION SUMMARY:
${activeDraft.situationSummary}

2. WHY THIS ASSET MATTERS:
${activeDraft.whyAssetMatters}

3. POTENTIAL IMPACT:
${activeDraft.potentialImpact}

4. RECOMMENDED DIRECTIVES:
${activeDraft.recommendedActions?.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Issued under State Disaster Protocol. Human Review Required.
    `.trim();
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Human-in-the-Loop AI Advisory Studio
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gemini AI Advisory Copilot & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Gemini 3.8 Flash translates multi-hazard calculations and infrastructure dependency data into actionable, department-specific directives. Drafts are subject to mandatory authorization before dissemination.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Verified Bulletins: {advisories.filter((a) => a.status === 'Approved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left 5 cols) + Output (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Generation Parameters */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Advisory Formulation Parameters
            </h3>
            <span className="text-[10px] font-mono text-slate-400">GEMINI 3.8 FLASH</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Asset Selector */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                Target Lifeline Asset:
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} — {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                Recipient Department:
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="HEALTH">Health & Medical Services</option>
                <option value="POWER">Power & Energy Grid</option>
                <option value="ROADS">Roads, Bridges & PWD</option>
                <option value="MUNICIPAL">Municipal & Water Works</option>
                <option value="DISASTER MANAGEMENT">Disaster Management (OSDMA)</option>
              </select>
            </div>

            {/* Severity Pill Selector */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                Operational Severity Level:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
                      severity === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : lvl === 'HIGH'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Context Telemetry Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-mono text-[10px] text-blue-700 font-bold uppercase">
                Active Ingested Telemetry for {targetAsset.id}:
              </div>
              <div className="text-slate-600">
                <strong>Vulnerability:</strong> {targetAsset.vulnerability}
              </div>
              <div className="text-slate-600">
                <strong>Dependencies:</strong> {targetAsset.dependencies.join(', ')}
              </div>
              <div className="text-slate-600">
                <strong>Time Window:</strong> {targetAsset.timeToImpact} to impact
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                Officer Focus Guidance (Optional):
              </label>
              <textarea
                rows={2}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Specific guidance for field crews..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Generating Structured Advisory with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Generate AI Advisory Draft
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Generated Advisory Output */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-wider">
                  Advisory Draft Workspace
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeDraft ? `${activeDraft.assetName} (${activeDraft.assetId})` : 'Awaiting Generation...'}
                </h3>
              </div>

              {activeDraft && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Copy Advisory Text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Edit Advisory"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {copiedNotification && (
              <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono text-center font-bold">
                ✓ Full Advisory copied to clipboard!
              </div>
            )}

            {activeDraft ? (
              <div className="space-y-4 text-xs">
                {/* Top Meta Strip */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono">
                  <span className="text-blue-700 font-bold">{activeDraft.id}</span>
                  <span className="text-rose-700 font-bold">{activeDraft.urgency}</span>
                  <span className="text-slate-400">{activeDraft.generatedAt}</span>
                </div>

                {/* 1. Situation Summary */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-blue-700 block mb-1 font-bold">
                    1. Situation Summary:
                  </label>
                  {isEditingDraft ? (
                    <textarea
                      rows={3}
                      value={activeDraft.situationSummary}
                      onChange={(e) => setActiveDraft({ ...activeDraft, situationSummary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-medium">
                      {activeDraft.situationSummary}
                    </div>
                  )}
                </div>

                {/* 2. Why This Asset Matters */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1 font-bold">
                    2. Why This Asset Matters:
                  </label>
                  {isEditingDraft ? (
                    <textarea
                      rows={2}
                      value={activeDraft.whyAssetMatters}
                      onChange={(e) => setActiveDraft({ ...activeDraft, whyAssetMatters: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                      {activeDraft.whyAssetMatters}
                    </div>
                  )}
                </div>

                {/* 3. Potential Impact */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-rose-700 block mb-1 font-bold">
                    3. Potential Cascade Impact:
                  </label>
                  {isEditingDraft ? (
                    <textarea
                      rows={2}
                      value={activeDraft.potentialImpact}
                      onChange={(e) => setActiveDraft({ ...activeDraft, potentialImpact: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  ) : (
                    <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 leading-relaxed">
                      {activeDraft.potentialImpact}
                    </div>
                  )}
                </div>

                {/* 4. Recommended Actions */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 block mb-1 font-bold">
                    4. Recommended Pre-Landfall Directives:
                  </label>
                  <div className="space-y-1.5">
                    {activeDraft.recommendedActions?.map((act, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-slate-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <div className="font-bold text-slate-700 text-sm">No Active Advisory Draft</div>
                <p className="text-xs max-w-sm text-slate-500">
                  Select a target lifeline asset on the left and click &ldquo;Generate AI Advisory Draft&rdquo; to formulate an operational bulletin with Gemini.
                </p>
              </div>
            )}
          </div>

          {/* Action Approval Controls */}
          {activeDraft && (
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveDraft(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Discard Draft
              </button>
              <button
                onClick={handleApproveDraft}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Authorize & Publish Advisory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
