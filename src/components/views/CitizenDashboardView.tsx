import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wind, 
  Waves, 
  CloudRain, 
  Home, 
  Check, 
  ArrowRight,
  LogOut,
  HeartHandshake
} from 'lucide-react';
import { InfrastructureAsset, CycloneScenario } from '../../types';
import { LocationConfig, LOCATION_OPTIONS } from '../../data/locationDatasets';
import { CitizenSafetyMap } from '../CitizenSafetyMap';

interface CitizenDashboardViewProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  onSelectShelter?: (asset: InfrastructureAsset) => void;
  onLogout: () => void;
  selectedLocation: string;
  onLocationChange?: (loc: string) => void;
  locationConfig?: LocationConfig;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  scenario,
  assets,
  onSelectShelter,
  onLogout,
  selectedLocation,
  onLocationChange,
  locationConfig,
}) => {
  const [sosSent, setSosSent] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [sosPhone, setSosPhone] = useState<string>('');

  // Primary shelter recommendation
  const shelters = assets.filter(a => a.type === 'Emergency Shelter');
  const nearestShelter = shelters[0] || {
    id: 'S4',
    name: 'Shelter S4 (Govt High School & Cyclone Refuge)',
    capacity: '4,300 / 5,000',
    distance: '4.8 km',
    status: 'Open'
  };

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setSosSent(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-14 font-sans text-slate-800">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: CITIZEN PORTAL IDENTIFIER + DISTRICT SELECTOR + LOGOUT       */}
      {/* ========================================================================= */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, #F7FBFF 0%, #EEF8FB 60%, #FFFFFF 100%)', 
          boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
        }}
        className="border border-[#DCEAF3] rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-black text-[#102A43] text-sm">PRAVAH AI</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
              CITIZEN SAFETY PORTAL
            </span>
          </div>

          {/* District Selector on Citizen Dashboard */}
          {onLocationChange && (
            <div className="flex items-center gap-1.5 bg-[#F0F6FA] border border-[#DCEAF3] rounded-xl px-2.5 py-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] text-[#607D94] uppercase font-semibold">Your Area:</span>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#102A43] focus:outline-none cursor-pointer"
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Profile / Logout Button (No role toggle inside dashboard) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSosModal(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCEAF3] bg-white hover:bg-rose-50 hover:text-rose-700 text-[#102A43] text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-[#607D94]" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CYCLONE STATUS & 2. YOUR AREA (Side-by-side or stacked clean cards)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CYCLONE STATUS */}
        <div 
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F5FAFD 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-5 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-rose-400 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#607D94] font-bold tracking-wider">
                CYCLONE STATUS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono font-bold text-[10px] border border-rose-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                Risk: HIGH
              </span>
            </div>

            <h2 className="text-xl font-black text-[#102A43]">
              {locationConfig?.cycloneName || 'Cyclone Varun'}
            </h2>
            <div className="text-xs text-rose-700 font-semibold mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Expected impact: ~{locationConfig?.baseTimeToLandfallHours || 18} hours ({locationConfig?.baseLandfallWindow || 'Tonight'})</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCEAF3]/80 text-xs text-[#607D94]">
            Designated coastal alert level: <strong className="text-[#102A43]">Very Severe Cyclonic Storm</strong>
          </div>
        </div>

        {/* YOUR AREA */}
        <div 
          style={{ 
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F5FAFD 100%)', 
            boxShadow: '0 4px 18px rgba(20, 80, 120, 0.06)' 
          }}
          className="p-5 rounded-2xl border border-[#DCEAF3] border-t-2 border-t-blue-400 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#607D94] font-bold tracking-wider">
                YOUR AREA
              </span>
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                {selectedLocation.split(',')[0]}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="text-[10px] text-[#607D94] block font-mono">Rain</span>
                <strong className="text-sky-700 text-sm">Heavy</strong>
                <span className="text-[10px] text-[#607D94] block">&gt;{locationConfig?.baseRainfallMm || 220} mm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="text-[10px] text-[#607D94] block font-mono">Wind</span>
                <strong className="text-amber-700 text-sm">{locationConfig?.baseWindKm || 120} km/h</strong>
                <span className="text-[10px] text-[#607D94] block">Gale squalls</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F0F6FA] border border-[#DCEAF3]">
                <span className="text-[10px] text-[#607D94] block font-mono">Surge</span>
                <strong className="text-rose-700 text-sm">High</strong>
                <span className="text-[10px] text-[#607D94] block">+{locationConfig?.baseSurgeM || 2.4} m tide</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#607D94]">
            State Disaster Management Authority protocol active.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. SAFETY MAP (Large, dominant, citizen-friendly Leaflet map)             */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
              Safety Map
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Clear turn-by-turn evacuation corridors &amp; verified shelters
          </span>
        </div>

        <CitizenSafetyMap
          locationConfig={locationConfig}
          assets={assets}
          onSelectShelter={onSelectShelter}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. YOUR NEAREST SAFE SHELTER & 5. IMPORTANT WARNING                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* YOUR NEAREST SAFE SHELTER */}
        <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider">
                YOUR NEAREST SAFE SHELTER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                ● Open &amp; Safe
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">
              {nearestShelter.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Distance</span>
                <strong className="text-slate-900 text-sm">4.8 km</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-mono">Capacity</span>
                <strong className="text-emerald-700 text-sm">{nearestShelter.capacity || '4,300 / 5,000'}</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Equipped with DG generator &amp; drinking water</span>
            <button
              onClick={() => onSelectShelter?.(nearestShelter as any)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Get Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* IMPORTANT WARNING */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>IMPORTANT WARNING</span>
            </div>

            <p className="text-sm font-semibold leading-relaxed text-slate-900 mt-1">
              "Road R17 (Coastal Highway SH-12) may become unsafe due to projected flooding.
              Use the recommended alternative route (Bypass R-21) and follow official evacuation instructions."
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/80 text-[11px] text-amber-900">
            Emergency rescue personnel stationed along bypass route R-21.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. WHAT SHOULD YOU DO? (Before / During / After)                          */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900">
          WHAT SHOULD YOU DO?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Before */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-900 uppercase font-mono text-[11px] text-blue-700 block">
              Before Landfall:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Keep emergency supplies, drinking water &amp; medicines ready.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Charge phones, radios and power banks fully.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Follow official cyclone bulletins from district administration.</span>
              </li>
            </ul>
          </div>

          {/* During */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-900 uppercase font-mono text-[11px] text-amber-700 block">
              During Cyclone:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Stay indoors or move to an authorized shelter if instructed.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Avoid flooded roads and storm surge channels.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Stay completely away from fallen power lines and wet electrical equipment.</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-900 uppercase font-mono text-[11px] text-emerald-700 block">
              After Landfall:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Wait for official safety clearance before stepping outside.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Avoid damaged infrastructure and standing floodwater.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Report trapped persons or emergencies to helpline numbers below.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Numbers */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <HeartHandshake className="w-4 h-4 text-rose-600" />
          <span>24x7 Emergency Helpline Numbers:</span>
        </div>
        <div className="flex items-center gap-3 font-mono font-bold text-xs">
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            State EOC: <strong className="text-blue-700">1070</strong>
          </span>
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            National Line: <strong className="text-emerald-700">112</strong>
          </span>
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            Ambulance: <strong className="text-rose-700">108</strong>
          </span>
        </div>
      </div>

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSosModal(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4 text-rose-600">
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="text-base font-black text-slate-900">Emergency Citizen SOS</h3>
                <p className="text-xs text-slate-500">Direct alert to District EOC</p>
              </div>
            </div>

            {sosSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-emerald-900 text-sm">SOS DISPATCH REGISTERED</div>
                <p className="text-slate-600">
                  Rescue incident ID #PRAVAH-SOS-8841 has been routed to District EOC. Keep your mobile line open. Do not attempt to walk through fast currents.
                </p>
                <button
                  onClick={() => {
                    setSosSent(false);
                    setShowSosModal(false);
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendSOS} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Mobile Number:</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={sosPhone}
                    onChange={(e) => setSosPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Location / Landmark:</label>
                  <input
                    type="text"
                    defaultValue={selectedLocation}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  GPS coordinates will be attached automatically from your device.
                </p>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Send Urgent Distress SOS
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
