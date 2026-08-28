"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Sparkles,
  Save,
  Send,
  Building,
  User,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import { formatCurrency } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function NewInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState(preselectedClientId || "");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState(
    "Thank you for your business! Please remit payment via bank transfer or the payment link provided."
  );
  const [terms, setTerms] = useState("Payment due within 14 days of issue.");
  const [status, setStatus] = useState<"DRAFT" | "SENT">("SENT");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Design & Engineering Services", quantity: 1, unitPrice: 2500 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients || []);
          if (!clientId && data.clients?.length > 0) {
            setClientId(data.clients[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchClients();
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Math Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmount = (subtotal * (Number(discount) || 0)) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * (Number(taxRate) || 0)) / 100;
  const totalAmount = subtotalAfterDiscount + taxAmount;

  const handleSubmit = async (submitStatus?: "DRAFT" | "SENT") => {
    setError("");
    if (!clientId) {
      setError("Please select a client or create a new client first.");
      return;
    }

    if (items.some((i) => !i.description.trim())) {
      setError("Please enter a description for all line items.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          issueDate,
          dueDate,
          taxRate: Number(taxRate) || 0,
          discount: Number(discount) || 0,
          notes,
          terms,
          status: submitStatus || status,
          items: items.map(({ description, quantity, unitPrice }) => ({
            description,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
          })),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create invoice");
      }

      const invoice = await res.json();
      router.push(`/invoices/${invoice.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <DashboardHeader
        title="Create New Invoice"
        subtitle="Configure line items, client details, and tax structures."
      />

      <main className="px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Date Settings Card */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Client & Timeline
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-300 font-medium">Select Client *</label>
                    <Link
                      href="/clients"
                      className="text-emerald-400 hover:underline text-[11px]"
                    >
                      + Add New Client
                    </Link>
                  </div>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#061812] text-white">
                        {c.name} {c.company ? `(${c.company})` : ""} — {c.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">Line Items</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#040d0a]/60 border border-white/5 grid grid-cols-12 gap-3 items-center text-xs"
                    >
                      {/* Description */}
                      <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Description</label>
                        <input
                          type="text"
                          placeholder="e.g. 3D WebGL Shaders & Animation"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                        />
                      </div>

                      {/* Qty */}
                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Qty / Hrs</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg glass-input text-xs"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">Rate ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, "unitPrice", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg glass-input text-xs"
                        />
                      </div>

                      {/* Line Amount & Delete */}
                      <div className="col-span-4 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-500">Amount</span>
                          <span className="font-bold text-white text-xs">{formatCurrency(lineTotal)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <h3 className="font-display font-bold text-base text-white">Terms & Payment Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer Note</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Terms</label>
                  <textarea
                    rows={3}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Action Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-card-gold space-y-5 sticky top-24">
              <h3 className="font-display font-bold text-lg text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Summary Breakdown
              </h3>

              {/* Tax & Discount Inputs */}
              <div className="space-y-3 pt-2 border-t border-amber-500/20 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-300">Discount Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 px-2.5 py-1 rounded-lg glass-input text-right text-xs"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-300">Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-20 px-2.5 py-1 rounded-lg glass-input text-right text-xs"
                  />
                </div>
              </div>

              {/* Calculations Table */}
              <div className="space-y-2 pt-3 border-t border-amber-500/20 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount ({discount}%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {taxRate > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Tax ({taxRate}%):</span>
                    <span>+{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-amber-500/30 flex justify-between items-center">
                  <span className="font-display font-bold text-sm text-white">Grand Total:</span>
                  <span className="font-display font-extrabold text-2xl text-amber-400">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => handleSubmit("SENT")}
                  disabled={loading}
                  className="w-full py-3 rounded-xl btn-emerald-glow text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? "Generating Invoice..." : "Save & Send Invoice"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-emerald-400 text-xs">Loading invoice builder...</div>}>
      <NewInvoiceContent />
    </Suspense>
  );
}
