"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  Tag,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import ExpenseCategoryChart from "@/components/charts/ExpenseCategoryChart";
import { formatCurrency, formatDate, getCategoryBadge } from "@/lib/utils";

interface ExpenseItem {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string;
  isBillable: boolean;
  clientName?: string;
}

const CATEGORIES = [
  "Software",
  "Hardware",
  "Travel",
  "Contractor",
  "Marketing",
  "Office",
  "General",
];

function ExpensesContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState<boolean>(initialAction === "new");
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentExpense, setCurrentExpense] = useState<ExpenseItem | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "Software",
    date: new Date().toISOString().split("T")[0],
    receiptUrl: "",
    isBillable: false,
    clientName: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [activeCategory, searchQuery]);

  async function fetchExpenses() {
    try {
      const res = await fetch(
        `/api/expenses?category=${activeCategory}&q=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setTotalExpenses(data.totalExpenses || 0);
        setCategoryBreakdown(data.categoryBreakdown || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      category: "Software",
      date: new Date().toISOString().split("T")[0],
      receiptUrl: "",
      isBillable: false,
      clientName: "",
    });
    setFormError("");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (exp: ExpenseItem) => {
    setCurrentExpense(exp);
    setFormData({
      title: exp.title,
      description: exp.description || "",
      amount: exp.amount.toString(),
      category: exp.category,
      date: new Date(exp.date).toISOString().split("T")[0],
      receiptUrl: exp.receiptUrl || "",
      isBillable: exp.isBillable,
      clientName: exp.clientName || "",
    });
    setFormError("");
    setIsEditOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim() || !formData.amount) {
      setFormError("Title and valid amount are required.");
      return;
    }

    try {
      const url = isEditOpen && currentExpense ? `/api/expenses/${currentExpense.id}` : "/api/expenses";
      const method = isEditOpen ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to save expense");
      }

      setIsAddOpen(false);
      setIsEditOpen(false);
      fetchExpenses();
    } catch (e: any) {
      setFormError(e.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete expense "${title}"?`)) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <DashboardHeader
        title="Expense Tracker"
        subtitle="Log studio overhead, contractor invoices, and deductible business expenses."
      />

      <main className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Top KPI & Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card3D depth={8} glowColor="gold" className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Expenses Logged</span>
              <div className="text-3xl font-display font-extrabold text-white mt-1">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-amber-400/80 mt-1">
                {expenses.length} transactions across {categoryBreakdown.length} active categories
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Tax Deductible: 100%</span>
              <button
                onClick={handleOpenAdd}
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Log New Expense
              </button>
            </div>
          </Card3D>

          <div className="lg:col-span-2 p-6 rounded-2xl glass-card">
            <h3 className="font-display font-bold text-base text-white mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time breakdown of capital allocation across categories.
            </p>
            <ExpenseCategoryChart data={categoryBreakdown} />
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Badges */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#061812] border border-emerald-500/20 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === "ALL"
                  ? "bg-emerald-500 text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Add CTA */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 sm:w-60 pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl btn-emerald-glow text-xs font-bold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Expenses List Table */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Expense Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Billable</th>
                  <th className="pb-3 font-semibold">Receipt</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.length > 0 ? (
                  expenses.map((exp) => {
                    const catBadge = getCategoryBadge(exp.category);
                    return (
                      <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-white text-xs">{exp.title}</div>
                          {exp.description && (
                            <div className="text-[11px] text-slate-400">{exp.description}</div>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${catBadge.bg}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 text-slate-300">
                          {formatDate(exp.date)}
                        </td>
                        <td className="py-4 font-bold text-white text-sm">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="py-4">
                          {exp.isBillable ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                              Billable {exp.clientName ? `(${exp.clientName})` : ""}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Studio Overhead</span>
                          )}
                        </td>
                        <td className="py-4">
                          {exp.receiptUrl ? (
                            <button
                              onClick={() => setPreviewReceipt(exp.receiptUrl || null)}
                              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Paperclip className="w-3 h-3" /> View
                            </button>
                          ) : (
                            <span className="text-slate-600 text-[11px]">None</span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(exp)}
                              title="Edit Expense"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(exp.id, exp.title)}
                              title="Delete Expense"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
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
                      {loading ? "Loading expenses..." : "No expenses found for this category."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#061812] border border-emerald-500/30 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-lg text-white">
              {isEditOpen ? "Edit Expense" : "Log Business Expense"}
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma Organization Seat"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="144.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#061812] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date Incurred</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Receipt URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.receiptUrl}
                    onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Additional tax or project context..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#040d0a]/60 border border-white/5 space-y-2">
                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBillable}
                    onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>Billable to a specific client</span>
                </label>

                {formData.isBillable && (
                  <input
                    type="text"
                    placeholder="Client or Project Name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                  />
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl btn-emerald-glow font-bold">
                  {isEditOpen ? "Save Changes" : "Log Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Image Lightbox Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-xl max-h-[85vh] rounded-2xl bg-[#061812] border border-emerald-500/40 p-4 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setPreviewReceipt(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-xs font-bold text-slate-300 mb-3">Attached Expense Receipt</h4>
            <img
              src={previewReceipt}
              alt="Receipt Attachment"
              className="max-w-full max-h-[70vh] rounded-xl object-contain border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-emerald-400 text-xs">Loading expenses...</div>}>
      <ExpensesContent />
    </Suspense>
  );
}
