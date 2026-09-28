import React, { useState } from 'react';
import { 
  Wind, 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Building2, 
  Users, 
  X,
  Phone,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (officerName: string, role: string, userRole: UserRole) => void;
  currentOfficer: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentOfficer,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('s.patnaik@disastermgmt.odisha.gov.in');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [citizenOtp, setCitizenOtp] = useState('4821');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'ADMIN') {
        onLoginSuccess('Officer S. Patnaik', 'State Relief Commissioner (SRC)', 'ADMIN');
      } else {
        onLoginSuccess('Pooja Senapati', 'Citizen / Resident', 'CITIZEN');
      }
      onClose();
    }, 300);
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'ADMIN') {
        onLoginSuccess('Officer S. Patnaik', 'State Relief Commissioner (SRC)', 'ADMIN');
      } else {
        onLoginSuccess('Pooja Senapati (Kendrapara)', 'Citizen / Public User', 'CITIZEN');
      }
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-3">
            <Wind className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            PRAVAH AI
          </h2>
          <p className="text-xs font-mono text-blue-700 font-bold uppercase tracking-wider mt-0.5">
            Predict. Prepare. Protect.
          </p>
          <p className="text-xs text-slate-500 mt-1.5">
            AI-Powered Cyclone Impact & Infrastructure Intelligence
          </p>
        </div>

        {/* Role Selector Tabs (Two separate experiences) */}
        <div className="mb-6">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Select Portal Experience
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Authority Suite</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('CITIZEN')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'CITIZEN'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>
          </div>
        </div>

        {/* 1-Click Quick Demo Login */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-2.5 font-bold flex items-center justify-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            1-Click Instant Demo Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('ADMIN')}
              className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              Authority Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('CITIZEN')}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Public Citizen
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {selectedRole === 'ADMIN' ? 'Or Sign In with Official Govt ID' : 'Or Sign In with Mobile OTP'}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Formal Login Form */}
        <form onSubmit={handleStandardLogin} className="space-y-3.5">
          {selectedRole === 'ADMIN' ? (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  Official Email / Gov ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="officer@disastermgmt.gov.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  Citizen Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  Verification OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter 4-digit OTP"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>Enter {selectedRole === 'ADMIN' ? 'Authority Command Suite' : 'Citizen Safety Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>SECURE ODISHA DISASTER PROTOCOL</span>
          <span className="text-emerald-600 font-bold">256-BIT ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
};
