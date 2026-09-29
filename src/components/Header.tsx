import React, { useState } from 'react';
import { 
  Wind, 
  ChevronDown, 
  MapPin, 
  Shield, 
  User, 
  SlidersHorizontal, 
  LogOut,
  Layers,
  HeartPulse,
  Zap,
  Truck,
  Building,
  CheckCircle2,
  Building2,
  Clock,
  Waves
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
  surgeText = 'HIGH',
  landfallText = '18 hours',
}) => {
  const departments: { key: DepartmentType; label: string }[] = [
    { key: 'ALL', label: 'All Sectors' },
    { key: 'DISASTER MANAGEMENT', label: 'Disaster Management' },
    { key: 'HEALTH', label: 'Health' },
    { key: 'POWER', label: 'Power' },
    { key: 'ROADS', label: 'Roads' },
    { key: 'MUNICIPAL', label: 'Municipal' },
  ];

  return (
    <header className="sticky top-0 z-40 pravah-header-surface shadow-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Section: Logo + Location + Scenario + Department + Statuses */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 shrink-0">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-[#102A43] tracking-tight">
                  PRAVAH AI
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-[#DCEAF3]">
                  {userRole === 'ADMIN' ? 'EOC COMMAND' : 'CITIZEN'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#DCEAF3] hidden sm:block"></div>

          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] rounded-xl px-2.5 py-1 text-[#102A43] hover:border-blue-400 hover:bg-white transition-all shadow-2xs">
            <div className="w-5 h-5 rounded-lg bg-blue-100/70 flex items-center justify-center shrink-0">
              <MapPin className="w-3 h-3 text-blue-600" />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#102A43] focus:outline-none cursor-pointer pr-1"
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] rounded-xl px-2.5 py-1 text-[#102A43] hover:border-blue-400 hover:bg-white transition-all shadow-2xs">
            <div className="w-5 h-5 rounded-lg bg-amber-100/70 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-[10px] uppercase font-mono text-[#607D94] font-semibold hidden md:inline">Scenario:</span>
            <select
              value={currentScenarioKey}
              onChange={(e) => onScenarioChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#102A43] focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              {Object.entries(SCENARIO_CONFIGS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter (Compact Dropdown per Section 15) */}
          {userRole === 'ADMIN' && (
            <div className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] rounded-xl px-2.5 py-1 text-[#102A43] hover:border-blue-400 hover:bg-white transition-all shadow-2xs">
              <div className="w-5 h-5 rounded-lg bg-cyan-100/70 flex items-center justify-center shrink-0">
                <Layers className="w-3 h-3 text-[#16B8C4]" />
              </div>
              <span className="text-[10px] uppercase font-mono text-[#607D94] font-semibold hidden lg:inline">Sector:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value as DepartmentType)}
                className="bg-transparent text-xs font-semibold text-[#102A43] focus:outline-none cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept.key} value={dept.key}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Telemetry Status Strip with understated colored dots */}
          <div className="hidden 2xl:flex items-center gap-2 text-[11px] font-mono text-[#607D94] pl-1">
            <span className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#18A66A]"></span>
              Weather Connected
            </span>
            <span className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#16B8C4]"></span>
              GEE Connected
            </span>
            <span className="flex items-center gap-1.5 bg-[#F0F6FB] border border-[#DCEAF3] px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
              Gemini Active
            </span>
          </div>
        </div>

        {/* Right Section: Meteorological Metrics + Profile + Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Meteorological Metrics Pill */}
          <div className="hidden md:flex items-center gap-2 bg-[#F0F6FB] border border-[#DCEAF3] rounded-xl px-3 py-1 font-mono text-xs text-[#102A43] shadow-2xs">
            <span className="font-bold text-[#102A43] flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              T−{landfallText.replace('hours', '').replace('Hours', '').trim()}H
            </span>
            <span className="text-[#DCEAF3]">|</span>
            <span>
              Wind: <strong className="text-amber-700">{windSpeedText}</strong>
            </span>
            <span className="text-[#DCEAF3]">|</span>
            <span>
              Surge: <strong className="text-rose-600">{surgeText.includes('m') ? surgeText : 'HIGH'}</strong>
            </span>
          </div>

          {/* Profile Badge */}
          <div className="flex items-center gap-2 bg-[#F0F6FB] border border-[#DCEAF3] rounded-xl px-2.5 py-1 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-[#102A43] leading-tight">
                {userRole === 'ADMIN' ? officerName : 'Citizen'}
              </div>
              <div className="text-[9px] font-mono text-[#607D94] leading-tight hidden sm:block">
                {userRole === 'ADMIN' ? 'Authority Profile' : 'Public Safety'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Log out and return to PRAVAH AI landing page"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCEAF3] bg-white hover:bg-rose-50 hover:border-rose-200 text-[#102A43] hover:text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-[#607D94] hover:text-rose-600" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
};
