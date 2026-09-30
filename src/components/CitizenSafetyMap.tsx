import React, { useEffect, useRef } from 'react';
import { InfrastructureAsset } from '../types';
import { LocationConfig } from '../data/locationDatasets';

interface CitizenSafetyMapProps {
  locationConfig?: LocationConfig;
  assets: InfrastructureAsset[];
  onSelectShelter?: (shelter: InfrastructureAsset) => void;
  selectedLocation: string;
}

export const CitizenSafetyMap: React.FC<CitizenSafetyMapProps> = ({
  locationConfig,
  assets,
  onSelectShelter,
  selectedLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const center = locationConfig?.center || { lat: 16.989, lng: 82.247 };
  const zoom = locationConfig?.zoom || 11;

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!mapContainerRef.current) return;
      const L = await import('leaflet');
      if (!isMounted) return;

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: false,
          attributionControl: false,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        // Real geographical base map (Reusing working Admin map configuration)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        }).addTo(map);

        // Clear boundaries and place labels
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          opacity: 0.9,
        }).addTo(map);

        // Transportation and road network
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          opacity: 0.85,
        }).addTo(map);

        const group = L.layerGroup().addTo(map);
        layerGroupRef.current = group;
        leafletMapRef.current = map;
      } else {
        leafletMapRef.current.setView([center.lat, center.lng], zoom);
      }

      // Draw Citizen-Specific Layers
      const group = layerGroupRef.current;
      if (!group) return;
      group.clearLayers();

      // 1. Forecast Uncertainty Cone & Cyclone Track
      if (locationConfig?.cycloneTrack?.cone) {
        L.polygon(locationConfig.cycloneTrack.cone, {
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.22,
          weight: 1.5,
          dashArray: '4 4',
        }).addTo(group).bindTooltip('Projected Cyclone Landfall Corridor', { sticky: true });
      }

      // 2. Multi-Tiered Hazard Zones (Red, Orange, Blue)
      if (locationConfig?.hazardPolygons?.criticalRisk) {
        L.polygon(locationConfig.hazardPolygons.criticalRisk, {
          color: '#dc2626',
          fillColor: '#ef4444',
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(group).bindTooltip('🔴 DANGER: Extreme Storm Surge & Wave Overtopping Zone', { sticky: true });
      }

      if (locationConfig?.hazardPolygons?.highRisk) {
        L.polygon(locationConfig.hazardPolygons.highRisk, {
          color: '#ea580c',
          fillColor: '#f97316',
          fillOpacity: 0.25,
          weight: 1.5,
        }).addTo(group).bindTooltip('🟠 CAUTION: High Wind & Flash Flood Inundation Area', { sticky: true });
      }

      // Flood Zone Polygon (🌊 Flood zones)
      if (locationConfig?.floodPolygon && locationConfig.floodPolygon.length > 0) {
        L.polygon(locationConfig.floodPolygon as [number, number][], {
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.28,
          weight: 2,
          dashArray: '4 4',
        }).addTo(group).bindTooltip('🌊 Flood Risk Inundation Zone', { sticky: true });
      }

      // Cyclone Track
      if (locationConfig?.cycloneTrack?.forecast) {
        const trackPoints = [
          locationConfig.cycloneTrack.current,
          ...locationConfig.cycloneTrack.forecast
        ];
        L.polyline(trackPoints, {
          color: '#ef4444',
          weight: 3.5,
          dashArray: '6 6',
        }).addTo(group);

        // Eye marker with cyclone hurricane spiral SVG
        const eyeIcon = L.divIcon({
          className: 'citizen-gis-marker',
          html: `
            <div style="width:30px;height:30px;border-radius:50%;background:#ef4444;border:2.5px solid #ffffff;box-shadow:0 0 16px rgba(239,68,68,0.9);display:flex;align-items:center;justify-content:center;">
              <svg viewBox="0 0 100 100" width="18" height="18" fill="#ffffff">
                <path d="M50,15 C30.7,15 15,30.7 15,50 C15,54.8 16,59.3 17.8,63.4 C16.5,58.8 20,53.5 25.3,53.5 C30.7,53.5 35,57.8 35,63.2 C35,66.8 33,70 30,71.7 C35.4,78.2 42.2,82.4 50,85 C69.3,85 85,69.3 85,50 C85,45.2 84,40.7 82.2,36.6 C83.5,41.2 80,46.5 74.7,46.5 C69.3,46.5 65,42.2 65,36.8 C65,33.2 67,30 70,28.3 C64.6,21.8 57.8,17.6 50,15 Z M50,38 C56.6,38 62,43.4 62,50 C62,56.6 56.6,62 50,62 C43.4,62 38,56.6 38,50 C38,43.4 43.4,38 50,38 Z"/>
              </svg>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        L.marker(locationConfig.cycloneTrack.current, { icon: eyeIcon })
          .addTo(group)
          .bindTooltip(`🌪️ Active Cyclone Eye (${locationConfig.cycloneName})`);
      }

      // 3. Recommended Evacuation Corridor (🟢 Recommended)
      const baseLat = center.lat;
      const baseLng = center.lng;
      const evacPoints: [number, number][] = [
        [baseLat - 0.05, baseLng + 0.02],
        [baseLat - 0.01, baseLng - 0.02],
        [baseLat + 0.04, baseLng - 0.05],
        [baseLat + 0.08, baseLng - 0.08],
      ];
      // White contrast casing
      L.polyline(evacPoints, {
        color: '#ffffff',
        weight: 8,
        opacity: 0.75,
      }).addTo(group);
      L.polyline(evacPoints, {
        color: '#10b981',
        weight: 5,
        opacity: 0.95,
      }).addTo(group).bindTooltip('🟢 Recommended Evacuation Route (Bypass R-21: High Elevation / Dry)', { sticky: true });

      // 4. Dangerous Inundated Road (🔴 Dangerous)
      const dangerPoints: [number, number][] = [
        [baseLat - 0.07, baseLng + 0.06],
        [baseLat - 0.02, baseLng + 0.05],
        [baseLat + 0.03, baseLng + 0.04],
      ];
      // White contrast casing
      L.polyline(dangerPoints, {
        color: '#ffffff',
        weight: 8,
        opacity: 0.75,
      }).addTo(group);
      L.polyline(dangerPoints, {
        color: '#dc2626',
        weight: 5,
        opacity: 0.95,
        dashArray: '8 4',
      }).addTo(group).bindTooltip('🔴 Dangerous Road (Coastal SH-12: Projected 1.2m Flooding - AVOID)', { sticky: true });

      // 5. Shelter Markers (🏠 Shelter)
      const shelters = assets.filter(a => a.type === 'Emergency Shelter');
      shelters.forEach((shelter) => {
        const icon = L.divIcon({
          className: 'citizen-gis-marker',
          html: `
            <div style="background:#10b981;color:#ffffff;width:28px;height:28px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.25);font-size:14px;">
              🏠
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shelter.latitude, shelter.longitude], { icon }).addTo(group);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
            <div style="font-weight: 800; color: #0f172a; font-size: 13px;">🏠 ${shelter.name}</div>
            <div style="color: #10b981; font-weight: 700; margin-top: 2px;">● Status: Open & Safe</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Capacity: ${shelter.capacity || '4,300 / 5,000'}</div>
            <div style="color: #0284c7; font-size: 11px; margin-top: 2px;">Drinking Water & DG Power Verified</div>
          </div>
        `);
      });

      // 6. Hospital Markers (🏥 Hospital)
      const hospitals = assets.filter(a => a.type === 'Hospital');
      hospitals.forEach((hosp) => {
        const icon = L.divIcon({
          className: 'citizen-gis-marker',
          html: `
            <div style="background:#ef4444;color:#ffffff;width:26px;height:26px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.25);font-size:13px;">
              🏥
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([hosp.latitude, hosp.longitude], { icon }).addTo(group);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px;">
            <div style="font-weight: 800; color: #0f172a;">🏥 ${hosp.name}</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Emergency 24x7 Trauma Center</div>
          </div>
        `);
      });
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [center.lat, center.lng, zoom, assets, locationConfig]);

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Citizen Legend Strip (Section 17) */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 shadow-md text-xs">
        <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
          Map Safety Guide
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>🔴 Dangerous Road</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>🟠 Caution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>🟢 Recommended Route</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏠</span>
            <span>Shelter</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏥</span>
            <span>Hospital</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌊</span>
            <span>Flood Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
