"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, Receipt, FileText, UserPlus, Zap } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onUpgradeClick?: () => void;
}

export function DashboardHeader({ title, subtitle, onUpgradeClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 border-b border-emerald-500/15 bg-[#040d0a]/80 backdrop-blur-xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Upgrade pill if available */}
        {onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Upgrade to Pro
          </button>
        )}

        {/* Quick Add Expense */}
        <Link
          href="/expenses?action=new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#08241b] border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </Link>

        {/* Quick Create Invoice */}
        <Link
          href="/invoices/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-emerald-glow text-[#040d0a]"
        >
          <Plus className="w-4 h-4 text-[#040d0a] stroke-[3]" />
          <span>New Invoice</span>
        </Link>
      </div>
    </header>
  );
}
export default DashboardHeader;
