import { InfrastructureAsset, AIAdvisory, DepartmentType } from '../types';

export interface GenerateAdvisoryParams {
  department: DepartmentType;
  district: string;
  riskEvent: string;
  asset: InfrastructureAsset;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  customInstructions?: string;
}

export async function generateAdvisoryWithAI(params: GenerateAdvisoryParams): Promise<{
  advisory: Partial<AIAdvisory>;
  source: string;
  warning?: string;
}> {
  try {
    const res = await fetch('/api/advisory/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cycloneName: 'Simulated Cyclone Varun',
        department: params.department,
        district: params.district,
        riskEvent: params.riskEvent,
        asset: {
          id: params.asset.id,
          name: params.asset.name,
          type: params.asset.type,
          district: params.asset.district,
          riskScore: params.asset.riskScore,
          riskLevel: params.severity || params.asset.riskLevel,
          hazards: params.asset.hazards,
          dependencies: params.asset.dependencies,
          potentialImpact: params.asset.potentialImpact,
          timeToImpact: params.asset.timeToImpact,
          recommendedActions: params.asset.recommendedActions,
        },
        severity: params.severity,
        customInstructions: params.customInstructions,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      advisory: {
        department: params.department,
        district: params.district,
        assetId: params.asset.id,
        assetName: params.asset.name,
        severity: params.severity,
        situationSummary: data.advisory?.situationSummary || `Projected multi-hazard impacts on ${params.asset.name}.`,
        whyAssetMatters: data.advisory?.whyAssetMatters || `${params.asset.name} is a key infrastructure node in ${params.district}.`,
        potentialImpact: data.advisory?.potentialImpact || params.asset.potentialImpact,
        recommendedPreparatoryActions: data.advisory?.recommendedPreparatoryActions || params.asset.recommendedActions,
        urgency: data.advisory?.urgency || 'CRITICAL IMMEDIATE (T-3h)',
        evidenceInputs: data.advisory?.evidenceInputs || `Model Risk Score: ${params.asset.riskScore}/100. Time to impact: ${params.asset.timeToImpact}.`,
      },
      source: data.source || 'gemini-3.8-flash',
      warning: data.warning,
    };
  } catch (err: any) {
    console.warn('[PRAVAH AI] Direct backend fetch encountered error, using pre-calibrated engine fallback:', err);
    return {
      advisory: {
        department: params.department,
        district: params.district,
        assetId: params.asset.id,
        assetName: params.asset.name,
        severity: params.severity,
        situationSummary: `Simulated multi-hazard projections for Cyclone Varun indicate high vulnerability for ${params.asset.name} (${params.asset.id}) under projected rainfall and storm surge conditions.`,
        whyAssetMatters: `${params.asset.name} is a critical facility supporting emergency operations and public safety in ${params.district}.`,
        potentialImpact: params.asset.potentialImpact || 'Potential service disruption and access constraints across linked networks.',
        recommendedPreparatoryActions: params.asset.recommendedActions || [
          'Verify emergency backup generator readiness and fuel storage',
          'Deploy field quick response teams along designated fallback routes',
          'Establish continuous two-way radio link with District Emergency Center',
        ],
        urgency: params.severity === 'CRITICAL' ? 'CRITICAL IMMEDIATE (T-3h)' : 'HIGH MOBILIZE (T-6h)',
        evidenceInputs: `Calculated multi-hazard risk score: ${params.asset.riskScore}/100. Est. landfall impact in ${params.asset.timeToImpact}. Primary hazards: ${params.asset.hazards.join(', ')}.`,
      },
      source: 'offline-calibrated-engine',
      warning: 'Operating on local calibrated risk model.',
    };
  }
}
