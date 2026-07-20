import React, { useState, useEffect } from "react";

export default function GlassGridSection() {
  const [cpuLoad, setCpuLoad] = useState(38);
  const [latency, setLatency] = useState(124);

  // Simulate real-time monitoring changes for organic micro-animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        const next = prev + change;
        return Math.max(10, Math.min(90, next));
      });
      setLatency((prev) => {
        const change = Math.floor(Math.random() * 11) - 5;
        const next = prev + change;
        return Math.max(80, Math.min(250, next));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full">
      {/* Grid of Glass Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-full">
        
        {/* Card 1: CPU & System Latency */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5 dark:border-white/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
          {/* Subtle Glowing Radial Background */}
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">System Performance</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium">CPU Utilization</span>
                <span className="font-semibold text-gray-800 dark:text-white">{cpuLoad}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${cpuLoad}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{latency}ms</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Network Latency</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-500">Healthy</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">API Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Transactions & Success Rates */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5 dark:border-white/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
          {/* Subtle Glowing Radial Background */}
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Operational Health</span>
            <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">Live telemetry</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">99.98%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate (24h)</p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/30 dark:border-gray-800/30">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">4,281</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Active Requests</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">12ms</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Db Response Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Active Operators & Staff Sessions */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5 dark:border-white/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group sm:col-span-2 lg:col-span-1">
          {/* Subtle Glowing Radial Background */}
          <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Operator Directory</span>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">4 Online</span>
          </div>

          <div className="space-y-4">
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar 1"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar 2"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar 3"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar 4"
              />
            </div>

            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Session Sync</span>
              <span className="font-semibold text-green-500">Live Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
