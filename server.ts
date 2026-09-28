import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check / API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'TOOFAN AI Decision Support Engine',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
    demoMode: true,
    dataSources: {
      gee: 'Demo Pipeline (SRTM DEM, JRC Surface Water, Sentinel-1 SAR)',
      weather: 'IMD / ECMWF Ensemble (Simulated Cyclone Varsha & Varun)',
      gemini: !!apiKey ? 'Online (gemini-3.8-flash)' : 'Pre-calibrated fallback engine',
    },
  });
});

// GEE Manifest & Data Layers
app.get('/api/gee/layers', (req, res) => {
  res.json({
    status: 'Demo Mode (Pre-cached GEE Tile Layers)',
    project: process.env.EARTHENGINE_PROJECT || 'toofan-ai-geospatial',
    available_layers: [
      {
        id: 'gee_elevation_dem',
        name: 'NASA SRTM 30m Digital Elevation Model',
        type: 'elevation',
        palette: ['#006600', '#ffff00', '#993300', '#ffffff'],
        min: 0,
        max: 60,
        description: 'Calculates coastal lowlands prone to storm surge under 5m elevation datum.',
      },
      {
        id: 'gee_surface_water',
        name: 'JRC Global Surface Water (Permanent vs Flood)',
        type: 'water_bodies',
        palette: ['#ffffff', '#0ea5e9', '#0369a1'],
        description: 'Monthly water history identifying high-probability delta inundation channels.',
      },
      {
        id: 'gee_sentinel1_flood',
        name: 'Copernicus Sentinel-1 SAR Flood Inundation Extent',
        type: 'flood_change',
        palette: ['#ef4444', '#f97316'],
        description: 'Synthetic Aperture Radar backscatter change detection through cloud cover.',
      },
      {
        id: 'gee_dynamic_world_landcover',
        name: 'ESA Dynamic World 10m Land Cover',
        type: 'landcover',
        description: 'Near real-time 10m land use / land cover classification.',
      },
    ],
  });
});

app.get('/api/gee/elevation', (req, res) => {
  res.json({
    layer_id: 'gee_elevation_dem',
    resolution: '30m',
    source: 'USGS / NASA SRTMGL1_003',
    coastal_delta_lowlands: [
      { zone: 'Kakinada / East Godavari Coast', mean_elevation_msl: 1.4, surge_vulnerability: 'EXTREME' },
      { zone: 'Kendrapara Delta Lowland Basin', mean_elevation_msl: 0.8, surge_vulnerability: 'CRITICAL' },
      { zone: 'Paradip Estuary Spit', mean_elevation_msl: 1.2, surge_vulnerability: 'CRITICAL' },
      { zone: 'Puri Coastal Sand Ridge', mean_elevation_msl: 3.8, surge_vulnerability: 'MODERATE' },
    ],
  });
});

app.get('/api/gee/flood', (req, res) => {
  res.json({
    layer_id: 'gee_sentinel1_flood',
    inundation_model: 'Hydro-dynamic surge backflow + runoff compound',
    total_flooded_area_sqkm: 284.6,
    population_exposed: 142000,
    critical_facilities_threatened: 18,
    polygons_geojson_ready: true,
  });
});

// Cyclone Forecast Endpoints
app.get('/api/cyclone/current', (req, res) => {
  res.json({
    name: 'Simulated Cyclone Varsha',
    scenario: 'SIMULATED SCENARIO',
    status: 'PRE-LANDFALL',
    category: 'Severe Cyclonic Storm (SCS)',
    sustained_wind_speed: 120,
    gust_speed: 145,
    central_pressure_hpa: 974,
    time_to_landfall_hours: 18,
    expected_surge_m: 2.6,
    expected_24h_rainfall_mm: 210,
    current_location: { lat: 17.15, lng: 83.25 },
    bearing: 'NW at 14 km/h',
    coastal_impact_zone: 'East Godavari / Andhra Coastal Corridor & Bay of Bengal',
    confidence_cone_radius_km: 45,
  });
});

app.get('/api/cyclone/forecast', (req, res) => {
  res.json({
    cyclone: 'Simulated Cyclone Varsha',
    waypoints: [
      { time: 'T-18h (Current)', lat: 17.15, lng: 83.25, type: 'CURRENT', wind: '120 km/h', surge: '2.6m', pressure: '974 hPa' },
      { time: 'T-12h (Forecast)', lat: 17.55, lng: 83.05, type: 'FORECAST', wind: '125 km/h', surge: '2.8m', pressure: '970 hPa' },
      { time: 'T-6h (Forecast)', lat: 17.95, lng: 82.80, type: 'FORECAST', wind: '130 km/h', surge: '3.1m', pressure: '965 hPa' },
      { time: 'T-0h (Landfall)', lat: 18.25, lng: 82.60, type: 'LANDFALL', wind: '120 km/h', surge: '2.9m', pressure: '968 hPa' },
      { time: 'T+6h (Inland Decay)', lat: 18.55, lng: 82.35, type: 'INLAND', wind: '75 km/h', surge: '0.8m', pressure: '985 hPa' },
    ],
  });
});

// Route & Evacuation Analysis Endpoint
app.get('/api/routes', (req, res) => {
  const { origin = 'H-02', destination = 'S-04' } = req.query;
  res.json({
    origin,
    destination,
    recommended_route_id: 'route_b',
    routes: [
      {
        id: 'route_a',
        name: 'Route A (Direct Coastal Highway SH-12 / R-17)',
        distance_km: 3.2,
        estimated_time_min: 14,
        flood_exposure: 'HIGH (1.2m depth projected over 800m stretch)',
        bridge_status: 'Vulnerable (Bridge B-12 scour alert)',
        safety_rating: 'NOT RECOMMENDED',
        color: '#ef4444',
        style: 'dashed',
        waypoints: [
          [20.505, 86.422],
          [20.485, 86.420],
          [20.460, 86.428],
          [20.191, 86.438],
        ],
      },
      {
        id: 'route_b',
        name: 'Route B (Elevated Western Bypass R-21 Corridor)',
        distance_km: 4.8,
        estimated_time_min: 22,
        flood_exposure: 'LOW (Elevated embankment +3.5m MSL)',
        bridge_status: 'Clear / Fully Accessible',
        safety_rating: 'RECOMMENDED',
        color: '#10b981',
        style: 'solid',
        waypoints: [
          [20.505, 86.422],
          [20.525, 86.378],
          [20.420, 86.365],
          [20.210, 86.400],
          [20.191, 86.438],
        ],
      },
    ],
    why_this_route:
      'Route B is recommended because it utilizes an elevated 3.5m embankment bypass, avoiding the 1.2m flood overtopping on Road R-17. Although 1.6 km longer (+8 min transit), patient and evacuee transfer safety is preserved.',
  });
});

// Reports Generation Endpoint
app.post('/api/reports/generate', (req, res) => {
  const { reportType = 'risk', format = 'json' } = req.body;
  res.json({
    success: true,
    reportId: `REP-${Date.now()}`,
    type: reportType,
    generatedAt: new Date().toISOString(),
    format,
    summary: 'Executive Disaster Risk & Infrastructure Vulnerability Summary for Authorized Operational Dispatch.',
    classification: 'OFFICIAL USE ONLY • DISASTER COMMAND',
  });
});

// Gemini AI Advisory Generator endpoint
app.post('/api/advisory/generate', async (req, res) => {
  const {
    cycloneName = 'Simulated Cyclone Varun',
    department,
    district,
    riskEvent,
    asset,
    severity,
    customInstructions,
  } = req.body;

  if (!asset) {
    return res.status(400).json({ error: 'Asset information is required.' });
  }

  const prompt = `
You are the AI Disaster Intelligence Engine for TOOFAN AI, an operational decision-support prototype for coastal cyclone response.
You generate authoritative, professional, and department-specific advisory drafts for authorized disaster managers.

CRITICAL INSTRUCTIONS:
- You are explaining structured predictive model outputs.
- DO NOT invent numerical risk scores or claim certainty.
- Use words like "projected", "estimated", "potential", "contingency", "recommended".
- All recommendations require review and authorization by designated emergency officers.
- Keep the draft crisp, structured, and immediately actionable for the specified department.

STRUCTURED INCIDENT INPUT:
- Cyclone Scenario: ${cycloneName} (Pre-Landfall, Category 3 Equivalent, Sustained winds 145 km/h, Rainfall 240mm, Surge 2.8m)
- Department: ${department || 'Disaster Management & Emergency Relief'}
- Target District: ${district || asset.district || 'Coastal District'}
- Critical Asset: ${asset.name} (${asset.id} - ${asset.type})
- Primary Calculated Risk Score: ${asset.riskScore}/100 [Level: ${asset.riskLevel}]
- Forecasted Hazards: ${Array.isArray(asset.hazards) ? asset.hazards.join(', ') : asset.hazards}
- Infrastructure Dependencies: ${Array.isArray(asset.dependencies) ? asset.dependencies.join(', ') : asset.dependencies}
- Time to Projected Impact: ${asset.timeToImpact || '5-8 hours'}
- Primary Consequence: ${asset.potentialImpact || 'Potential operational disruption'}
- Recommended Action Basis: ${Array.isArray(asset.recommendedActions) ? asset.recommendedActions.join('; ') : asset.recommendedActions}
${customInstructions ? `- Officer Focus Directive: ${customInstructions}` : ''}

REQUIRED OUTPUT FORMAT (Produce valid JSON with these exact keys):
{
  "situationSummary": "A concise 2-sentence summary of the hazard threat to this specific asset.",
  "whyAssetMatters": "Why this specific facility/route is critical for regional survival and response.",
  "potentialImpact": "Detailed cascade impacts if this asset or its dependencies fail.",
  "recommendedPreparatoryActions": [
    "Concrete, immediate operational directive 1",
    "Concrete operational directive 2",
    "Concrete operational directive 3",
    "Concrete operational directive 4"
  ],
  "urgency": "CRITICAL IMMEDIATE (T-3h)" | "HIGH MOBILIZE (T-6h)" | "ELEVATED PREPARE (T-12h)",
  "evidenceInputs": "Summary of forecast variables (wind, rainfall, surge, dependency chain) informing this advisory."
}
Only output pure JSON.
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          advisory: parsed,
        });
      } catch {
        // Fallback if formatting was slightly off
        return res.json({
          success: true,
          source: 'gemini-raw',
          rawText: text,
          advisory: {
            situationSummary: `Simulated Cyclone Varun models indicate high vulnerability for ${asset.name} (${asset.id}) under projected rainfall and storm surge conditions.`,
            whyAssetMatters: `${asset.name} acts as a vital anchor for regional disaster response and emergency care.`,
            potentialImpact: asset.potentialImpact || 'Compounded access delays and service interruptions.',
            recommendedPreparatoryActions: Array.isArray(asset.recommendedActions)
              ? asset.recommendedActions
              : ['Verify backup generator readiness', 'Deploy quick-response teams', 'Establish radio comms'],
            urgency: asset.riskLevel === 'CRITICAL' ? 'CRITICAL IMMEDIATE (T-3h)' : 'HIGH MOBILIZE (T-6h)',
            evidenceInputs: `Model inputs: ${asset.riskScore}/100 Risk Score, ${asset.timeToImpact} to impact, ${asset.hazards?.join(', ') || 'Multi-hazard exposure'}.`,
          },
        });
      }
    } else {
      // High-quality structured fallback if GEMINI_API_KEY is not configured
      const fallbackAdvisory = {
        situationSummary: `Based on simulated multi-hazard projections for Cyclone Varun, ${asset.name} (${asset.id}) exhibits elevated exposure to ${Array.isArray(asset.hazards) ? asset.hazards.join(' and ') : asset.hazards}.`,
        whyAssetMatters: `${asset.name} is a designated tier-1 lifeline facility supporting over 45,000 citizens across the coastal subdivision.`,
        potentialImpact: asset.potentialImpact || `Disruption along connected arterials (${Array.isArray(asset.dependencies) ? asset.dependencies.join(', ') : 'feeder links'}) may isolate response assets.`,
        recommendedPreparatoryActions: [
          `Inspect and clear drainage channels surrounding ${asset.name} perimeter immediately.`,
          `Activate auxiliary fuel reserves and conduct a 15-minute load test on backup generators.`,
          `Establish direct VHF tactical radio check with district emergency operations centre (DEOC).`,
          `Pre-position high-clearance rescue vehicles along verified alternate corridors.`,
        ],
        urgency: asset.riskLevel === 'CRITICAL' ? 'CRITICAL IMMEDIATE (T-3h)' : 'HIGH MOBILIZE (T-6h)',
        evidenceInputs: `Simulated model parameters: Surge 2.8m, Sustained winds 145 km/h, Calculated risk score ${asset.riskScore}/100, Est. landfall impact in ${asset.timeToImpact}.`,
      };

      return res.json({
        success: true,
        source: 'structured-fallback',
        advisory: fallbackAdvisory,
        note: 'Generated using pre-calibrated risk models (API key optional in demo).',
      });
    }
  } catch (error: any) {
    console.error('Error generating advisory:', error);
    // Return structured resilience response
    return res.json({
      success: true,
      source: 'resilience-engine',
      advisory: {
        situationSummary: `Operational intelligence report for ${asset.name} indicates acute vulnerability to approaching weather front.`,
        whyAssetMatters: `Strategic asset serving critical infrastructure dependencies across the vulnerable coastal belt.`,
        potentialImpact: asset.potentialImpact || 'Cascading supply and power disruption across linked facilities.',
        recommendedPreparatoryActions: [
          'Pre-deploy emergency maintenance crew and submersible pumps.',
          'Verify bypass power feed and fuel supplies.',
          'Issue route advisory to regional emergency dispatch.',
        ],
        urgency: 'HIGH MOBILIZE (T-6h)',
        evidenceInputs: `Calculated Asset Score: ${asset.riskScore}/100. Time window: ${asset.timeToImpact}.`,
      },
      warning: 'Fallback engine utilized due to upstream rate limit or network status.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TOOFAN AI] Command Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
