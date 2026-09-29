import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Clock, 
  Compass, 
  GitFork, 
  Sparkles, 
  SlidersHorizontal, 
  FileText, 
  Settings, 
  LogOut,
  X,
  Sliders,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

export type NavigationTab = 
  | 'overview' 
  | 'hazard-map' 
  | 'infrastructure' 
  | 'action-plan' 
  | 'evacuation-routes' 
  | 'shelters' 
  | 'damage-chain' 
  | 'advisories' 
  | 'what-if' 
  | 'reports';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenAssetDetailById?: (id: string) => void;
  userRole: UserRole;
  officerName: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  officerName,
  onLogout,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const sections = [
    {
      group: 'MAIN',
      items: [
        { id: 'overview' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'hazard-map' as NavigationTab, label: 'Hazard Map', icon: Map },
        { id: 'infrastructure' as NavigationTab, label: 'Infrastructure', icon: Building2 },
      ]
    },
    {
      group: 'RESPONSE',
      items: [
        { id: 'action-plan' as NavigationTab, label: 'Action Plan', icon: Clock },
        { id: 'evacuation-routes' as NavigationTab, label: 'Evacuation Routes', icon: Compass },
        { id: 'shelters' as NavigationTab, label: 'Shelters', icon: Building2 },
      ]
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'damage-chain' as NavigationTab, label: 'Damage Chain', icon: GitFork },
        { id: 'advisories' as NavigationTab, label: 'AI Advisories', icon: Sparkles },
      ]
    },
    {
      group: 'ANALYSIS',
      items: [
        { id: 'what-if' as NavigationTab, label: 'What-If', icon: SlidersHorizontal },
        { id: 'reports' as NavigationTab, label: 'Reports', icon: FileText },
      ]
    },
  ];

  const getIconTint = (id: NavigationTab, isActive: boolean) => {
    switch (id) {
      case 'overview':
        return isActive ? 'bg-blue-100 text-[#1677FF] shadow-xs' : 'bg-blue-50/80 text-blue-600';
      case 'hazard-map':
        return isActive ? 'bg-rose-100 text-rose-600 shadow-xs' : 'bg-rose-50/80 text-rose-600';
      case 'infrastructure':
        return isActive ? 'bg-sky-100 text-sky-600 shadow-xs' : 'bg-sky-50/80 text-sky-600';
      case 'action-plan':
        return isActive ? 'bg-amber-100 text-amber-600 shadow-xs' : 'bg-amber-50/80 text-amber-600';
      case 'evacuation-routes':
        return isActive ? 'bg-emerald-100 text-[#18A66A] shadow-xs' : 'bg-emerald-50/80 text-emerald-600';
      case 'shelters':
        return isActive ? 'bg-teal-100 text-teal-600 shadow-xs' : 'bg-teal-50/80 text-teal-600';
      case 'damage-chain':
        return isActive ? 'bg-purple-100 text-purple-600 shadow-xs' : 'bg-purple-50/80 text-purple-600';
      case 'advisories':
        return isActive ? 'bg-violet-100 text-[#7C3AED] shadow-xs' : 'bg-violet-50/80 text-violet-600';
      case 'what-if':
        return isActive ? 'bg-indigo-100 text-indigo-600 shadow-xs' : 'bg-indigo-50/80 text-indigo-600';
      case 'reports':
        return isActive ? 'bg-slate-200 text-slate-800 shadow-xs' : 'bg-slate-100 text-slate-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <>
      <aside className="w-full md:w-56 pravah-sidebar-surface flex flex-col shrink-0 select-none">
        <div className="p-3 space-y-4 flex-1 overflow-y-auto">
          {sections.map((sec) => (
            <div key={sec.group}>
              <div className="text-[10px] font-mono font-bold text-[#607D94] uppercase tracking-wider px-2.5 mb-1.5">
                {sec.group}
              </div>

              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const tintClass = getIconTint(item.id, isActive);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      style={isActive ? {
                        background: 'linear-gradient(90deg, #E5F3FF 0%, #F2FAFD 100%)',
                        borderLeft: '3px solid #1677FF',
                      } : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'text-[#1677FF] font-bold shadow-2xs'
                          : 'text-[#102A43] hover:text-[#1677FF] hover:bg-white/80 font-medium'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${tintClass} ${isActive ? 'scale-105 ring-2 ring-blue-400/20' : ''}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* SYSTEM section */}
          <div>
            <div className="text-[10px] font-mono font-bold text-[#607D94] uppercase tracking-wider px-2.5 mb-1.5">
              SYSTEM
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-[#102A43] hover:text-blue-600 hover:bg-white/80 font-medium transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span>Settings</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Officer Status Badge */}
        <div className="p-3 border-t border-[#DCEAF3] bg-white/40 text-[11px]">
          <div className="font-bold text-[#102A43] truncate">{officerName}</div>
          <div className="text-[10px] text-[#607D94] font-mono">Disaster Authority EOC</div>
        </div>
      </aside>

      {/* Settings Modal Dialog */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Preferences</h3>
                <p className="text-[11px] text-slate-500">PRAVAH AI Command Console</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="font-bold text-slate-900">Telemetry Refresh</div>
                <div className="text-slate-500 text-[11px]">Ensemble weather simulation runs every 5 minutes automatically.</div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  Real-time synchronization active
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">GIS Engine</div>
                <div className="text-slate-500 text-[11px]">Leaflet vector pipeline with dynamic hazard isohyets.</div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
