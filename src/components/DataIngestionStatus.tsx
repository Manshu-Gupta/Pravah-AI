import React from 'react';
import { Database, CloudRain, Satellite, Cpu, Radio, ShieldAlert } from 'lucide-react';

export const DataIngestionStatus: React.FC = () => {
  const sources = [
    {
      name: 'Weather Forecast',
      type: 'IMD / ECMWF Ensemble (Simulated)',
      status: 'Connected / Demo',
      color: 'bg-emerald-500',
      icon: CloudRain,
      latency: '24ms',
    },
    {
      name: 'Google Earth Engine',
      type: 'Surface Water & DEM 10m (Demo Integration)',
      status: 'Demo Pipeline',
      color: 'bg-emerald-500',
      icon: Radio,
      latency: '110ms',
    },
    {
      name: 'Satellite Data',
      type: 'INSAT-3D Multispectral & SAR (Demo)',
      status: 'Active Feed',
      color: 'bg-emerald-500',
      icon: Satellite,
      latency: '85ms',
    },
    {
      name: 'Infrastructure Database',
      type: 'OSM + State Lifeline Registry (32 Assets)',
      status: 'Pre-loaded',
      color: 'bg-blue-500',
      icon: Database,
      latency: '12ms',
    },
    {
      name: 'Gemini AI Advisory Engine',
      type: '@google/genai (gemini-3.8-flash)',
      status: 'Operational',
      color: 'bg-blue-600',
      icon: Cpu,
      latency: 'Server Hooked',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Multi-Source Ingestion Telemetry
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                ALL FEEDS SYNCED
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Last Ingestion Cycle: <span className="font-mono text-slate-700 font-semibold">28 Sep 2026, 21:45 IST</span> (Cycle: VARUN-T08)
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[11px] font-mono text-slate-500">
            Next Forecast Update: <span className="text-slate-800 font-semibold">22:00 IST (15m)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.name}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 font-medium">
                  <span className={`w-2 h-2 rounded-full ${src.color}`}></span>
                  {src.latency}
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {src.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate" title={src.type}>
                  {src.type}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">
                  ✓ {src.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
