import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Search, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Wind, 
  CloudRain, 
  Waves, 
  Check, 
  Building2, 
  Navigation, 
  Globe, 
  Radio, 
  ArrowRight, 
  Crosshair, 
  Share2, 
  Info, 
  Truck, 
  HeartPulse,
  ChevronDown,
  ChevronUp,
  Eye,
  Map as MapIcon,
  X
} from 'lucide-react';
import { InfrastructureAsset, RiskLevel, AssetType, DepartmentType } from '../types';
import { LocationConfig, SCENARIO_CONFIGS } from '../data/locationDatasets';

interface DisasterMapProps {
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onOpenDamageChain?: (assetId: string) => void;
  onDraftAdvisory?: (asset: InfrastructureAsset) => void;
  activeScenarioName?: string;
  showEvacuationRoute?: boolean;
  selectedRouteId?: 'route_a' | 'route_b';
  selectedLocation?: string;
  selectedDepartment?: DepartmentType;
  currentScenarioKey?: string;
  locationConfig?: LocationConfig;
  whatIfDisruptions?: {
    roadR17Blocked?: boolean;
    substationP03Down?: boolean;
    shelterS04Cutoff?: boolean;
    surgeHeight?: number;
    rainfallMm?: number;
  };
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onOpenDamageChain,
  onDraftAdvisory,
  activeScenarioName = 'Simulated Cyclone Varun',
  showEvacuationRoute = true,
  selectedRouteId = 'route_b',
  selectedLocation = 'East Godavari, Andhra Pradesh',
  selectedDepartment = 'ALL',
  currentScenarioKey = 'standard',
  locationConfig,
  whatIfDisruptions = {},
}) => {
  // Map configuration state
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('satellite');
  const [zoomLevel, setZoomLevel] = useState<number>(locationConfig?.zoom || 11);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(false);
  const [legendCollapsed, setLegendCollapsed] = useState<boolean>(false);
  const [forecastCardCollapsed, setForecastCardCollapsed] = useState<boolean>(false);
  const [riskOverviewCollapsed, setRiskOverviewCollapsed] = useState<boolean>(false);
  const [selectedRoadDetail, setSelectedRoadDetail] = useState<any | null>(null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    locationConfig?.center || { lat: 16.989, lng: 82.247 }
  );

  // Layer toggles - all working and connected
  const [layers, setLayers] = useState({
    // Base & Imagery
    satellite: true,
    roadmap: false,
    terrain: false,
    // Cyclone & Track
    cycloneTrack: true,
    forecastCone: true,
    windExposure: true,
    // Hazard Zones
    criticalRiskZones: true,  // Red
    highRiskZones: true,      // Orange
    moderateRiskZones: true,  // Yellow
    stormSurge: true,         // Blue
    floodRisk: true,
    // Infrastructure
    hospitals: true,
    shelters: true,
    powerSubstations: true,
    criticalFacilities: true,
    roads: true,
    evacuationRoutes: true,
    roadCallouts: true,
    townLabels: true,
    // Panels & Insets
    forecastCard: true,
    riskOverview: true,
    miniMap: true,
    weatherOverlay: true,
  });

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Pre-configured search locations for instant teleportation
  const searchLocations: Record<string, { lat: number; lng: number; label: string }> = {
    'puri': { lat: 19.813, lng: 85.831, label: 'Puri Coastal Belt' },
    'bhubaneswar': { lat: 20.296, lng: 85.824, label: 'Bhubaneswar Capital' },
    'konark': { lat: 19.887, lng: 86.094, label: 'Konark Marine Drive' },
    'brahmapur': { lat: 19.314, lng: 84.794, label: 'Brahmapur / Ganjam' },
    'kakinada': { lat: 16.989, lng: 82.247, label: 'Kakinada / East Godavari' },
    'east godavari': { lat: 16.989, lng: 82.247, label: 'East Godavari Delta' },
    'uppada': { lat: 17.065, lng: 82.315, label: 'Uppada Coastal Revetment' },
    'kendrapara': { lat: 20.505, lng: 86.422, label: 'Kendrapara Delta' },
    'paradip': { lat: 20.316, lng: 86.611, label: 'Paradip Port' },
    'visakhapatnam': { lat: 17.686, lng: 83.218, label: 'Visakhapatnam Harbor' },
    'ersama': { lat: 20.210, lng: 86.460, label: 'Ersama Coastal Refuge' },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    for (const [key, loc] of Object.entries(searchLocations)) {
      if (key.includes(q) || loc.label.toLowerCase().includes(q)) {
        setMapCenter({ lat: loc.lat, lng: loc.lng });
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([loc.lat, loc.lng], 12);
        }
        return;
      }
    }

    const foundAsset = assets.find(
      a => a.id.toLowerCase() === q || 
           a.name.toLowerCase().includes(q) || 
           a.district.toLowerCase().includes(q)
    );
    if (foundAsset) {
      setMapCenter({ lat: foundAsset.latitude, lng: foundAsset.longitude });
      onSelectAsset(foundAsset);
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([foundAsset.latitude, foundAsset.longitude], 13);
      }
    }
  };

  const handleToggleSatellite = () => {
    const nextType = mapType === 'satellite' ? 'roadmap' : 'satellite';
    setMapType(nextType);
    setLayers(prev => ({
      ...prev,
      satellite: nextType === 'satellite',
      roadmap: nextType === 'roadmap',
      terrain: false,
    }));
  };

  const handleResetView = () => {
    const center = locationConfig?.center || { lat: 16.989, lng: 82.247 };
    setMapCenter(center);
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([center.lat, center.lng], locationConfig?.zoom || 11);
    }
  };

  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filter assets based on layer toggles
  const visibleAssets = useMemo(() => {
    return assets.filter(asset => {
      if (asset.type === 'Hospital' && !layers.hospitals) return false;
      if (asset.type === 'Arterial Road' && !layers.roads) return false;
      if (asset.type === 'Coastal Bridge' && !layers.roads) return false;
      if (asset.type === 'Emergency Shelter' && !layers.shelters) return false;
      if (asset.type === 'Power Substation' && !layers.powerSubstations) return false;
      if (['Water Treatment', 'Telecom Tower', 'Port Facility'].includes(asset.type) && !layers.criticalFacilities) return false;
      return true;
    });
  }, [assets, layers]);

  // Asset custom icon renderer (matching unnamed.jpg markers!)
  const getAssetMarkerIcon = (asset: InfrastructureAsset) => {
    let iconSvg = '';
    let bgColor = '#0ea5e9';

    switch (asset.type) {
      case 'Hospital':
        bgColor = '#ef4444'; // Red medical cross
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>`;
        break;
      case 'Power Substation':
        bgColor = '#8b5cf6'; // Purple lightning bolt
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
        break;
      case 'Emergency Shelter':
        bgColor = '#10b981'; // Green shelter/home
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><path d="M3 9.5l9-7 9 7v10.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V9.5z"></path></svg>`;
        break;
      case 'Arterial Road':
      case 'Coastal Bridge':
        bgColor = '#3b82f6'; // Blue road/traffic
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="19" x2="20" y2="19"></line><line x1="4" y1="5" x2="20" y2="5"></line><line x1="4" y1="12" x2="20" y2="12" stroke-dasharray="2,2"></line></svg>`;
        break;
      default:
        bgColor = '#0284c7'; // Cyan facility
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    }

    const isSelected = selectedAsset?.id === asset.id;
    const isCritical = asset.riskLevel === 'CRITICAL';
    const matchesDepartment = selectedDepartment === 'ALL' || asset.department === selectedDepartment;
    const opacity = matchesDepartment ? 1.0 : 0.45;
    const isDeptHighlighted = selectedDepartment !== 'ALL' && asset.department === selectedDepartment;

    const size = isSelected || isDeptHighlighted ? 34 : 26;

    return {
      html: `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          background-color: ${bgColor};
          opacity: ${opacity};
          border: ${isDeptHighlighted ? '3px solid #2563eb' : '2px solid #ffffff'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4), 0 0 ${isSelected || isDeptHighlighted ? '20px' : '8px'} ${bgColor};
          cursor: pointer;
          transition: transform 0.2s ease;
          ${isCritical ? 'animation: pulseHalo 2s infinite;' : ''}
        ">
          ${iconSvg}
          ${isSelected || isDeptHighlighted ? `
            <div style="
              position: absolute;
              bottom: -22px;
              left: 50%;
              transform: translateX(-50%);
              background: #0f172a;
              color: #ffffff;
              font-family: monospace;
              font-size: 10px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 6px;
              border: 1px solid #38bdf8;
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              white-space: nowrap;
            ">
              ${asset.id}
            </div>
          ` : ''}
        </div>
      `,
      size: [size, size] as [number, number],
    };
  };

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!leafletContainerRef.current) return;
      const L = await import('leaflet');

      if (!isMounted) return;

      const initialCenter = locationConfig?.center || mapCenter;
      const initialZoom = locationConfig?.zoom || zoomLevel;

      if (!leafletMapRef.current) {
        const map = L.map(leafletContainerRef.current, {
          center: [initialCenter.lat, initialCenter.lng],
          zoom: initialZoom,
          zoomControl: false,
          attributionControl: false,
        });

        leafletMapRef.current = map;
        layersGroupRef.current = L.layerGroup().addTo(map);

        map.on('zoomend', () => {
          setZoomLevel(map.getZoom());
        });
      }

      // Tile layer
      const map = leafletMapRef.current;
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      if (mapType === 'satellite') {
        // High-resolution satellite basemap with terrain clarity
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
        }).addTo(map);

        // Crisp road and boundary overlay (ArcGIS Reference Boundaries & Places)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          opacity: 0.9,
        }).addTo(map);
      } else if (mapType === 'terrain') {
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
        }).addTo(map);
      } else {
        // High-resolution roadmap (ArcGIS World Street Map)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
        }).addTo(map);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [mapType]);

  // Center smoothly on location changes
  useEffect(() => {
    if (leafletMapRef.current && locationConfig) {
      leafletMapRef.current.setView(
        [locationConfig.center.lat, locationConfig.center.lng], 
        locationConfig.zoom || 11, 
        { animate: true }
      );
      setMapCenter(locationConfig.center);
    }
  }, [selectedLocation, locationConfig]);

  // Center on asset when selected externally
  useEffect(() => {
    if (selectedAsset && leafletMapRef.current) {
      leafletMapRef.current.panTo([selectedAsset.latitude, selectedAsset.longitude], { animate: true });
    }
  }, [selectedAsset]);

  // Cyclone meteorological icon generator (SVG spiral)
  const cycloneSpiralSvg = (color: string = '#ffffff', size: number = 22) => `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="${color}">
      <path d="M50,15 C30.7,15 15,30.7 15,50 C15,54.8 16,59.3 17.8,63.4 C16.5,58.8 20,53.5 25.3,53.5 C30.7,53.5 35,57.8 35,63.2 C35,66.8 33,70 30,71.7 C35.4,78.2 42.2,82.4 50,85 C69.3,85 85,69.3 85,50 C85,45.2 84,40.7 82.2,36.6 C83.5,41.2 80,46.5 74.7,46.5 C69.3,46.5 65,42.2 65,36.8 C65,33.2 67,30 70,28.3 C64.6,21.8 57.8,17.6 50,15 Z M50,38 C56.6,38 62,43.4 62,50 C62,56.6 56.6,62 50,62 C43.4,62 38,56.6 38,50 C38,43.4 43.4,38 50,38 Z"/>
    </svg>
  `;

  // Update dynamic overlays, markers, cyclone track, and route lines
  useEffect(() => {
    if (!leafletMapRef.current || !layersGroupRef.current) return;

    import('leaflet').then((L) => {
      const group = layersGroupRef.current;
      group.clearLayers();

      const scenario = SCENARIO_CONFIGS[currentScenarioKey] || SCENARIO_CONFIGS['standard'];
      const trackConfig = locationConfig?.cycloneTrack;
      const hazardPolys = locationConfig?.hazardPolygons;
      const surgeCoords = locationConfig?.surgePolygon;
      const floodCoords = locationConfig?.floodPolygon;
      const roadsList = locationConfig?.roads;
      const townsList = locationConfig?.towns;

      // 1. FORECAST UNCERTAINTY CONE (Translucent Glowing Blue Cone matching unnamed.jpg!)
      if (layers.forecastCone && trackConfig?.cone) {
        L.polygon(trackConfig.cone, {
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.28,
          weight: 2,
          dashArray: '6, 6',
        }).addTo(group).bindTooltip('Ensemble Forecast Uncertainty Cone (IMD 70% Confidence)', { sticky: true });
      }

      // 2. MULTI-TIERED HAZARD ZONES (RED, ORANGE, YELLOW, BLUE matching unnamed.jpg!)
      // Moderate Risk Zone (Yellow)
      if (layers.moderateRiskZones && (hazardPolys?.moderateRisk || floodCoords)) {
        const yellowCoords = hazardPolys?.moderateRisk || floodCoords;
        L.polygon(yellowCoords as [number, number][], {
          color: '#ca8a04',
          fillColor: '#eab308',
          fillOpacity: 0.22 * scenario.rainMultiplier,
          weight: 1.5,
          dashArray: '5, 5',
        }).addTo(group).bindTooltip('MODERATE RISK ZONE: Convective Rain Bands (>120mm)', { sticky: true });
      }

      // High Risk Zone (Orange)
      if (layers.highRiskZones && (hazardPolys?.highRisk || floodCoords)) {
        const orangeCoords = hazardPolys?.highRisk || floodCoords;
        L.polygon(orangeCoords as [number, number][], {
          color: '#ea580c',
          fillColor: '#f97316',
          fillOpacity: 0.30 * scenario.rainMultiplier,
          weight: 2,
        }).addTo(group).bindTooltip('HIGH RISK ZONE: Inland Flooding & Severe Gale Winds (>100 km/h)', { sticky: true });
      }

      // Critical Risk Zone (Red - landfall corridor & catastrophic surge strip)
      if (layers.criticalRiskZones && (hazardPolys?.criticalRisk || surgeCoords)) {
        const redCoords = hazardPolys?.criticalRisk || surgeCoords;
        L.polygon(redCoords as [number, number][], {
          color: '#dc2626',
          fillColor: '#ef4444',
          fillOpacity: 0.38 * scenario.surgeMultiplier,
          weight: 2.5,
        }).addTo(group).bindTooltip('CRITICAL RISK ZONE: Core Landfall Corridor & Heavy Wave Inundation', { sticky: true });
      }

      // Storm Surge / Coastal Estuary Zone (Blue)
      if (layers.stormSurge && (hazardPolys?.inundation || surgeCoords)) {
        const blueCoords = hazardPolys?.inundation || surgeCoords;
        L.polygon(blueCoords as [number, number][], {
          color: '#0284c7',
          fillColor: '#06b6d4',
          fillOpacity: 0.32 * scenario.surgeMultiplier,
          weight: 2,
        }).addTo(group).bindTooltip(`COASTAL STORM SURGE ENVELOPE (+${((locationConfig?.baseSurgeM || 3.0) * scenario.surgeMultiplier).toFixed(1)}m)`, { sticky: true });
      }

      // 3. CYCLONE TRACK & WAYPOINT NODES WITH HURRICANE ICONS (Matching unnamed.jpg!)
      if (layers.cycloneTrack && trackConfig) {
        // Historical Past Track (Grey dashed line)
        L.polyline(trackConfig.past, {
          color: '#94a3b8',
          weight: 3.5,
          dashArray: '4, 4',
        }).addTo(group).bindTooltip('Historical Cyclone Track (Past 24 Hours)');

        // Forecast Track Line with outer cyan glow + red dashed center (Matching unnamed.jpg!)
        L.polyline(trackConfig.forecast, {
          color: '#38bdf8',
          weight: 6,
          opacity: 0.6,
        }).addTo(group);

        L.polyline(trackConfig.forecast, {
          color: '#ef4444',
          weight: 3.5,
          dashArray: '6, 5',
        }).addTo(group).bindTooltip(`Projected Landfall Trajectory (${locationConfig?.cycloneName || 'Cyclone Varun'})`);

        // Waypoint Nodes with Hurricane Spiral Icons along forecast trajectory (Matching unnamed.jpg!)
        trackConfig.forecast.forEach((coord, idx) => {
          const isLandfall = idx === trackConfig.forecast.length - 2 || idx === Math.min(2, trackConfig.forecast.length - 1);
          const hoursLabel = idx === 0 ? 'T-0' : idx === 1 ? 'T+6h' : idx === 2 ? 'T+12h' : 'Landfall ~18h';

          const waypointIcon = L.divIcon({
            className: 'cyclone-waypoint-marker',
            html: `
              <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #dc2626; border: 2px solid #ffffff; box-shadow: 0 0 16px rgba(220, 38, 38, 0.9); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                ${cycloneSpiralSvg('#ffffff', 16)}
                <div style="position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); color: #ffffff; font-family: monospace; font-size: 9px; font-weight: bold; padding: 1px 4px; border-radius: 4px; border: 1px solid #38bdf8; white-space: nowrap;">
                  ${hoursLabel}
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const nodeMarker = L.marker(coord, { icon: waypointIcon }).addTo(group);
          nodeMarker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 190px;">
              <div style="font-weight: 900; color: #dc2626; font-size: 13px;">CYCLONE WAYPOINT [${hoursLabel}]</div>
              <div style="color: #64748b; font-size: 11px;">${locationConfig?.category || 'Very Severe Cyclonic Storm (VSCS)'}</div>
              <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
              <div><strong>Projected Wind:</strong> ${Math.round((locationConfig?.baseWindKm || 135) * scenario.windMultiplier)} km/h</div>
              <div><strong>Coordinates:</strong> ${coord[0].toFixed(2)}°N, ${coord[1].toFixed(2)}°E</div>
              <div><strong>Landfall Probability:</strong> 94%</div>
            </div>
          `);
        });

        // Cyclone Eye Active Marker (Large spinning hurricane icon with ripple halo!)
        const eyeIcon = L.divIcon({
          className: 'cyclone-eye-active',
          html: `
            <div style="position: relative; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, #dc2626 0%, #b91c1c 80%); border: 3px solid #ffffff; box-shadow: 0 0 30px rgba(239, 68, 68, 1); display: flex; align-items: center; justify-content: center; cursor: pointer; animation: pulseHalo 2s infinite;">
              <div style="animation: spin 6s linear infinite; display: flex; align-items: center; justify-content: center;">
                ${cycloneSpiralSvg('#ffffff', 26)}
              </div>
              <div style="position: absolute; -top: 10px; width: 10px; height: 10px; border-radius: 50%; background: #38bdf8;"></div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const eyeMarker = L.marker(trackConfig.current, { icon: eyeIcon }).addTo(group);
        eyeMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 210px;">
            <div style="font-weight: 900; color: #dc2626; font-size: 14px; display: flex; align-items: center; gap: 6px;">
              <span>CYCLONE EYE: ${locationConfig?.cycloneName || 'Cyclone Varun'}</span>
            </div>
            <div style="color: #64748b; font-size: 11px;">${locationConfig?.category || 'Very Severe Cyclonic Storm (VSCS)'}</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div style="margin-bottom: 2px;"><strong>Current Location:</strong> ${trackConfig.current[0].toFixed(2)}°N, ${trackConfig.current[1].toFixed(2)}°E</div>
            <div style="margin-bottom: 2px;"><strong>Max Sustained Wind:</strong> ${Math.round((locationConfig?.baseWindKm || 135) * scenario.windMultiplier)} km/h (Gusts ${Math.round((locationConfig?.baseWindKm || 135) * scenario.windMultiplier) + 25} km/h)</div>
            <div style="margin-bottom: 2px;"><strong>Central Pressure:</strong> 965 hPa</div>
            <div style="margin-bottom: 2px;"><strong>Estimated Landfall:</strong> ${locationConfig?.baseLandfallWindow || 'Tomorrow, 04:30 AM'} (~${locationConfig?.baseTimeToLandfallHours || 16} hrs)</div>
            <div style="margin-top: 6px; padding: 4px 6px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #b91c1c; font-size: 10px; font-mono: true;">
              DEMO / SIMULATED METEOROLOGICAL TELEMETRY
            </div>
          </div>
        `);

        // Wind Radii Rings
        if (layers.windExposure) {
          const galeRadius = (trackConfig.galeRadiusKm || 55) * scenario.windMultiplier * 1000;
          const outerRadius = (trackConfig.outerWindRadiusKm || 115) * scenario.windMultiplier * 1000;

          L.circle(trackConfig.current, {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.12,
            weight: 2,
            radius: galeRadius,
            dashArray: '6, 6',
          }).addTo(group).bindTooltip(`Core Gale Wind Zone (>120 km/h) • Radius: ${Math.round(galeRadius / 1000)}km`);

          L.circle(trackConfig.current, {
            color: '#f97316',
            fillColor: '#f97316',
            fillOpacity: 0.06,
            weight: 1.5,
            radius: outerRadius,
            dashArray: '4, 4',
          }).addTo(group).bindTooltip(`Severe Gale Wind Zone (>80 km/h) • Radius: ${Math.round(outerRadius / 1000)}km`);
        }
      }

      // 4. TOWN / CITY LABELS (Matching unnamed.jpg!)
      if (layers.townLabels && townsList && townsList.length > 0) {
        townsList.forEach(town => {
          const townIcon = L.divIcon({
            className: 'pravah-town-label',
            html: `
              <div style="display: inline-flex; align-items: center; gap: 5px; background: rgba(15, 23, 42, 0.85); color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.3px; border: 1px solid rgba(148, 163, 184, 0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.35); text-shadow: 0 1px 2px rgba(0,0,0,0.8); pointer-events: none; white-space: nowrap;">
                <span style="width: 5px; height: 5px; border-radius: 50%; background: #38bdf8;"></span>
                <span>${town.name}</span>
              </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          });
          L.marker([town.lat, town.lng], { icon: townIcon, zIndexOffset: 200 }).addTo(group);
        });
      }

      // 5. ROADS, HIGH-RISK CLOSURES & SAFE EVACUATION BYPASS (Matching unnamed.jpg!)
      if (layers.roads && roadsList && roadsList.length > 0) {
        roadsList.forEach((road) => {
          const isCritical = road.riskLevel === 'CRITICAL' || road.riskLevel === 'HIGH';
          const roadColor = isCritical ? '#ef4444' : '#10b981';

          // Outer white glow line to stand out clearly on dark satellite imagery
          L.polyline(road.path, {
            color: '#ffffff',
            weight: isCritical ? 9 : 8,
            opacity: 0.65,
          }).addTo(group);

          // Inner colored line
          const roadLine = L.polyline(road.path, {
            color: roadColor,
            weight: isCritical ? 6 : 5,
            dashArray: isCritical ? '8, 6' : undefined,
            opacity: 0.95,
          }).addTo(group);

          // Road mobility popup
          roadLine.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 220px;">
              <div style="font-weight: 900; color: ${roadColor}; font-size: 13px;">
                ${isCritical ? '⚠️ HIGH-RISK ROAD: ' : '🟢 SAFE BYPASS: '}${road.name}
              </div>
              <div style="color: #64748b; font-size: 11px;">Status: <strong>${road.status} [${road.riskLevel} RISK]</strong></div>
              <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
              <div><strong>Flood Overtopping Depth:</strong> ${road.floodDepth}</div>
              <div><strong>Expected Disruption:</strong> ${road.expectedDisruption || '4–8 hrs'}</div>
              <div><strong>Daily Traffic Share:</strong> ${road.populationDependencePercent || 53}% (${(road.dailyUsers || 38000).toLocaleString()} users/day)</div>
              <div><strong>Population Dependent:</strong> ${Math.round((road.dailyUsers || 35000) * 0.45).toLocaleString()} residents</div>
              <div><strong>Nearest Safe Alternative:</strong> <span style="color: #10b981; font-weight: bold;">${road.alternateRouteName || 'Inland Bypass R-21'}</span></div>
              <div style="margin-top: 6px; padding: 4px 6px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: #1e40af; font-size: 10px;">
                DEMO / SIMULATED MOBILITY & HYDRODYNAMIC DATA
              </div>
            </div>
          `);

          // Pinned Callout Card directly on the primary critical road (Matching unnamed.jpg!)
          if (layers.roadCallouts && isCritical && road.path.length > 1) {
            const midCoord = road.path[Math.floor(road.path.length / 2)];
            const calloutIcon = L.divIcon({
              className: 'road-callout-marker',
              html: `
                <div style="position: relative; left: -50%; top: -68px; background: rgba(255, 255, 255, 0.98); border: 2px solid #ef4444; border-radius: 12px; padding: 6px 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); min-width: 175px; font-family: sans-serif; pointer-events: auto; cursor: pointer;">
                  <div style="display: flex; align-items: center; gap: 6px; font-weight: 900; color: #0f172a; font-size: 12px;">
                    <span style="display: inline-block; width: 14px; height: 14px; border-radius: 4px; background: #ef4444; color: #fff; text-align: center; line-height: 14px; font-size: 9px; font-weight: bold;">!</span>
                    <span>${road.name.split('(')[0]}</span>
                  </div>
                  <div style="color: #dc2626; font-weight: 800; font-size: 11px; margin-top: 2px;">High flood risk</div>
                  <div style="color: #475569; font-size: 10px; margin-top: 1px;">Estimated closure: 6–12 hrs</div>
                  <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #ef4444;"></div>
                </div>
              `,
              iconSize: [0, 0],
            });

            const calloutMarker = L.marker(midCoord, { icon: calloutIcon, zIndexOffset: 500 }).addTo(group);
            calloutMarker.on('click', () => {
              setSelectedRoadDetail(road);
            });
          }
        });
      }

      // 6. ASSET MARKERS WITH METICULOUS ICONS (Hospitals, Shelters, Power Substations)
      visibleAssets.forEach(asset => {
        const markerConfig = getAssetMarkerIcon(asset);
        const customDivIcon = L.divIcon({
          className: 'pravah-gis-marker',
          html: markerConfig.html,
          iconSize: markerConfig.size,
          iconAnchor: [markerConfig.size[0] / 2, markerConfig.size[1] / 2],
        });

        const marker = L.marker([asset.latitude, asset.longitude], {
          zIndexOffset: selectedAsset?.id === asset.id ? 1000 : 100,
          icon: customDivIcon,
        });

        marker.on('click', () => {
          onSelectAsset(asset);
        });

        // Rich interactive popup
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 210px;">
            <div style="font-weight: 900; color: #0f172a; font-size: 13px;">${asset.name}</div>
            <div style="color: #64748b; font-size: 11px;">${asset.type} • ${asset.district} District</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div><strong>Calculated Risk:</strong> <span style="color: ${asset.riskLevel === 'CRITICAL' ? '#dc2626' : '#d97706'}; font-weight: bold;">${asset.riskScore}/100 [${asset.riskLevel}]</span></div>
            <div><strong>Time to Impact:</strong> ${asset.timeToImpact}</div>
            <div><strong>Status:</strong> ${asset.status}</div>
            <div><strong>Vulnerability:</strong> ${asset.vulnerability.slice(0, 90)}...</div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; color: #64748b;">Click marker to inspect full profile</span>
            </div>
          </div>
        `);

        marker.addTo(group);
      });
    });
  }, [
    visibleAssets, 
    layers, 
    selectedAsset, 
    showEvacuationRoute, 
    selectedRouteId, 
    mapType,
    selectedLocation,
    currentScenarioKey,
    selectedDepartment,
    locationConfig
  ]);

  // Derived statistics for Risk Overview panel
  const scenario = SCENARIO_CONFIGS[currentScenarioKey] || SCENARIO_CONFIGS['standard'];
  const highRiskCount = Math.round(12 * scenario.windMultiplier);
  const mediumRiskCount = Math.round(28 * scenario.rainMultiplier);
  const lowRiskCount = Math.round(47 * scenario.surgeMultiplier);
  const hospitalsAtRisk = assets.filter(a => a.type === 'Hospital' && (a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH')).length || 6;
  const sheltersAtRisk = assets.filter(a => a.type === 'Emergency Shelter').length || 14;
  const powerAtRisk = assets.filter(a => a.type === 'Power Substation').length || 8;
  const roadsAtRiskKm = (locationConfig?.roadScourEstimateKm || 37.5 * scenario.rainMultiplier).toFixed(1);

  const cycloneLat = locationConfig?.cycloneTrack?.current[0] || 18.9;
  const cycloneLng = locationConfig?.cycloneTrack?.current[1] || 85.8;
  const windSpeedKm = Math.round((locationConfig?.baseWindKm || 130) * scenario.windMultiplier);

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative w-full h-full flex flex-col bg-slate-100 rounded-3xl border border-slate-200/90 overflow-hidden shadow-md ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[620px]'
      }`}
    >
      {/* Top Map Navigator Toolbar */}
      <div className="z-20 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Location Search & Teleport */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5 flex-1 max-w-sm sm:max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search location or asset (e.g. Puri, Kakinada, H-07, Uppada)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shrink-0 transition-colors shadow-2xs"
          >
            Locate
          </button>
        </form>

        {/* Center: Selected Location & Demo Notice */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {locationConfig?.name || selectedLocation}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
            DEMO / SIMULATED GEOSPATIAL INTELLIGENCE
          </span>
        </div>

        {/* Right: Map Controls (Basemap, Reset, Layers, Fullscreen) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Basemap Toggle */}
          <button
            onClick={handleToggleSatellite}
            className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Toggle Satellite Imagery & Street Map"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{mapType === 'satellite' ? 'Satellite' : 'Roadmap'}</span>
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Reset View to Coastal Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Layers Drawer Toggle */}
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
              showLayerDrawer
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Map Viewport with Leaflet Render Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[540px]">
        <div ref={leafletContainerRef} className="w-full h-full z-10" />

        {/* Tactical Department Filter Active Banner */}
        {selectedDepartment !== 'ALL' && (
          <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <Activity className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
            <span>Sector Focus Active: {selectedDepartment}</span>
            <span className="text-[10px] bg-blue-700 text-blue-100 px-1.5 py-0.5 rounded font-mono font-normal">
              Targeted Infrastructure Highlighted
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FLOATING CYCLONE FORECAST CARD (Matching unnamed.jpg!)                    */}
        {/* ========================================================================= */}
        {layers.forecastCard && (
          <div className="absolute top-3 left-3 sm:left-auto sm:right-3 md:right-72 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200/90 text-xs w-64 sm:w-72 transition-all">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center animate-spin">
                  <div dangerouslySetInnerHTML={{ __html: cycloneSpiralSvg('#ffffff', 14) }} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm">Cyclone Forecast</h4>
                  <div className="text-[10px] text-slate-500 font-mono">{locationConfig?.cycloneName || 'Cyclone Varun'}</div>
                </div>
              </div>
              <button
                onClick={() => setForecastCardCollapsed(!forecastCardCollapsed)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                {forecastCardCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!forecastCardCollapsed && (
              <div className="space-y-1.5 text-[11px] text-slate-600 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Location:</span>
                  <strong className="font-mono text-slate-900">{cycloneLat.toFixed(1)}°N, {cycloneLng.toFixed(1)}°E</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wind Speed:</span>
                  <strong className="font-mono text-amber-700">{windSpeedKm} km/h</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <strong className="text-rose-700 font-bold">{locationConfig?.category ? locationConfig.category.split('(')[0].trim() : 'Severe (Category 2)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Central Pressure:</span>
                  <strong className="font-mono text-slate-800">965 hPa</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Landfall:</span>
                  <strong className="font-mono text-blue-700">{locationConfig?.baseLandfallWindow || 'Tomorrow, 04:30 AM'}</strong>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Time-to-Impact:</span>
                  <span className="font-mono">~{locationConfig?.baseTimeToLandfallHours || 16} hours</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* FLOATING RISK OVERVIEW PANEL (Matching unnamed.jpg!)                      */}
        {/* ========================================================================= */}
        {layers.riskOverview && (
          <div className="absolute top-3 right-3 hidden md:block z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200/90 text-xs w-60 sm:w-64 transition-all">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <h4 className="font-black text-slate-900 text-sm font-mono uppercase tracking-wider">Risk Overview</h4>
              </div>
              <button
                onClick={() => setRiskOverviewCollapsed(!riskOverviewCollapsed)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                {riskOverviewCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!riskOverviewCollapsed && (
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> High Risk Zones
                  </span>
                  <strong className="font-mono text-slate-900">{highRiskCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Medium Risk Zones
                  </span>
                  <strong className="font-mono text-slate-900">{mediumRiskCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-yellow-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400"></span> Low Risk Zones
                  </span>
                  <strong className="font-mono text-slate-900">{lowRiskCount}</strong>
                </div>

                <div className="h-px bg-slate-200 my-1.5"></div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">+</span> Hospitals at Risk
                  </span>
                  <strong className="font-mono text-rose-700">{hospitalsAtRisk}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">⌂</span> Shelters Active
                  </span>
                  <strong className="font-mono text-emerald-700">{sheltersAtRisk}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">⚡</span> Power Substations
                  </span>
                  <strong className="font-mono text-purple-700">{powerAtRisk}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> Roads at Risk
                  </span>
                  <strong className="font-mono text-blue-700">{roadsAtRiskKm} km</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MINI-MAP INSET (Matching unnamed.jpg bottom right!)                       */}
        {/* ========================================================================= */}
        {layers.miniMap && (
          <div className="absolute bottom-4 right-4 z-20 hidden lg:block bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 p-2.5 shadow-2xl w-48 h-40 overflow-hidden">
            <div className="text-[9px] font-mono uppercase text-slate-300 font-bold mb-1 flex items-center justify-between">
              <span>REGIONAL INSET RADAR</span>
              <span className="text-cyan-400 animate-pulse">● TRACK</span>
            </div>
            <div className="relative w-full h-28 rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 160 120" className="w-full h-full">
                {/* Coastal Line of East India */}
                <path d="M 25,5 Q 40,30 52,60 T 85,115" fill="none" stroke="#64748b" strokeWidth="2.5" />
                <path d="M 0,0 L 25,5 Q 40,30 52,60 T 85,115 L 0,120 Z" fill="#1e293b" opacity="0.7" />
                {/* Bay of Bengal label */}
                <text x="75" y="45" fill="#475569" fontSize="8" fontFamily="monospace" fontWeight="bold">BAY OF BENGAL</text>
                <text x="10" y="30" fill="#64748b" fontSize="7" fontFamily="monospace">ODISHA</text>
                <text x="15" y="80" fill="#64748b" fontSize="7" fontFamily="monospace">ANDHRA</text>
                {/* Cyclone Eye Position */}
                <circle cx="112" cy="72" r="10" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.2" />
                <circle cx="112" cy="72" r="3.5" fill="#ef4444" />
                {/* Track arrow heading into coast */}
                <line x1="112" y1="72" x2="62" y2="42" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
                {/* Landfall sector box target */}
                <rect x="50" y="34" width="24" height="18" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* WEATHER INTELLIGENCE / CURRENT CONDITIONS STRIP                           */}
        {/* ========================================================================= */}
        {layers.weatherOverlay && (
          <div className="absolute top-3 left-3 hidden lg:flex items-center gap-3 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3.5 py-1.5 text-[11px] font-mono text-white shadow-lg">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 animate-spin" />
              CURRENT CONDITIONS:
            </span>
            <span>Wind: <strong className="text-amber-400">{windSpeedKm} km/h</strong></span>
            <span className="text-slate-500">|</span>
            <span>Rain: <strong className="text-sky-400">{Math.round((locationConfig?.baseRainfallMm || 240) * scenario.rainMultiplier)} mm/24h</strong></span>
            <span className="text-slate-500">|</span>
            <span>Surge: <strong className="text-rose-400">+{( (locationConfig?.baseSurgeM || 3.0) * scenario.surgeMultiplier ).toFixed(1)}m</strong></span>
            <span className="text-slate-500">|</span>
            <span>Pressure: <strong className="text-slate-200">965 hPa</strong></span>
            <span className="text-slate-500">|</span>
            <span>Landfall: <strong className="text-emerald-400">~{locationConfig?.baseTimeToLandfallHours || 16}h</strong></span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FIXED COLLAPSIBLE MAP LEGEND (Section 9)                                  */}
        {/* ========================================================================= */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xl text-[11px] text-slate-700 max-w-[280px]">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
            <div className="font-mono text-[10px] uppercase text-slate-500 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>MAP LEGEND</span>
            </div>
            <button 
              onClick={() => setLegendCollapsed(!legendCollapsed)} 
              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            >
              {legendCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!legendCollapsed && (
            <div className="space-y-2 text-[10px] font-sans">
              <div>
                <div className="font-mono text-slate-400 font-semibold mb-1">CYCLONE DYNAMICS</div>
                <div className="grid grid-cols-2 gap-1 text-slate-800">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span> Active Eye</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-slate-400"></span> Historical Track</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 bg-rose-500"></span> Forecast Track</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-2 bg-sky-500/30 border border-sky-400"></span> Uncertainty Cone</div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100">
                <div className="font-mono text-slate-400 font-semibold mb-1">HAZARD RISK ZONES</div>
                <div className="grid grid-cols-2 gap-1 text-slate-800">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span> Extreme Risk</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> High Risk</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-400"></span> Moderate Risk</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-600"></span> Storm Surge</div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100">
                <div className="font-mono text-slate-400 font-semibold mb-1">INFRASTRUCTURE &amp; MOBILITY</div>
                <div className="grid grid-cols-2 gap-1 text-slate-800">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-600 text-white flex items-center justify-center text-[8px] font-bold">+</span> Hospital</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold">⌂</span> Shelter</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-bold">⚡</span> Power</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 bg-rose-600"></span> High Risk Road</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 bg-emerald-600"></span> Safe Bypass</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ROAD DETAIL MODAL / POPUP                                                 */}
        {/* ========================================================================= */}
        {selectedRoadDetail && (
          <div className="absolute top-16 left-4 z-30 w-80 bg-white/95 backdrop-blur-xl border-2 border-rose-500 rounded-3xl p-4 shadow-2xl text-xs animate-in zoom-in-95 text-slate-800">
            <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold font-mono text-[10px] border border-rose-200">
                  CRITICAL ARTERIAL CORRIDOR
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1">{selectedRoadDetail.name}</h4>
              </div>
              <button
                onClick={() => setSelectedRoadDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Severity:</span>
                <strong className="text-rose-600 font-bold">{selectedRoadDetail.riskLevel} ({selectedRoadDetail.riskScore}/100)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Projected Flood Depth:</span>
                <strong className="text-blue-700">{selectedRoadDetail.floodDepth}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Disruption:</span>
                <strong className="text-slate-900">{selectedRoadDetail.expectedDisruption || '6–12 hrs'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Traffic Share:</span>
                <strong className="text-amber-700">{selectedRoadDetail.populationDependencePercent || 53}% ({(selectedRoadDetail.dailyUsers || 38000).toLocaleString()} users/day)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Population Dependent:</span>
                <strong className="text-slate-900">{Math.round((selectedRoadDetail.dailyUsers || 35000) * 0.45).toLocaleString()} residents</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nearest Safe Route:</span>
                <strong className="text-emerald-700">{selectedRoadDetail.alternateRouteName || 'Inland Bypass R-21'}</strong>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 mb-3">
              <strong>Operational Directive:</strong> Divert evacuation buses immediately. Deploy emergency mobile pumping unit to low-elevation culvert.
            </div>

            <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-[9px] font-mono text-amber-800 text-center">
              DEMO / SIMULATED MOBILITY &amp; HYDRODYNAMIC DATA
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LAYERS DRAWER                                                             */}
        {/* ========================================================================= */}
        {showLayerDrawer && (
          <div className="absolute top-3 right-3 z-30 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-4 text-xs text-slate-800 animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Geospatial Risk Layers</span>
              </div>
              <button
                onClick={() => setShowLayerDrawer(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {/* CYCLONE & HAZARDS */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  CYCLONE &amp; HAZARD DYNAMICS
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Compass className="w-3 h-3 text-rose-500" /> Cyclone Track &amp; Waypoints
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.cycloneTrack}
                      onChange={() => toggleLayer('cycloneTrack')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Navigation className="w-3 h-3 text-sky-500" /> Uncertainty Cone
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.forecastCone}
                      onChange={() => toggleLayer('forecastCone')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Wind className="w-3 h-3 text-amber-500" /> Gale Wind Radii Rings
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.windExposure}
                      onChange={() => toggleLayer('windExposure')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* HAZARD ZONES */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  HAZARD ZONES (MULTI-TIER)
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span> Extreme Risk (Red)
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.criticalRiskZones}
                      onChange={() => toggleLayer('criticalRiskZones')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> High Risk (Orange)
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.highRiskZones}
                      onChange={() => toggleLayer('highRiskZones')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400"></span> Moderate Risk (Yellow)
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.moderateRiskZones}
                      onChange={() => toggleLayer('moderateRiskZones')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Waves className="w-3 h-3 text-cyan-600" /> Storm Surge Envelopes
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.stormSurge}
                      onChange={() => toggleLayer('stormSurge')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* INFRASTRUCTURE */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  CRITICAL ASSETS
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <HeartPulse className="w-3 h-3 text-rose-500" /> Hospitals &amp; ICUs
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.hospitals}
                      onChange={() => toggleLayer('hospitals')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3 h-3 text-emerald-500" /> Cyclone Shelters
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.shelters}
                      onChange={() => toggleLayer('shelters')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Zap className="w-3 h-3 text-purple-500" /> Power Substations
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.powerSubstations}
                      onChange={() => toggleLayer('powerSubstations')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Truck className="w-3 h-3 text-sky-500" /> Arterial Roads &amp; Bridges
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.roads}
                      onChange={() => toggleLayer('roads')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3 h-3 text-rose-500" /> Pinned Road Callouts
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.roadCallouts}
                      onChange={() => toggleLayer('roadCallouts')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3 h-3 text-blue-500" /> City &amp; Town Labels
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.townLabels}
                      onChange={() => toggleLayer('townLabels')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* OVERLAYS */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  DISPLAY PANELS
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Cyclone Forecast Card</span>
                    <input
                      type="checkbox"
                      checked={layers.forecastCard}
                      onChange={() => toggleLayer('forecastCard')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Risk Overview Panel</span>
                    <input
                      type="checkbox"
                      checked={layers.riskOverview}
                      onChange={() => toggleLayer('riskOverview')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Mini-Map Inset</span>
                    <input
                      type="checkbox"
                      checked={layers.miniMap}
                      onChange={() => toggleLayer('miniMap')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Weather Status Strip</span>
                    <input
                      type="checkbox"
                      checked={layers.weatherOverlay}
                      onChange={() => toggleLayer('weatherOverlay')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
