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
  Compass, 
  HelpCircle, 
  HeartHandshake, 
  Send, 
  Search, 
  Radio, 
  Share2, 
  FileText, 
  ChevronRight,
  Sparkles, 
  Phone, 
  Flame, 
  Volume2, 
  Check, 
  ArrowRight,
  LogOut,
  Home
} from 'lucide-react';
import { InfrastructureAsset, CycloneScenario } from '../../types';
import { LocationConfig, LOCATION_OPTIONS } from '../../data/locationDatasets';

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
  const [language, setLanguage] = useState<'EN' | 'OD' | 'TE' | 'HI'>('EN');
  const [shelterSearch, setShelterSearch] = useState<string>('');
  const [sosSent, setSosSent] = useState<boolean>(false);
  const [sosType, setSosType] = useState<'EVACUATION' | 'MEDICAL' | 'FOOD_WATER' | 'CUTOFF'>('EVACUATION');
  const [sosPhone, setSosPhone] = useState<string>('');
  const [sosMembers, setSosMembers] = useState<string>('3');
  const [activeTab, setActiveTab] = useState<'shelters' | 'routes' | 'sos' | 'bulletins' | 'checklist'>('shelters');

  // Emergency checklist state
  const [checklist, setChecklist] = useState<{ id: string; label: string; done: boolean }[]>([
    { id: 'c1', label: 'Pack drinking water bottles (3L per person minimum)', done: true },
    { id: 'c2', label: 'Charge all mobile phones, power banks and emergency torches', done: true },
    { id: 'c3', label: 'Keep Aadhaar, ration card, land papers in waterproof sealed bags', done: false },
    { id: 'c4', label: 'Essential medicines, first-aid kit, ORS packets, baby food packed', done: false },
    { id: 'c5', label: 'Locate keys to domestic livestock tie-downs and shelter paths', done: true },
    { id: 'c6', label: 'Disconnect electrical appliances and main breaker before leaving home', done: false },
    { id: 'c7', label: 'Move elder family members & infants to designated high school shelter now', done: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Shelters filtered from assets
  const shelters = assets.filter(a => a.type === 'Emergency Shelter');
  const filteredShelters = shelters.filter(s => {
    if (!shelterSearch.trim()) return true;
    const q = shelterSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
  });

  // Roads status
  const roads = assets.filter(a => a.type === 'Arterial Road' || a.type === 'Coastal Bridge');
  const districtRoads = locationConfig?.roads || [];
  const warnings = locationConfig?.citizenWarnings || [];

  const isAP = locationConfig?.state === 'Andhra Pradesh';

  const emergencyContacts = isAP ? [
    { label: 'State Emergency Operations Center (AP EOC)', number: '1070', active: true },
    { label: 'AP Disaster Management Authority (APSDMA)', number: '0863-2377018', active: true },
    { label: 'Emergency Ambulance & Medical Dispatch', number: '108', active: true },
    { label: 'National Disaster Line (NDRF)', number: '112', active: true },
    { label: 'Kakinada / Vizag District Control Room', number: '0884-2365424', active: true },
  ] : [
    { label: 'State Emergency Operations Center (Odisha EOC)', number: '1070', active: true },
    { label: 'National Disaster Response Force (NDRF)', number: '112 / 1078', active: true },
    { label: 'Emergency Ambulance & Medical Dispatch', number: '108', active: true },
    { label: 'Coastal Marine & Coast Guard Helpline', number: '1554', active: true },
    { label: 'District Kendrapara / Puri Control Room', number: '06727-232804', active: true },
  ];

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setSosSent(true);
  };

  return (
    <div className="space-y-6 max-w-[1560px] mx-auto pb-12">
      {/* Top Citizen Navigation & District Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm">PRAVAH AI</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
              CITIZEN SAFETY PORTAL
            </span>
          </div>

          {/* District selector on Citizen Dashboard */}
          {onLocationChange && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Area:</span>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
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

        {/* Back to Home / Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Home / Exit</span>
        </button>
      </div>

      {/* Top Public Alert Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white rounded-2xl p-5 sm:p-6 shadow-md shadow-rose-600/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <ShieldAlert className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 text-[11px] font-black uppercase tracking-wider">
                RED ALERT • LANDFALL WARNING
              </span>
              <span className="text-rose-100 text-xs font-mono">
                {isAP ? 'Andhra Pradesh State Disaster Management Authority (APSDMA)' : 'Odisha State Disaster Management Authority (OSDMA)'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
              {locationConfig?.cycloneName || 'Cyclone Varun'} Approaching {locationConfig?.shortName || selectedLocation}
            </h1>
            <p className="text-sm text-rose-50 mt-1 max-w-2xl leading-relaxed">
              Max sustained wind at <strong className="text-white underline">{scenario.maxSustainedWind}</strong>. Storm surge of up to <strong className="text-white underline">{scenario.stormSurgeEstimate}</strong> projected. Residents in low-lying coastal areas within 5 km of shoreline are instructed to move immediately to registered cyclone shelters.
            </p>
          </div>
        </div>

        {/* Quick Actions & Language Selector */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs">
            <span className="text-rose-200 px-2 text-[10px] font-mono uppercase font-bold">Language:</span>
            {(['EN', 'OD', 'TE', 'HI'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === l ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-100 hover:text-white'
                }`}
              >
                {l === 'OD' ? 'ଓଡ଼ିଆ' : l === 'TE' ? 'తెలుగు' : l === 'HI' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('sos')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-rose-700" />
            ONE-CLICK CITIZEN SOS DISPATCH
          </button>
        </div>
      </div>

      {/* Key Meteorological Counters for Citizens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Time to Landfall</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5 font-mono">
            {locationConfig?.baseTimeToLandfallHours || 18} Hours
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Window: {locationConfig?.baseLandfallWindow || 'Tonight / Tomorrow'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Local Peak Wind</span>
            <Wind className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5 font-mono">
            {scenario.maxSustainedWind}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            {locationConfig?.category || 'Very Severe Cyclonic Storm'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tidal Storm Surge</span>
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5 font-mono">
            {scenario.stormSurgeEstimate}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            High Inundation Risk in {locationConfig?.shortName || 'Coast'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Shelter Network Status</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1.5 font-mono">
            {shelters.length} Shelters
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Pre-staged water & generator sets
          </div>
        </div>
      </div>

      {/* Warnings Banner if available */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w) => (
            <div key={w.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{w.title}</h4>
                  <p className="text-slate-700 mt-0.5">{w.desc}</p>
                  {w.closedRoad && (
                    <div className="mt-1 flex items-center gap-3 text-[11px] flex-wrap">
                      <span className="text-rose-700 font-semibold">❌ Closed Road: {w.closedRoad}</span>
                      {w.recommendedRoad && (
                        <span className="text-emerald-700 font-semibold">✅ Alternate Route: {w.recommendedRoad}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {w.nearestShelter && (
                <div className="shrink-0 text-right bg-white p-2 px-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-400 block font-mono">Nearest Shelter</span>
                  <span className="font-bold text-slate-900">{w.nearestShelter}</span>
                  <span className="text-[10px] text-blue-600 block">{w.shelterDistance}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('shelters')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'shelters'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>FIND SAFE SHELTERS</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'routes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>ROAD PASSABILITY & DETOURS</span>
        </button>

        <button
          onClick={() => setActiveTab('sos')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sos'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-rose-500" />
          <span>CITIZEN SOS DISPATCH</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>FAMILY PREPAREDNESS CHECKLIST</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletins')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bulletins'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>OFFICIAL BULLETINS</span>
        </button>
      </div>

      {/* TAB 1: SHELTERS */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search shelter by name or panchayat..."
                value={shelterSearch}
                onChange={(e) => setShelterSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Green: Space Available</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span>
              <span>Amber: &gt;80% Full</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShelters.map((shelter) => (
              <div
                key={shelter.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {shelter.id}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{shelter.name}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{shelter.district} Coastal Belt</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[10px] font-mono border border-emerald-200">
                      OPERATIONAL
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <div>
                      <strong>Capacity:</strong> {shelter.capacity || '2,000 Persons'}
                    </div>
                    <div>
                      <strong>Backup Power:</strong> {shelter.backupPower || 'Verified DG Generator'}
                    </div>
                    <div>
                      <strong>Drinking Water:</strong> 72hr Filtered Water Buffer Available
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-blue-600 font-semibold">Trained Medical First-Aider on site</span>
                  {onSelectShelter && (
                    <button
                      onClick={() => onSelectShelter(shelter)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-2xs"
                    >
                      View on Map
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ROUTES & PASSABILITY */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Active Evacuation Corridors ({locationConfig?.name || selectedLocation})
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Real-time hydrodynamic flood simulation indicates which roads are safe and which are submerged.
            </p>

            <div className="space-y-3">
              {districtRoads.map((road) => (
                <div
                  key={road.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    road.riskLevel === 'CRITICAL'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span>{road.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        road.riskLevel === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {road.riskLevel === 'CRITICAL' ? 'SUBMERGED / IMPASSABLE' : 'CLEAR & PASSABLE'}
                      </span>
                    </div>
                    <div className="text-xs mt-1 text-slate-700">
                      <strong>Projected Flood Depth:</strong> {road.floodDepth} • <strong>Condition:</strong> {road.expectedDisruption}
                    </div>
                    {road.alternateRouteName && (
                      <div className="mt-1 text-blue-700 font-semibold">
                        &rarr; Recommended Bypass: {road.alternateRouteName} ({road.detourTime})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CITIZEN SOS */}
      {activeTab === 'sos' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-2">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Emergency Citizen SOS Dispatch</h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct telemetry uplink to State EOC (1070) & Local SDRF rescue teams.
            </p>
          </div>

          {sosSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-emerald-900 text-sm">SOS DISPATCH REGISTERED</div>
              <p className="text-slate-600">
                Rescue incident ID #PRAVAH-SOS-8841 has been routed to District EOC. Keep your mobile line open. Do not attempt to walk through fast currents.
              </p>
              <button
                onClick={() => setSosSent(false)}
                className="text-xs font-bold text-blue-600 hover:underline pt-2 block mx-auto cursor-pointer"
              >
                Send Another Alert
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendSOS} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Nature:</label>
                <select
                  value={sosType}
                  onChange={(e: any) => setSosType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                >
                  <option value="EVACUATION">Rescue Assistance Needed (Water Ingress)</option>
                  <option value="MEDICAL">Medical Emergency / Pregnant / Elderly</option>
                  <option value="FOOD_WATER">Drinking Water & Food Cutoff</option>
                  <option value="CUTOFF">Total Road Isolation / Trapped on Roof</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Contact Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98490 12345"
                  value={sosPhone}
                  onChange={(e) => setSosPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Number of Family Members Trapped:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={sosMembers}
                  onChange={(e) => setSosMembers(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                TRANSMIT IMMEDIATE EMERGENCY SOS
              </button>
            </form>
          )}

          {/* Emergency contacts list */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-2">
              Official Helpline Numbers:
            </span>
            <div className="space-y-1.5 text-xs">
              {emergencyContacts.map((c) => (
                <div key={c.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">{c.label}</span>
                  <a href={`tel:${c.number}`} className="font-mono font-bold text-blue-700 hover:underline">
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">Family Cyclone Safety Checklist</h2>
          <p className="text-xs text-slate-500">
            Verify each safety item prior to storm landfall. Keep emergency bag ready.
          </p>

          <div className="space-y-2 pt-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-all ${
                  item.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={`text-xs font-medium flex-1 ${item.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BULLETINS */}
      {activeTab === 'bulletins' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Official Government Cyclone Bulletins (Plain Citizen Language)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified announcements reviewed and authorized by the Special Relief Commissioner.
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                  <span className="font-bold text-blue-700">SPECIAL BULLETIN #07</span>
                  <span>Issued Today at 09:30 IST</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Fishermen Advisory & Mandatory Shoreline Evacuation Order
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  All fishing operations along Dhamra, Paradip, Kakinada, and Gopalpur remain strictly suspended. 100% of fishing trawlers have reported back to harbour. Low-lying hamlets in {locationConfig?.shortName || selectedLocation} delta must finish moving to designated cyclone shelters before noon. Free hot meals and baby nutrition kits are active at all registered state shelters.
                </p>
                <div className="mt-2 text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authorized by State Disaster Management Control Room
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                  <span className="font-bold text-blue-700">SPECIAL BULLETIN #06</span>
                  <span>Issued Yesterday at 18:00 IST</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Drinking Water & Power Supply Precautionary Measures
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Power distribution will be systematically switched to underground feeders as wind speeds cross 80 km/h to prevent electrocution hazard from fallen trees. Mobile water tankers with generator backup pumps have been deployed to all high school shelters.
                </p>
                <div className="mt-2 text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authorized by Department of Energy & Municipal Administration
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
