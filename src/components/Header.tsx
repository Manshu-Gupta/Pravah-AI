import React, { useState } from 'react';
import { 
  Wind, 
  Bell, 
  ChevronDown, 
  MapPin, 
  Shield,
  ShieldAlert, 
  User, 
  ExternalLink,
  Flame,
  Radio,
  Clock,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
  LogOut,
  Home,
  SlidersHorizontal,
  Layers,
  HeartPulse,
  Zap,
  Truck,
  Building
} from 'lucide-react';
import { UserRole, DepartmentType } from '../types';
import { SCENARIO_CONFIGS, LOCATION_OPTIONS } from '../data/locationDatasets';

interface HeaderProps {
  currentScenarioKey: string;
  onScenarioChange: (key: string) => void;
  selectedDepartment: DepartmentType;
  onDepartmentChange: (dept: DepartmentType) => void;
  userRole: UserRole;
  officerName: string;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onLogout: () => void;
  windSpeedText?: string;
  surgeText?: string;
  landfallText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenarioKey,
  onScenarioChange,
  selectedDepartment,
  onDepartmentChange,
  userRole,
  officerName,
  selectedLocation,
  onLocationChange,
  onLogout,
  windSpeedText = '120 km/h',
  surgeText = '2.8m',
  landfallText = '18 hrs',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: 'Road R17 Inundation Warning',
      time: '14m ago',
      desc: 'Projected flood depth 1.2m. 53% local population dependent. Alternate corridor R21 engaged.',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Substation P-03 Sump Pump Activated',
      time: '32m ago',
      desc: 'Basement water sensor 2 tripped. Secondary feed secured for District Hospital H-07.',
      priority: 'critical',
    },
    {
      id: 3,
      title: 'Shelter S-04 Provision Staging',
      time: '45m ago',
      desc: 'Emergency food packets and 500L diesel fuel reserves logged as verified by Block Development Officer.',
      priority: 'normal',
    },
  ]);

  const departments: { key: DepartmentType; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'ALL SECTORS', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'DISASTER MANAGEMENT', label: 'COMMAND & SHELTERS', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'HEALTH', label: 'HEALTH & HOSPITALS', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { key: 'POWER', label: 'POWER GRID', icon: <Zap className="w-3.5 h-3.5" /> },
    { key: 'ROADS', label: 'ROADS & EVACUATION', icon: <Truck className="w-3.5 h-3.5" /> },
    { key: 'MUNICIPAL', label: 'MUNICIPAL & DRAINAGE', icon: <Building className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top Meta Strip: Status, Metrics & Logout */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs">
        {/* Left: Location & Scenario Selector */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 hover:border-blue-400 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold hidden sm:inline">District:</span>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 hover:border-blue-400 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Scenario:</span>
            <select
              value={currentScenarioKey}
              onChange={(e) => onScenarioChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] sm:max-w-none truncate"
            >
              {Object.entries(SCENARIO_CONFIGS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200 uppercase hidden md:inline-block">
            {SCENARIO_CONFIGS[currentScenarioKey]?.badge || 'SIMULATED SCENARIO'}
          </span>
        </div>

        {/* Center: Live Meteorological Status Chips (Dynamically driven) */}
        <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Expected Landfall: <strong className="text-slate-900">{landfallText}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <Wind className="w-3.5 h-3.5 text-amber-600" />
            <span>Wind Speed: <strong className="text-slate-900">{windSpeedText}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Storm Surge Risk: <strong className="text-rose-600 font-bold">{surgeText}</strong></span>
          </div>
        </div>

        {/* Right: Data Source Indicators & User / Home Logout */}
        <div className="flex items-center gap-3">
          {/* Data Source Status */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5" title="IMD / ECMWF Simulated Ensemble">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Weather: <strong className="text-slate-700">LIVE</strong>
            </span>
            <span className="flex items-center gap-1.5" title="Google Earth Engine DEM & Flood Change">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              GEE: <strong className="text-slate-700">CONNECTED</strong>
            </span>
            <span className="flex items-center gap-1.5" title="Gemini 3.8 Flash Advisory Copilot">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Gemini AI: <strong className="text-slate-700">CONNECTED</strong>
            </span>
          </div>

          {/* Officer / Role Badge */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {userRole === 'ADMIN' ? <Shield className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {userRole === 'ADMIN' ? officerName : 'Citizen Safety Portal'}
              </div>
              <div className="text-[9px] font-mono text-slate-400 leading-tight">
                {userRole === 'ADMIN' ? 'Role: Disaster Authority' : 'Public Evacuation User'}
              </div>
            </div>
          </div>

          {/* Back to Home / Logout Button */}
          <button
            onClick={onLogout}
            title="Return to Landing Page & Role Selector"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
            <span className="hidden sm:inline">Logout / Home</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer relative"
              title="Situation Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Live Situation Bulletins
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="font-semibold text-slate-900">{n.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar: Brand & Functional Sector Filter Tabs */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                PRAVAH AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {userRole === 'ADMIN' ? 'DISASTER MANAGEMENT AUTHORITY' : 'PUBLIC SAFETY PORTAL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Predict. Prepare. Protect. — AI-Powered Cyclone Impact & Infrastructure Intelligence
            </p>
          </div>
        </div>

        {/* Sector Functional Filters (All, Disaster Management, Health, Power, Roads, Municipal) */}
        {userRole === 'ADMIN' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Sector:
            </span>
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept.key;
              return (
                <button
                  key={dept.key}
                  onClick={() => onDepartmentChange(dept.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 ring-1 ring-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  title={`Filter map, assets, and action items for ${dept.label}`}
                >
                  {dept.icon}
                  <span>{dept.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
