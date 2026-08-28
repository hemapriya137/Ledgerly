"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Receipt,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Settings & Brand", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [clientCount, setClientCount] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    async function fetchClientMetrics() {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClientCount(data.count || 0);
          setIsPro(data.isPro || false);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchClientMetrics();
  }, [pathname]);

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col justify-between border-r border-emerald-500/15 bg-[#040d0a]/90 backdrop-blur-2xl p-4 z-40">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)] group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-[#040d0a]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              Ledgerly
              {isPro ? (
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  PRO
                </span>
              ) : (
                <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  FREE
                </span>
              )}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">3D Financial Suite</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-[#071f16]/60 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Pro Upgrade Banner & User Profile */}
      <div className="space-y-4">
        {/* Tier Usage Card */}
        {!isPro ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-950/40 to-[#061812] border border-amber-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Free Plan
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                {clientCount} / 5 Clients
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min((clientCount / 5) * 100, 100)}%` }}
              />
            </div>

            <button
              onClick={onUpgradeClick}
              className="w-full py-2 px-3 rounded-xl btn-gold-glow text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#09241b]/60 border border-emerald-500/25 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Pro Member
                <span className="text-[10px] text-amber-400">★</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">Unlimited Clients Active</div>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-500 p-[1px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-[#040d0a] flex items-center justify-center font-bold text-xs text-white">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Freelancer"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {session?.user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
export default DashboardSidebar;
