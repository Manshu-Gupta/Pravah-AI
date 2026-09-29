import React, { useState } from 'react';
import { 
  Wind, 
  Shield, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Zap, 
  MapPin, 
  Compass, 
  HeartHandshake, 
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
  GitBranch,
  Radio,
  FileText,
  LifeBuoy,
  Stethoscope,
  Truck,
  Check,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';
import { LOCATION_OPTIONS, ALL_LOCATION_CONFIGS } from '../data/locationDatasets';

interface LandingPageProps {
  onSelectRole: (role: UserRole, officerName?: string, location?: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  selectedLocation,
  onLocationChange,
}) => {
  const [selectedOfficer, setSelectedOfficer] = useState<string>('Officer S. Patnaik');
  const [officerDesignation, setOfficerDesignation] = useState<string>('Collector & District Magistrate (EOC Command)');
  const [previewScenario, setPreviewScenario] = useState<'BASE' | 'RAIN' | 'SURGE'>('BASE');
  const [activeStakeholderTab, setActiveStakeholderTab] = useState<number>(0);

  // Dedicated Login Modals state (Sections 1, 2, 3)
  const [showAuthorityModal, setShowAuthorityModal] = useState<boolean>(false);
  const [showCitizenModal, setShowCitizenModal] = useState<boolean>(false);
  const [officerId, setOfficerId] = useState<string>('admin');
  const [officerPassword, setOfficerPassword] = useState<string>('demo123');
  const [citizenName, setCitizenName] = useState<string>('Citizen User');
  const [loginError, setLoginError] = useState<string | null>(null);

  const demoOfficers = [
    { name: 'Officer S. Patnaik', designation: 'Collector & District Magistrate (EOC Command)' },
    { name: 'Er. A. Ray', designation: 'Superintending Engineer (Power Grid & Substations)' },
    { name: 'Dr. M. Das', designation: 'Chief District Medical Officer (Health & Trauma)' },
    { name: 'Er. K. Sahoo', designation: 'Executive Engineer (PWD Highways & Bridges)' },
  ];

  const handleOfficerSelect = (officer: { name: string; designation: string }) => {
    setSelectedOfficer(officer.name);
    setOfficerDesignation(officer.designation);
  };

  const handleAuthoritySignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim()) {
      setLoginError('Please enter your Officer ID');
      return;
    }
    setLoginError(null);
    setShowAuthorityModal(false);
    onSelectRole('ADMIN', selectedOfficer, selectedLocation);
  };

  const handleCitizenContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCitizenModal(false);
    onSelectRole('CITIZEN', citizenName.trim() || 'Citizen User', selectedLocation);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentLocationConfig = ALL_LOCATION_CONFIGS[selectedLocation] || ALL_LOCATION_CONFIGS['East Godavari, Andhra Pradesh'];

  const stakeholders = [
    {
      title: 'State & District Disaster Authorities (SDMA / DDMA)',
      role: 'District Collectors, Relief Commissioners, EOC Controllers',
      icon: Shield,
      color: 'blue',
      description: 'Single operating picture with high-resolution exposure polygons, probabilistic damage timelines, and multi-agency command dispatch tools.',
      benefits: [
        'Real-time automated incident command summaries',
        'Direct evacuation corridor passability verification',
        'Official multi-lingual public advisory generation'
      ]
    },
    {
      title: 'Power & Utility Boards (DISCOMs / Transco)',
      role: 'Grid Engineers, Substation Officers, Line Maintenance',
      icon: Zap,
      color: 'amber',
      description: 'Predict which 33kV/132kV/220kV feeders and transformers face inundation depth or wind gust stress prior to landfall.',
      benefits: [
        'Early load diversion and feeder de-energization schedules',
        'Diesel generator fuel and submersible pump logistics',
        'Post-landfall rapid restoration prioritization'
      ]
    },
    {
      title: 'Health & Emergency Medical Services',
      role: 'Chief Medical Officers, Trauma Centers, Ambulance Fleets',
      icon: Stethoscope,
      color: 'rose',
      description: 'Protect patient care continuity by predicting backup oxygen exhaustion, road blockages to hospitals, and secondary water contamination.',
      benefits: [
        'ICU patient evacuation threshold alerts',
        'Alternative ambulance routing around inundated bridges',
        'Anti-venom and water purification buffer tracking'
      ]
    },
    {
      title: 'Public Works & Highway Authorities (PWD / NHAI)',
      role: 'Bridge Inspectors, Highway Patrol, Municipal Drainage',
      icon: Truck,
      color: 'emerald',
      description: 'Monitor structural vulnerability of arterial highways, coastal bridges, and storm-water drainage sluice gates in real-time.',
      benefits: [
        'Pre-emptive barrier deployment at low-lying culverts',
        'Heavy earthmover pre-positioning at high-risk choke points',
        'Hydraulic clearance tracking for coastal estuaries'
      ]
    },
    {
      title: 'Coastal Citizens & Community Volunteers',
      role: 'Residents, Village Sarpanches, Local Cyclone Shelters',
      icon: Users,
      color: 'indigo',
      description: 'Clear, uncluttered safety guidance with localized shelter availability, flood-safe evacuation routes, and verified SOS channels.',
      benefits: [
        'Nearest verified cyclone shelter with bed and supply capacity',
        'Clear turn-by-turn guidance avoiding flooded highways',
        '24x7 emergency contacts and one-touch SOS dispatch'
      ]
    }
  ];

  return (
    <div id="home" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      {/* ========================================================================= */}
      {/* SECTION A: STICKY NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 px-4 sm:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">PRAVAH AI</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-bold border border-blue-200">
                  DISASTER INTELLIGENCE PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Predict. Prepare. Protect.</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={() => scrollToSection('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => scrollToSection('problem')} className="hover:text-blue-600 transition-colors cursor-pointer">
              The Gap
            </button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Capabilities
            </button>
            <button onClick={() => scrollToSection('workflow')} className="hover:text-blue-600 transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('stakeholders')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Stakeholders
            </button>
            <button onClick={() => scrollToSection('technology')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Technology
            </button>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCitizenModal(true)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 hover:border-emerald-300"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Citizen Portal</span>
            </button>
            <button
              onClick={() => setShowAuthorityModal(true)}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Authority Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* SECTION B: HERO SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Next-Generation Disaster Decision-Support Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                From cyclone forecasts to <span className="text-blue-600">coordinated action.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                PRAVAH AI connects weather intelligence, geospatial exposure, infrastructure vulnerability and AI-powered decision support to help communities and authorities prepare before extreme weather impacts.
              </p>

              {/* District Quick-Switch Selector */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs max-w-xl flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>District:</span>
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer hover:bg-slate-100 flex-1 min-w-[200px]"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {currentLocationConfig.populationAtRisk?.toLocaleString()} exposed
                </span>
              </div>

              {/* Two Clear Primary Options (Section 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
                {/* Option 1: AUTHORITY / ADMIN */}
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-500 shadow-xs transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        COMMAND EOC
                      </span>
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm">AUTHORITY / ADMIN</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Decision Support</p>
                  </div>
                  <button
                    onClick={() => setShowAuthorityModal(true)}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>Login as Authority</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option 2: CITIZEN */}
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-emerald-500 shadow-xs transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        PUBLIC ACCESS
                      </span>
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm">CITIZEN</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Safety &amp; Evacuation</p>
                  </div>
                  <button
                    onClick={() => setShowCitizenModal(true)}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>Continue as Citizen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => scrollToSection('problem')}
                  className="text-slate-500 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore how PRAVAH AI works</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Interactive Dashboard / Map Representation */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden p-4 group">
                
                {/* Preview Window Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[11px] font-mono font-bold text-slate-700 ml-2">
                      PRAVAH GIS • {selectedLocation.split(',')[0]}
                    </span>
                  </div>
                  
                  {/* Scenario Toggle in Preview */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setPreviewScenario('BASE')}
                      className={`px-2 py-0.5 rounded ${previewScenario === 'BASE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
                    >
                      Base
                    </button>
                    <button
                      onClick={() => setPreviewScenario('RAIN')}
                      className={`px-2 py-0.5 rounded ${previewScenario === 'RAIN' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
                    >
                      +Rain
                    </button>
                    <button
                      onClick={() => setPreviewScenario('SURGE')}
                      className={`px-2 py-0.5 rounded ${previewScenario === 'SURGE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
                    >
                      +Surge
                    </button>
                  </div>
                </div>

                {/* Stylized Miniature Geospatial Map Canvas */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-800">
                  {/* Background GIS Grid */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Coastline Simulation Curve */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
                    <path
                      d="M -20,280 Q 120,230 200,160 T 420,50 L 420,320 L -20,320 Z"
                      fill="#0f172a"
                      opacity="0.8"
                    />
                    <path
                      d="M -20,280 Q 120,230 200,160 T 420,50"
                      stroke="#0284c7"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                    />

                    {/* Flood Risk Polygon (changes with scenario) */}
                    <polygon
                      points={previewScenario === 'SURGE' ? "100,190 260,110 320,170 190,260" : previewScenario === 'RAIN' ? "130,170 290,130 270,220 120,240" : "160,180 260,130 240,210 140,230"}
                      fill="rgba(56, 189, 248, 0.28)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />

                    {/* Cyclone Track Vector */}
                    <path
                      d="M 360,20 Q 270,90 210,170 T 90,270"
                      stroke="#ef4444"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Landfall point */}
                    <circle cx="210" cy="170" r="6" fill="#ef4444" />
                    <circle cx="210" cy="170" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                  </svg>

                  {/* Wind Radius Circle */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/50 bg-amber-500/10 pointer-events-none transition-all duration-500 ${
                    previewScenario === 'SURGE' ? 'w-48 h-48' : previewScenario === 'RAIN' ? 'w-56 h-56' : 'w-44 h-44'
                  }`}></div>

                  {/* Map Asset Overlay Badges */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-xl p-2 text-[10px] text-white space-y-1 shadow-md">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>LANDFALL: {currentLocationConfig.baseLandfallWindow}</span>
                    </div>
                    <div className="text-slate-300 font-mono">
                      WIND: <strong className="text-amber-400">{currentLocationConfig.baseWindKm} km/h</strong>
                    </div>
                    <div className="text-slate-300 font-mono">
                      RAIN: <strong className="text-sky-400">{currentLocationConfig.baseRainfallMm} mm</strong>
                    </div>
                  </div>

                  {/* Interactive Asset Marker Pins on Mini-Map */}
                  <div className="absolute top-[28%] right-[24%] flex items-center gap-1 bg-rose-600/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-lg">
                    <Building2 className="w-3 h-3" />
                    <span>Hospital ICU (Risk 94)</span>
                  </div>

                  <div className="absolute bottom-[36%] left-[32%] flex items-center gap-1 bg-amber-600/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-lg">
                    <Zap className="w-3 h-3" />
                    <span>220kV Substation</span>
                  </div>

                  <div className="absolute bottom-[16%] right-[28%] flex items-center gap-1 bg-emerald-600/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-lg">
                    <Shield className="w-3 h-3" />
                    <span>Shelter #4 (Open)</span>
                  </div>

                  {/* Evacuation Route Arrow Indicator */}
                  <div className="absolute bottom-3 left-4 bg-slate-900/85 backdrop-blur-xs border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <Compass className="w-3 h-3" />
                    <span>Evac Bypass R-21: Clear</span>
                  </div>
                </div>

                {/* Bottom Impact Flow Indicator */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 font-mono">FLOW:</span>
                    <span className="text-blue-700 font-semibold">Forecast</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="text-purple-700 font-semibold">Risk Scored</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="text-emerald-700 font-semibold">Prioritized Action</span>
                  </div>
                  <button
                    onClick={() => setShowAuthorityModal(true)}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C: TRUST / CAPABILITY STRIP                                       */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 text-center font-bold mb-4">
            INTEGRATED PLATFORM ARCHITECTURE &amp; TELEMETRY
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <Database className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Google Earth Engine</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">DEM &amp; SAR Imagery</span>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-700">
                Connected / Demo
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <Wind className="w-4 h-4 text-sky-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">OpenWeather / IMD</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time &amp; Forecasts</span>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700">
                Live &amp; Ensemble
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <Cpu className="w-4 h-4 text-purple-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Gemini AI</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Reasoning &amp; Advisories</span>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-700">
                gemini-3.8-flash
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <Layers className="w-4 h-4 text-teal-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Geospatial GIS</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Vector Inundation</span>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-100 text-teal-700">
                Dynamic Layers
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center col-span-2 md:col-span-1">
              <Activity className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Risk Analytics</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Cascading Chains</span>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-700">
                Probabilistic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: ABOUT PRAVAH AI                                                */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              Platform Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              About PRAVAH AI
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              PRAVAH AI connects cyclone forecasts with the infrastructure and communities that may be affected by them. Instead of stopping at a hazard forecast, the platform analyzes exposure, asset vulnerability, infrastructure dependencies, time-to-impact and possible cascading disruptions to help decision-makers prepare and coordinate earlier.
            </p>
          </div>

          {/* Three Pillar Cards: UNDERSTAND - PRIORITIZE - ACT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="text-3xl font-black text-blue-600/30 group-hover:text-blue-600 font-mono mb-4 transition-colors">
                01
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                UNDERSTAND
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Understand where hazards may affect communities and critical infrastructure across multiple interconnected dimensions—storm surge height, heavy precipitation isohyets, and maximum sustained wind swaths.
              </p>
              <div className="pt-3 border-t border-slate-200/80 text-xs font-semibold text-blue-700 flex items-center gap-1">
                <span>Multi-hazard spatial synthesis</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="text-3xl font-black text-purple-600/30 group-hover:text-purple-600 font-mono mb-4 transition-colors">
                02
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                PRIORITIZE
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Identify assets, roads and services that require attention before landfall. Calculate normalized vulnerability scores (0–100) taking into account elevation, flood depth, structural age, and backup autonomy.
              </p>
              <div className="pt-3 border-t border-slate-200/80 text-xs font-semibold text-purple-700 flex items-center gap-1">
                <span>Asset exposure scoring</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group">
              <div className="text-3xl font-black text-emerald-600/30 group-hover:text-emerald-600 font-mono mb-4 transition-colors">
                03
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                ACT
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Recommend actionable evacuation, shelter, and resource deployment decisions. Generate structured, department-specific directives and direct citizens away from inundated corridors.
              </p>
              <div className="pt-3 border-t border-slate-200/80 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span>Life-safety operational dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E: THE PROBLEM / FORECAST VS IMPACT GAP                           */}
      {/* ========================================================================= */}
      <section id="problem" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              The Critical Preparedness Gap
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Forecasts Predict the Storm. PRAVAH AI Predicts the Consequences.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Standard cyclone tracking produces track cones and rainfall totals. But during an escalating emergency, incident commanders don't just need to know wind speeds—they need to know which assets will fail and what dependencies will collapse.
            </p>
          </div>

          {/* Side-by-Side Contrast Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Box 1: Traditional Weather Warnings */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-xs relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Traditional Cyclone Warnings
                </h3>
              </div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider font-mono mb-4">
                Meteorological Envelope Only
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                  <span><strong>Generic Warnings:</strong> Advises "heavy rainfall &amp; squalls" across entire 30,000 sq km coastal regions without asset specificity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                  <span><strong>Blind to Power Feeder Failures:</strong> Fails to alert that Substation 132kV will flood 6 hours before eye landfall.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                  <span><strong>Blind to Evacuation Cut-Offs:</strong> Shortest route GPS sends evacuees directly over bridges with projected 1.8m overtopping.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                  <span><strong>Siloed Sector Reaction:</strong> Health, Power, and PWD learn of each other's crises only after blackouts and cutoffs occur.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: PRAVAH AI Intelligence */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-500 shadow-md relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                OPERATIONAL ADVANTAGE
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  PRAVAH AI Infrastructure Intelligence
                </h3>
              </div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono mb-4">
                Coupled Hazard + Asset Vulnerability + Action
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Asset-Level Risk Scoring:</strong> Evaluates specific GPS coordinates for 40+ critical hospitals, substations, and bridges.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Cascading Chain Modeling:</strong> Traces: Substation surge flood &rarr; ICU power trips &rarr; Oxygen generator stops &rarr; Water pump stops.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Hydrodynamic Evacuation Routing:</strong> Dynamically avoids coastal SH-12 and routes convoys via elevated arterial Bypass R-21.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>AI Sector Directive Generation:</strong> Creates pre-calibrated Gemini 3.8 Flash operational directives for DM, Health, and Power.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION F: CORE CAPABILITIES                                              */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              End-to-End Decision Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Core Platform Capabilities
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Engineered specifically for coastal emergency authorities, district disaster management cells, and affected citizen communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Multi-Hazard Geospatial Modeling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dynamic visualization of storm surge inundation zones, extreme rainfall isohyets (&gt;250mm), gale wind radii, and digital elevation model (DEM) terrain cross-sections.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Critical Infrastructure Exposure
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Active vulnerability monitoring for hospitals, 220kV/132kV electrical substations, telecom masts, water treatment works, and cyclone multi-purpose shelters.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Cascading Failure Chain Prediction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Algorithmic simulation of secondary &amp; tertiary failure dependencies: grid tripping &rarr; backup generator fuel exhaustion &rarr; hospital oxygen failure &rarr; water network halt.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Safe Evacuation Corridor Routing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Inundation-aware navigation calculating road passability, bridge overtopping depth, and traffic flow capacity to route buses and citizens to the safest open shelters.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Multi-Sector Functional Filters
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                One-click instant filtering for Disaster Management, Health, Power, Roads, and Municipal bodies—highlighting only relevant assets, metrics, and tactical insights.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Dual Authority &amp; Citizen Portals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated Command EOC workspace for district officers alongside an accessible, clean Public Safety portal for citizens with verified shelters, audio advice, and SOS alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION G: HOW IT WORKS / WORKFLOW                                        */}
      {/* ========================================================================= */}
      <section id="workflow" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              Sequential Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              How PRAVAH AI Works
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              From raw forecast ingestion to targeted tactical actions in four automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
                  01
                </span>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  Forecast Ingestion &amp; Simulation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ingests IMD ensemble tracks, wind field velocities, precipitation forecasts, and blends them with GEE digital elevation and coastal bathymetry layers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-blue-600 font-semibold">
                Input: Weather + Elevation
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
                  02
                </span>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  Asset Exposure Scoring
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cross-references 40+ geo-tagged critical infrastructure assets against projected inundation polygons and wind gust buffers to calculate individual vulnerability indices.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-blue-600 font-semibold">
                Output: 0–100 Risk Scores
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
                  03
                </span>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  Cascading Chain Analysis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simulates multi-tier dependency propagation. Models how utility outages cause downstream health hazards, telecom blindspots, and evacuation blockage.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-purple-600 font-semibold">
                Engine: Dependency Graph
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
                  04
                </span>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  Operational Action Dispatch
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates prioritized sector bulletins (Health, Power, PWD), dispatches safe evacuation route waypoints, and updates citizen shelter occupancy metrics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-600 font-semibold">
                Action: EOC Directives + Public Portal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION H: STAKEHOLDERS / WHO IT'S FOR                                     */}
      {/* ========================================================================= */}
      <section id="stakeholders" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              Inter-Agency Coordination
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Built for Every Stakeholder in Coastal Safety
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Disaster preparedness requires synchronized action across administration, utilities, emergency responders, and the public.
            </p>
          </div>

          {/* Interactive Stakeholder Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {stakeholders.map((s, idx) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.title}
                  onClick={() => setActiveStakeholderTab(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeStakeholderTab === idx
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.title.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stakeholder Card Detail */}
          {(() => {
            const current = stakeholders[activeStakeholderTab];
            const Icon = current.icon;
            return (
              <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {current.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Target Users: {current.role}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                    Dedicated Workspace
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed">
                  {current.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {current.benefits.map((b, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-xs">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION I: TECHNOLOGY & ARCHITECTURE HIGHLIGHT                            */}
      {/* ========================================================================= */}
      <section id="technology" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              Engineered for Real-World Resilience
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Technical Architecture &amp; Stack
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Built on battle-tested open geospatial and cloud technologies designed to function smoothly even over degraded mobile data connections in coastal conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Google Earth Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sentinel-1 SAR synthetic aperture radar flood extent overlays and high-resolution SRTM digital elevation models for coastal topography.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Meteorological Pipeline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                OpenWeather OneCall API paired with Indian Meteorological Department (IMD) cyclone bulletins and ECMWF ensemble track models.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Gemini AI Decision Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini 3.8 Flash for structured multi-lingual public advisories (English, Hindi, Telugu, Odia) and multi-agency operational dispatch bulletins.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Leaflet GIS Vector Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hardware-accelerated vector rendering of dynamic isohyets, wind envelopes, animated cyclone track cones, and custom SVG asset markers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION J: INTERACTIVE EXPLORER & DEMO LOGIN CARDS                       */}
      {/* ========================================================================= */}
      <section id="portals" className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              Role-Separated Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Enter PRAVAH AI
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Select your role below to launch the prototype. No password is required for this operational demonstration.
            </p>
          </div>

          {/* Location Selector Card */}
          <div className="max-w-md mx-auto mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              Target Coastal District:
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer hover:bg-slate-100"
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 2 Large Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: Authority / Admin */}
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    RESTRICTED COMMAND CENTER
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    SECURE EOC
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Disaster Management Authority
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      State &amp; District Emergency Operations Centre (EOC) Command
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Full-spectrum operational suite for District Magistrates, Sector Engineers, and emergency response heads. Model cascading infrastructure failures before landfall occurs.
                </p>

                {/* Capability Checklist */}
                <div className="space-y-2.5 mb-6 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Geospatial Hazard Mapping:</strong> Interactive cyclone track, flood isohyets, storm surge envelopes &amp; GEE terrain.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Infrastructure Vulnerability Scoring:</strong> Real-time risk prioritization across hospitals, substations, roads &amp; bridges.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Cascading Damage Chains:</strong> Model secondary failures (e.g. road wash cut &rarr; ambulance blockage &rarr; ICU crisis).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Automated AI Advisories:</strong> Draft and dispatch operational directives for Health, Power, and PWD heads.</span>
                  </div>
                </div>

                {/* Officer Profile Selection */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2 font-mono">
                    Select Authority Profile:
                  </span>
                  <div className="space-y-1.5">
                    {demoOfficers.map((off) => (
                      <button
                        key={off.name}
                        onClick={() => handleOfficerSelect(off)}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                          selectedOfficer === off.name
                            ? 'bg-white text-blue-900 border border-blue-300 shadow-xs font-bold'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{off.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{off.designation}</div>
                        </div>
                        {selectedOfficer === off.name && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAuthorityModal(true)}
                className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:bg-blue-600"
              >
                <span>LOGIN AS AUTHORITY / ADMIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Citizen / Public User */}
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    OPEN PUBLIC ACCESS
                  </span>
                  <span className="text-xs font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    PUBLIC SAFETY
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Citizen / Public User
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Public Safety, Verified Shelters &amp; Evacuation Navigation
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Simple, life-saving public dashboard for residents and families in cyclone warning zones. Verified evacuation routes, verified shelter availability, and 24x7 emergency contacts.
                </p>

                {/* Capability Checklist */}
                <div className="space-y-2.5 mb-6 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Live Cyclone Landfall Countdown:</strong> Real-time distance, expected wind speed, and estimated time to impact.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Nearest Verified Cyclone Shelter:</strong> Real-time capacity, occupancy, backup power &amp; drinking water availability.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Safe Evacuation Route Guidance:</strong> Identifies submerged or blocked roads and provides clear alternate paths.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Multi-lingual Audio &amp; Offline Advice:</strong> English, Hindi, Telugu, and Odia emergency safety advisories.</span>
                  </div>
                </div>

                {/* Public Safety Highlight Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-6">
                  <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold mb-1.5">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    Emergency Helpline Numbers (Always Accessible)
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-xs">
                      <span className="text-[10px] text-slate-400 block">State EOC</span>
                      <strong className="text-emerald-800 text-sm">1070</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-xs">
                      <span className="text-[10px] text-slate-400 block">National</span>
                      <strong className="text-emerald-800 text-sm">112</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-xs">
                      <span className="text-[10px] text-slate-400 block">Ambulance</span>
                      <strong className="text-emerald-800 text-sm">108</strong>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCitizenModal(true)}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>LOGIN AS CITIZEN / PUBLIC USER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION K: CALL TO ACTION BANNER                                          */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            OPERATIONAL DEMONSTRATION READY
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to Transform Coastal Disaster Preparedness?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience how predictive infrastructure intelligence bridges the gap between meteorological warnings and real-time life-saving decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAuthorityModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Enter Authority Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCitizenModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Open Citizen Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION L: PROFESSIONAL FOOTER                                            */}
      {/* ========================================================================= */}
      <footer className="py-12 px-4 sm:px-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Wind className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">PRAVAH AI</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI-Powered Cyclone Impact &amp; Infrastructure Intelligence.
              </p>
              <p className="text-[11px] font-mono font-bold text-blue-700">
                Predict. Prepare. Protect.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider block">
                Platform
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-blue-600 cursor-pointer">About PRAVAH AI</button></li>
                <li><button onClick={() => scrollToSection('problem')} className="hover:text-blue-600 cursor-pointer">The Impact Gap</button></li>
                <li><button onClick={() => scrollToSection('capabilities')} className="hover:text-blue-600 cursor-pointer">Core Capabilities</button></li>
                <li><button onClick={() => scrollToSection('workflow')} className="hover:text-blue-600 cursor-pointer">Sequential Workflow</button></li>
                <li><button onClick={() => scrollToSection('technology')} className="hover:text-blue-600 cursor-pointer">Technology Stack</button></li>
              </ul>
            </div>

            {/* Col 3: Portals & Roles */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider block">
                Access Portals
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>
                  <button onClick={() => setShowAuthorityModal(true)} className="hover:text-blue-600 font-semibold cursor-pointer">
                    Disaster Authority EOC Command &rarr;
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowCitizenModal(true)} className="hover:text-emerald-700 font-semibold cursor-pointer">
                    Citizen Public Safety Portal &rarr;
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Bay of Bengal Coastal Protocol</span>
                </li>
                <li>
                  <span className="text-slate-400">Multi-District Pilot (AP &amp; Odisha)</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Emergency Contacts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider block">
                National Helpline Reference
              </span>
              <div className="space-y-1 text-xs font-mono text-slate-700">
                <div>State Disaster EOC: <strong>1070</strong></div>
                <div>National Disaster Hotline: <strong>112</strong></div>
                <div>Ambulance &amp; Trauma: <strong>108</strong></div>
                <div>Disaster Management (NDRF): <strong>1078</strong></div>
              </div>
            </div>
          </div>

          {/* Operational Transparency & Ethics Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold mb-1">
              <Shield className="w-4 h-4 text-blue-600" />
              Operational Decision-Support Prototype Transparency Protocol
            </div>
            <p className="text-[11px] leading-relaxed max-w-4xl mx-auto">
              PRAVAH AI is an operational decision-support prototype integrating simulated meteorological models (IMD / ECMWF Ensembles), digital elevation models, and infrastructure network dependencies. Field dispatches and evacuation orders require authorization by designated state disaster management authorities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              &copy; 2026 PRAVAH AI • All Rights Reserved • Connected Demo Platform
            </div>
            <div className="font-mono text-blue-600 font-bold">
              PREDICT • PREPARE • PROTECT
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 2. AUTHORITY LOGIN MODAL (Section 2)                                      */}
      {/* ========================================================================= */}
      {showAuthorityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Authority Login</h3>
                  <p className="text-[11px] text-slate-500">Decision Support &bull; EOC Command</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
                DEMO ENVIRONMENT
              </span>
            </div>

            {/* Demo Credentials Box */}
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 mb-5 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-900 font-mono text-[11px]">Optional Demo Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOfficerId('admin');
                    setOfficerPassword('demo123');
                  }}
                  className="text-[10px] text-blue-700 hover:underline font-bold cursor-pointer"
                >
                  Use Demo Credentials
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
                <div>Officer ID: <strong className="text-slate-900">admin</strong></div>
                <div>Password: <strong className="text-slate-900">demo123</strong></div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAuthoritySignIn} className="space-y-4 text-xs">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Officer ID:</label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  placeholder="demo123"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Profile Designation */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Command Officer Profile:</label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => {
                    const off = demoOfficers.find(o => o.name === e.target.value);
                    if (off) handleOfficerSelect(off);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  {demoOfficers.map((o) => (
                    <option key={o.name} value={o.name}>
                      {o.name} — {o.designation.split('(')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coastal District */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Coastal District:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuthorityModal(false)}
                  className="w-full py-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  &larr; Back to PRAVAH AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CITIZEN LOGIN MODAL (Section 3)                                        */}
      {/* ========================================================================= */}
      {showCitizenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Citizen Safety Portal</h3>
                  <p className="text-[11px] text-slate-500">Public Evacuation &amp; Verified Shelters</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                PUBLIC ACCESS
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Access real-time cyclone landfall timers, nearest verified cyclone shelters with food and power, and flood-safe evacuation routes for your family.
            </p>

            {/* Citizen Form */}
            <form onSubmit={handleCitizenContinue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Name / Demo ID:</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Citizen User"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Location / Coastal District:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCitizenModal(false)}
                  className="w-full py-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  &larr; Back to PRAVAH AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
