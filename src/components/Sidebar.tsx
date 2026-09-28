import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  GitFork, 
  Clock, 
  Sparkles, 
  SlidersHorizontal, 
  History,
  Shield,
  HelpCircle,
  Compass,
  FileText,
  Settings,
  HelpCircle as GuideIcon,
  LogOut,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export type NavigationTab = 
  | 'overview' 
  | 'hazard-map' 
  | 'infrastructure' 
  | 'damage-chain' 
  | 'action-plan' 
  | 'evacuation-routes' 
  | 'shelters' 
  | 'what-if' 
  | 'advisories' 
  | 'reports';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenAssetDetailById?: (id: string) => void;
  userRole: UserRole;
  officerName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  officerName,
}) => {
  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'hazard-map' as NavigationTab,
      label: 'Hazard Map',
      icon: Map,
      badge: 'GIS',
    },
    {
      id: 'infrastructure' as NavigationTab,
      label: 'Infrastructure',
      icon: Building2,
      badge: '32',
    },
    {
      id: 'damage-chain' as NavigationTab,
      label: 'Damage Chain',
      icon: GitFork,
      badge: 'Key',
    },
    {
      id: 'action-plan' as NavigationTab,
      label: 'Action Plan',
      icon: Clock,
      badge: 'T-18h',
    },
    {
      id: 'evacuation-routes' as NavigationTab,
      label: 'Evacuation Routes',
      icon: Compass,
      badge: 'R17/R21',
    },
    {
      id: 'shelters' as NavigationTab,
      label: 'Shelters',
      icon: Building2,
      badge: '8 Sites',
    },
    {
      id: 'what-if' as NavigationTab,
      label: 'What-if Simulator',
      icon: SlidersHorizontal,
      badge: 'Stress',
    },
    {
      id: 'advisories' as NavigationTab,
      label: 'AI Advisories',
      icon: Sparkles,
      badge: 'Gemini',
    },
    {
      id: 'reports' as NavigationTab,
      label: 'Reports',
      icon: FileText,
      badge: 'Export',
    },
  ];

  return (
    <aside className="w-full md:w-60 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
      {/* Navigation list */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Menu Section */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold border ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Support
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onTabChange('reports')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <GuideIcon className="w-4 h-4 text-slate-400" />
              <span>Operational Guide</span>
            </button>
            <button
              onClick={() => onTabChange('reports')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Command Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom (Like reference UI) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
            {officerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {officerName}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {userRole === 'ADMIN' ? 'Authority Officer' : 'Public Resident'}
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>ROLE: {userRole}</span>
          <span className="text-emerald-600 font-bold">AUTHENTICATED</span>
        </div>
      </div>
    </aside>
  );
};
