"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Share2,
  Download,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Check,
  Building,
  Calendar,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [activeTab, searchQuery]);

  async function fetchInvoices() {
    try {
      const res = await fetch(
        `/api/invoices?status=${activeTab}&q=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
        setMetrics(data.metrics || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string, invoiceNumber: string) {
    if (!confirm(`Are you sure you want to delete ${invoiceNumber}?`)) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) fetchInvoices();
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

  const tabs = [
    { label: "All Invoices", value: "ALL" },
    { label: "Paid", value: "PAID" },
    { label: "Sent / Pending", value: "SENT" },
    { label: "Overdue", value: "OVERDUE" },
    { label: "Drafts", value: "DRAFT" },
  ];

  return (
    <div className="min-h-screen pb-16">
      <DashboardHeader
        title="Invoice Manager"
        subtitle="Track billing lifecycles, send client invoices, and collect payments."
      />

      <main className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Metric Summary Bar */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-[#061812]/80 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Total Paid</span>
                <div className="text-xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#061812]/80 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Pending Clearances</span>
                <div className="text-xl font-bold text-white">{formatCurrency(metrics.pendingAmount)}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#061812]/80 border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Overdue</span>
                <div className="text-xl font-bold text-rose-400">{formatCurrency(metrics.overdueAmount)}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#061812] border border-emerald-500/20 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & New Invoice CTA */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 sm:w-64 pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <Link
              href="/invoices/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl btn-emerald-glow text-xs font-bold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Invoice</span>
            </Link>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Invoice #</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Issue Date</th>
                  <th className="pb-3 font-semibold">Due Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.length > 0 ? (
                  invoices.map((inv) => {
                    const badge = getStatusBadge(inv.status);
                    return (
                      <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 font-mono font-bold text-white">
                          <Link href={`/invoices/${inv.id}`} className="hover:text-emerald-400 transition-colors">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-slate-200">{inv.client?.name}</div>
                          {inv.client?.company && (
                            <div className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                              <Building className="w-2.5 h-2.5" /> {inv.client.company}
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-slate-400">
                          {formatDate(inv.issueDate)}
                        </td>
                        <td className="py-4 text-slate-300 font-medium">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="py-4 font-bold text-white text-sm">
                          {formatCurrency(inv.totalAmount, inv.currency)}
                        </td>
                        <td className="py-4">
                          <select
                            value={inv.status}
                            onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer ${badge.bg}`}
                          >
                            <option value="DRAFT" className="bg-[#061812] text-slate-300">Draft</option>
                            <option value="SENT" className="bg-[#061812] text-amber-300">Sent / Pending</option>
                            <option value="PAID" className="bg-[#061812] text-emerald-400">Paid</option>
                            <option value="OVERDUE" className="bg-[#061812] text-rose-400">Overdue</option>
                          </select>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Copy Public Link */}
                            <button
                              onClick={() => copyShareLink(inv.viewToken, inv.id)}
                              title="Copy Shareable Public Link"
                              className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* View / Edit Details */}
                            <Link
                              href={`/invoices/${inv.id}`}
                              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="View & Edit Invoice"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                              title="Delete Invoice"
                              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      {loading ? "Loading invoices..." : "No invoices found for this criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
