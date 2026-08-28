"use client";

import React from "react";
import { CheckCircle2, Send, Sparkles, DollarSign } from "lucide-react";

export function StaticHeroFallback() {
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center p-6 select-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-amber-500/20 blur-3xl rounded-full" />

      {/* Floating 3D-styled Stack */}
      <div className="relative w-full max-w-md">
        {/* Background Card */}
        <div className="absolute -top-6 -left-6 w-full p-6 rounded-2xl bg-[#061812]/80 border border-emerald-500/20 shadow-2xl transform -rotate-6 opacity-60 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400">INV-2026-001</span>
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">PAID</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">$4,500.00</div>
          <div className="text-xs text-slate-400">Nexus Dynamics</div>
        </div>

        {/* Foreground Card */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0a261c] to-[#040f0b] border border-emerald-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl transform rotate-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Aurora Capital</div>
                <div className="text-[10px] text-slate-400">INV-2026-002</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <Send className="w-3 h-3" /> Sent
            </span>
          </div>

          <div className="my-5">
            <div className="text-xs text-slate-400 mb-1">Invoice Total Due</div>
            <div className="text-3xl font-display font-extrabold text-white flex items-center gap-1">
              <span className="text-emerald-400">$</span>5,890.00
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Due in 10 days</span>
            <span className="text-emerald-400 font-medium">Instant Pay Enabled</span>
          </div>
        </div>

        {/* Floating Coin Accent */}
        <div className="absolute -bottom-6 -right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[2px] shadow-[0_10px_25px_rgba(245,158,11,0.4)] animate-float-slow">
          <div className="w-full h-full rounded-full bg-[#081a14] flex items-center justify-center text-amber-400 font-bold text-lg">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default StaticHeroFallback;
