"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Receipt,
  Users,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Share2,
  CheckCircle2,
  Plus,
  Zap,
  Check,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import ExpenseCategoryChart from "@/components/charts/ExpenseCategoryChart";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateInvoiceStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardStats();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const copyShareLink = (viewToken: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invoice/${viewToken || id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const metrics = data?.metrics || {
    totalPaidRevenue: 0,
    pendingReceivables: 0,
    overdueReceivables: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: "0.0",
    clientCount: 0,
    clientLimit: 5,
    isPro: false,
  };

  const isNearingLimit = !metrics.isPro && metrics.clientCount >= 4;

  return (
    <div className="min-h-screen pb-16">
      <DashboardHeader
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "Freelancer"}`}
        subtitle="Here is your financial telemetry and cashflow performance."
        onUpgradeClick={!metrics.isPro ? () => setIsUpgradeOpen(true) : undefined}
      />

      <main className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Tier Limit Notice Banner if Free and near limit */}
        {isNearingLimit && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-950/40 to-[#061812] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-pulse-glow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Client Cap Reached ({metrics.clientCount} / 5 Clients)
                </h4>
                <p className="text-xs text-slate-300">
                  You are using {metrics.clientCount} of 5 free client slots. Upgrade to Pro for unlimited clients and custom branding.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-4 py-2 rounded-xl btn-gold-glow text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Unlock Unlimited Pro
            </button>
          </div>
        )}

        {/* 3D KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Revenue */}
          <Card3D glowColor="emerald" depth={10}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">Total Collected</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {formatCurrency(metrics.totalPaidRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Net Profit: {formatCurrency(metrics.netProfit)}</span>
            </div>
          </Card3D>

          {/* Card 2: Pending Receivables */}
          <Card3D glowColor="gold" depth={10}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">Outstanding Invoices</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {formatCurrency(metrics.pendingReceivables)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
              <span>Awaiting client clearance</span>
            </div>
          </Card3D>

          {/* Card 3: Overdue Amount */}
          <Card3D glowColor="emerald" depth={10}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">Overdue Receivables</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {formatCurrency(metrics.overdueReceivables)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
              <span>Requires client reminder</span>
            </div>
          </Card3D>

          {/* Card 4: Total Expenses & Margin */}
          <Card3D glowColor="emerald" depth={10}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">Total Expenses</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {formatCurrency(metrics.totalExpenses)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
              <span>Profit Margin: <strong className="text-emerald-400 font-bold">{metrics.profitMargin}%</strong></span>
            </div>
          </Card3D>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Earnings & Expenses Flow Area Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-card relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  Financial Performance Flow
                </h3>
                <p className="text-xs text-slate-400">
                  Monthly cashflow comparison between income collected and expenses incurred.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Expenses
                </span>
              </div>
            </div>

            <IncomeExpenseChart data={data?.timeline || []} />
          </div>

          {/* Expense Categories Donut */}
          <div className="p-6 rounded-2xl glass-card flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white mb-1">
                Expense Breakdown
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Allocation across your business operating categories.
              </p>
            </div>

            <ExpenseCategoryChart data={data?.categoryBreakdown || []} />

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <Link href="/expenses" className="text-emerald-400 hover:underline flex items-center gap-1">
                View all expenses <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/expenses?action=new" className="text-slate-400 hover:text-white flex items-center gap-1">
                + Add New
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Recent Invoices</h3>
              <p className="text-xs text-slate-400">Manage, send, and review recent client billings.</p>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              View All Invoices ({data?.invoices?.length || data?.recentInvoices?.length || 0})
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Invoice</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Date Due</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentInvoices?.length > 0 ? (
                  data.recentInvoices.map((inv: any) => {
                    const badge = getStatusBadge(inv.status);
                    return (
                      <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 font-mono font-medium text-white">
                          <Link href={`/invoices/${inv.id}`} className="hover:text-emerald-400 transition-colors">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-slate-200">{inv.client?.name}</div>
                          <div className="text-[10px] text-slate-400">{inv.client?.company || inv.client?.email}</div>
                        </td>
                        <td className="py-4 text-slate-300">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="py-4 font-bold text-white">
                          {formatCurrency(inv.totalAmount, inv.currency)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Copy Shareable Link */}
                            <button
                              onClick={() => copyShareLink(inv.viewToken, inv.id)}
                              title="Copy Shareable Client Link"
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Mark as Paid Quick Toggle */}
                            {inv.status !== "PAID" ? (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, "PAID")}
                                title="Mark as Paid"
                                className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-semibold transition-colors"
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Paid
                              </span>
                            )}

                            {/* View Details */}
                            <Link
                              href={`/invoices/${inv.id}`}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No invoices created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => {
          setIsUpgradeOpen(false);
          fetchDashboardStats();
        }}
      />
    </div>
  );
}
