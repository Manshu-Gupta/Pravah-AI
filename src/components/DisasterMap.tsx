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
  Eye,
  Sliders,
  Check,
  Building2,
  Navigation,
  Globe,
  Radio,
  ArrowRight,
  Crosshair,
  Share2,
  Info
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
  showEvacuationRoute = false,
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
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    locationConfig?.center || { lat: 16.989, lng: 82.247 }
  );
  const [activeTab, setActiveTab] = useState<'layers' | 'routes' | 'damage_chain'>('layers');
  const [highlightDamageChain, setHighlightDamageChain] = useState<boolean>(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    // Base Map
    roadmap: false,
    satellite: true,
    terrain: false,
    // Cyclone
    cycloneTrack: true,
    forecastCone: true,
    windExposure: true,
    pressure: false,
    // Hazards
    rainfall: true,
    floodRisk: true,
    stormSurge: true,
    coastalInundation: true,
    // Earth Engine
    geeSatellite: true,
    geeElevation: true,
    geeLandCover: false,
    geeWaterBodies: true,
    geeHistoricalChange: false,
    // Infrastructure
    hospitals: true,
    roads: true,
    bridges: true,
    shelters: true,
    powerSubstations: true,
    criticalFacilities: true,
  });

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Pre-configured search locations
  const searchLocations: Record<string, { lat: number; lng: number; label: string }> = {
    'kakinada': { lat: 16.989, lng: 82.247, label: 'Kakinada / East Godavari' },
    'east godavari': { lat: 16.989, lng: 82.247, label: 'East Godavari Delta' },
    'uppada': { lat: 17.065, lng: 82.315, label: 'Uppada Coastal Revetment' },
    'puri': { lat: 19.813, lng: 85.831, label: 'Puri Coastal Belt' },
    'kendrapara': { lat: 20.505, lng: 86.422, label: 'Kendrapara Delta' },
    'paradip': { lat: 20.316, lng: 86.611, label: 'Paradip Port' },
    'visakhapatnam': { lat: 17.686, lng: 83.218, label: 'Visakhapatnam Harbor' },
    'ersama': { lat: 20.210, lng: 86.460, label: 'Ersama Coastal Refuge' },
    'gopalpur': { lat: 19.260, lng: 84.908, label: 'Gopalpur Coastal Node' },
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
      if (asset.type === 'Coastal Bridge' && !layers.bridges) return false;
      if (asset.type === 'Emergency Shelter' && !layers.shelters) return false;
      if (asset.type === 'Power Substation' && !layers.powerSubstations) return false;
      if (['Water Treatment', 'Telecom Tower', 'Port Facility'].includes(asset.type) && !layers.criticalFacilities) return false;
      return true;
    });
  }, [assets, layers]);

  // Asset custom icon renderer with Department highlight support
  const getAssetMarkerIcon = (asset: InfrastructureAsset) => {
    let iconSvg = '';
    let bgColor = '#0ea5e9';

    switch (asset.type) {
      case 'Hospital':
        bgColor = '#ef4444'; // Red
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        break;
      case 'Power Substation':
        bgColor = '#f59e0b'; // Amber
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
        break;
      case 'Emergency Shelter':
        bgColor = '#10b981'; // Green
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`;
        break;
      case 'Arterial Road':
        bgColor = '#3b82f6'; // Blue
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="19" x2="20" y2="19"></line><line x1="4" y1="5" x2="20" y2="5"></line><line x1="4" y1="12" x2="20" y2="12" stroke-dasharray="2,2"></line></svg>`;
        break;
      case 'Coastal Bridge':
        bgColor = '#f97316'; // Orange
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><path d="M4 19V9a4 4 0 0 1 8 0v10"></path><path d="M12 19V9a4 4 0 0 1 8 0v10"></path></svg>`;
        break;
      default:
        bgColor = '#a855f7'; // Purple
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    }

    const isSelected = selectedAsset?.id === asset.id;
    const isCritical = asset.riskLevel === 'CRITICAL';
    
    // Check if matching current selected Department filter
    const matchesDepartment = selectedDepartment === 'ALL' || asset.department === selectedDepartment;
    const opacity = matchesDepartment ? 1.0 : 0.45;
    const isDeptHighlighted = selectedDepartment !== 'ALL' && asset.department === selectedDepartment;

    return {
      html: `
        <div style="
          position: relative;
          width: ${isSelected || isDeptHighlighted ? '34px' : '26px'};
          height: ${isSelected || isDeptHighlighted ? '34px' : '26px'};
          background-color: ${bgColor};
          opacity: ${opacity};
          border: ${isDeptHighlighted ? '3px solid #2563eb' : '2px solid #ffffff'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 ${isSelected || isDeptHighlighted ? '22px' : '10px'} ${bgColor};
          cursor: pointer;
          transition: all 0.2s ease;
          ${isCritical ? 'animation: pulseHalo 2s infinite;' : ''}
        ">
          ${iconSvg}
          ${isSelected || isDeptHighlighted ? `
            <div style="
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translateX(-50%);
              background: #0f172a;
              color: #ffffff;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 4px;
              border: 1px solid #38bdf8;
              white-space: nowrap;
            ">
              ${asset.id}
            </div>
          ` : ''}
        </div>
      `,
      size: [isSelected || isDeptHighlighted ? 34 : 26, isSelected || isDeptHighlighted ? 34 : 26] as [number, number],
    };
  };

  // Initialize interactive Leaflet map instance
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

      // Update Tile Layer based on mapType
      const map = leafletMapRef.current;
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      if (mapType === 'satellite') {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
        }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          opacity: 0.85,
        }).addTo(map);
      } else if (mapType === 'terrain') {
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
        }).addTo(map);
      } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
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

  // Update dynamic overlays, markers, cyclone track, and route lines
  useEffect(() => {
    if (!leafletMapRef.current || !layersGroupRef.current) return;

    import('leaflet').then((L) => {
      const group = layersGroupRef.current;
      group.clearLayers();

      const scenario = SCENARIO_CONFIGS[currentScenarioKey] || SCENARIO_CONFIGS['standard'];
      const trackConfig = locationConfig?.cycloneTrack;
      const surgeCoords = locationConfig?.surgePolygon;
      const floodCoords = locationConfig?.floodPolygon;
      const roadsList = locationConfig?.roads;

      // 1. CYCLONE TRACK & UNCERTAINTY CONE
      if (layers.cycloneTrack && trackConfig) {
        // Past Track
        L.polyline(trackConfig.past, {
          color: '#64748b',
          weight: 3,
          dashArray: '4, 4',
        }).addTo(group).bindTooltip('Historical Cyclone Track (Past 24h)');

        // Forecast Track Line
        L.polyline(trackConfig.forecast, {
          color: '#ef4444',
          weight: 4,
          dashArray: '8, 6',
        }).addTo(group).bindTooltip(`Projected Landfall Trajectory (${scenario.name})`);

        // Forecast Uncertainty Cone
        if (layers.forecastCone && trackConfig.cone) {
          L.polygon(trackConfig.cone, {
            color: '#f97316',
            fillColor: '#f97316',
            fillOpacity: 0.16,
            weight: 1.5,
            dashArray: '4, 4',
          }).addTo(group).bindTooltip('Cone of Uncertainty (IMD Ensemble 70% Confidence)');
        }

        // Cyclone Eye Pulse (Current Position)
        const eyeMarker = L.circle(trackConfig.current, {
          color: '#dc2626',
          fillColor: '#ef4444',
          fillOpacity: 0.5,
          radius: 32000,
          weight: 2,
        }).addTo(group);

        eyeMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 200px;">
            <div style="font-weight: bold; color: #dc2626; font-size: 13px;">CYCLONE EYE: ${locationConfig?.cycloneName || 'Cyclone Varun'}</div>
            <div style="color: #64748b; font-size: 11px;">${locationConfig?.category || 'Very Severe Cyclonic Storm (VSCS)'}</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div style="margin-bottom: 2px;"><strong>Max Wind:</strong> ${Math.round(locationConfig?.baseWindKm || 140 * scenario.windMultiplier)} km/h</div>
            <div style="margin-bottom: 2px;"><strong>Central Pressure:</strong> 968 hPa</div>
            <div style="margin-bottom: 2px;"><strong>Estimated Landfall:</strong> ${locationConfig?.baseLandfallWindow || '18 hrs'}</div>
            <div style="margin-bottom: 2px;"><strong>Confidence:</strong> 94% (Ensemble Agreement)</div>
            <div style="margin-top: 6px; padding: 4px 6px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #b91c1c; font-size: 10px;">
              DEMO / SIMULATED TRACK DATA
            </div>
          </div>
        `);

        // Wind Radii Rings (Dynamically scaled by scenario)
        if (layers.windExposure) {
          const galeRadius = (trackConfig.galeRadiusKm || 55) * scenario.windMultiplier * 1000;
          const outerRadius = (trackConfig.outerWindRadiusKm || 115) * scenario.windMultiplier * 1000;

          // Core Gale Zone
          L.circle(trackConfig.current, {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.12,
            weight: 2,
            radius: galeRadius,
            dashArray: '6, 6',
          }).addTo(group).bindTooltip(`Core Gale Wind Zone (>120 km/h) • Radius: ${Math.round(galeRadius / 1000)}km`);

          // Severe Outer Gale
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

      // 2. STORM SURGE INUNDATION ENVELOPE (Scaled by scenario)
      if ((layers.stormSurge || layers.coastalInundation) && surgeCoords) {
        const surgePolygon = L.polygon(surgeCoords, {
          color: '#0284c7',
          fillColor: '#06b6d4',
          fillOpacity: 0.28 * scenario.surgeMultiplier,
          weight: 2,
        }).addTo(group);

        surgePolygon.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
            <div style="font-weight: bold; color: #0369a1; font-size: 13px;">STORM SURGE INUNDATION ZONE</div>
            <div style="color: #64748b; font-size: 11px;">Coastal Inundation Risk: HIGH</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div><strong>Projected Surge:</strong> ${(locationConfig?.baseSurgeM || 3.0) * scenario.surgeMultiplier}m above astronomical tide</div>
            <div><strong>Inundation Reach:</strong> Up to 5.5 km inland</div>
            <div><strong>Affected Assets:</strong> Coastal revetments, low-lying substations & hamlets</div>
            <div style="margin-top: 6px; padding: 4px 6px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; color: #0369a1; font-size: 10px;">
              DEMO / SIMULATED HYDRODYNAMIC MODEL
            </div>
          </div>
        `);
      }

      // 3. HEAVY RAINFALL / FLOOD RISK POLYGON (Scaled by scenario)
      if ((layers.floodRisk || layers.rainfall) && floodCoords) {
        const floodPolygon = L.polygon(floodCoords, {
          color: '#2563eb',
          fillColor: '#38bdf8',
          fillOpacity: 0.22 * scenario.rainMultiplier,
          weight: 2,
          dashArray: '5, 5',
        }).addTo(group);

        floodPolygon.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
            <div style="font-weight: bold; color: #1d4ed8; font-size: 13px;">HEAVY RAINFALL & FLOOD RISK AREA</div>
            <div style="color: #64748b; font-size: 11px;">Convective Basin Precipitation</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div><strong>Expected Rain:</strong> ${Math.round((locationConfig?.baseRainfallMm || 240) * scenario.rainMultiplier)} mm in 24h</div>
            <div><strong>Drainage Status:</strong> Low-lying basin waterlogging expected</div>
            <div><strong>Road Overtopping:</strong> 1.2m to 1.8m projected depth</div>
            <div style="margin-top: 6px; padding: 4px 6px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: #1e40af; font-size: 10px;">
              DEMO / SIMULATED ISOHYET ENVELOPE
            </div>
          </div>
        `);
      }

      // 4. EVACUATION ROUTES & ARTERIAL ROADS
      if (roadsList && roadsList.length > 0) {
        roadsList.forEach((road) => {
          const isAtRisk = road.riskLevel === 'CRITICAL' || road.riskLevel === 'HIGH';
          const roadColor = isAtRisk ? '#ef4444' : '#10b981';
          const roadLine = L.polyline(road.path, {
            color: roadColor,
            weight: isAtRisk ? 5 : 4,
            dashArray: isAtRisk ? '8, 6' : undefined,
            opacity: 0.85,
          }).addTo(group);

          roadLine.bindTooltip(`
            <div style="font-family: inherit; font-size: 11px; padding: 2px;">
              <strong>${road.name}</strong><br/>
              Status: <span style="color: ${roadColor}; font-weight: bold;">${road.status} [${road.riskLevel}]</span><br/>
              Projected Flood Depth: ${road.floodDepth}
            </div>
          `);
        });
      }

      // 5. ASSET MARKERS WITH CUSTOM ICONS
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

        marker.bindTooltip(`
          <div style="font-family: inherit; font-size: 11px; padding: 2px;">
            <div style="font-weight: bold; color: #0f172a;">${asset.name} (${asset.id})</div>
            <div style="color: #64748b;">${asset.type} • ${asset.district}</div>
            <div style="margin-top: 2px; color: ${asset.riskLevel === 'CRITICAL' ? '#dc2626' : '#d97706'}; font-weight: bold;">
              Risk: ${asset.riskScore}/100 [${asset.riskLevel}]
            </div>
            <div style="font-size: 10px; color: #0284c7;">Time to Impact: ${asset.timeToImpact}</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -14],
          className: 'pravah-tooltip',
        });

        marker.addTo(group);
      });
    });
  }, [
    visibleAssets, 
    layers, 
    selectedAsset, 
    showEvacuationRoute, 
    selectedRouteId, 
    highlightDamageChain, 
    activeTab, 
    mapType,
    selectedLocation,
    currentScenarioKey,
    selectedDepartment,
    locationConfig
  ]);

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative w-full h-full flex flex-col bg-slate-100 rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[580px]'
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
              placeholder="Search location or asset (e.g. Kakinada, H-07, Uppada)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
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
            <MapPin className="w-3.5 h-3.5" />
            {locationConfig?.name || selectedLocation}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
            DEMO / SIMULATED GEOSPATIAL DATA
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
      <div className="relative flex-1 w-full h-full min-h-[500px]">
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

        {/* Floating Layer Controls Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-3 right-3 z-30 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-3.5 text-xs text-slate-800 animate-in slide-in-from-right">
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

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {/* Cyclone Layer Group */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                  Cyclone Track & Wind
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Wind className="w-3 h-3 text-rose-500" /> Cyclone Eye & Track
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
                      <Compass className="w-3 h-3 text-amber-500" /> Forecast Uncertainty Cone
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
                      <Radio className="w-3 h-3 text-red-500" /> Gale Wind Zones
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

              {/* Hazard Polygons */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                  Hazard Envelopes
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Waves className="w-3 h-3 text-cyan-600" /> Storm Surge (Inundation)
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.stormSurge}
                      onChange={() => toggleLayer('stormSurge')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <CloudRain className="w-3 h-3 text-blue-500" /> Heavy Rainfall (Isohyets)
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.rainfall}
                      onChange={() => toggleLayer('rainfall')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Infrastructure Layers */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-1">
                  Infrastructure Assets
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> Hospitals & Clinics
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
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Power Substations
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
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Shelters & Refuges
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
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span> Roads & Bridges
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
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span> Water & Critical Ports
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.criticalFacilities}
                      onChange={() => toggleLayer('criticalFacilities')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Asset Risk Card (Bottom Center / Left) */}
        {selectedAsset && (
          <div className="absolute bottom-4 left-4 z-30 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl text-xs animate-in slide-in-from-bottom text-slate-800">
            <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-blue-700 font-bold border border-slate-200">
                    {selectedAsset.id}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {selectedAsset.type} • {selectedAsset.district}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedAsset.name}</h4>
              </div>
              <button
                onClick={() => onSelectAsset(null as any)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[9px] font-mono uppercase text-slate-500">Risk Score</span>
                <div className="text-lg font-black text-rose-600 font-mono">
                  {selectedAsset.riskScore}/100 [{selectedAsset.riskLevel}]
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase text-slate-500">Time to Impact</span>
                <div className="text-base font-bold text-blue-700 font-mono">
                  {selectedAsset.timeToImpact}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-3 text-[11px]">
              <div>
                <strong className="text-rose-600">Hazards:</strong> {selectedAsset.hazards.join(', ')}
              </div>
              <div>
                <strong className="text-purple-600">Dependencies:</strong> {selectedAsset.dependencies.join(', ')}
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed">
                <strong className="text-amber-700">Potential Impact:</strong> {selectedAsset.potentialImpact}
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 leading-relaxed">
                <strong className="text-blue-700">Recommended Action:</strong> {selectedAsset.recommendedActions[0]}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setHighlightDamageChain(true);
                  onOpenDamageChain?.(selectedAsset.id);
                }}
                className="py-1.5 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                View Damage Chain
              </button>

              <button
                onClick={() => onDraftAdvisory?.(selectedAsset)}
                className="py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Generate Advisory
              </button>
            </div>
          </div>
        )}

        {/* Legend Overlay (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 hidden md:block bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-md text-[11px] max-w-xs text-slate-700">
          <div className="font-mono text-[10px] uppercase text-slate-500 font-bold mb-1.5">
            Tactical Map Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-800">Hospital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-800">Substation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-800">Shelter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-slate-800">Road / Bridge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-rose-500"></span>
              <span className="text-slate-800">Cyclone Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-cyan-500/40 border border-cyan-500"></span>
              <span className="text-slate-800">Storm Surge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
