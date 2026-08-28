"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  Check,
  ExternalLink,
  Trash2,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const invoicePrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  async function fetchInvoice() {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInvoice();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete invoice ${invoice?.invoiceNumber}?`)) return;
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/invoices");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const copyShareLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invoice/${invoice?.viewToken || invoice?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      if (!invoicePrintRef.current) return;

      const canvas = await html2canvas(invoicePrintRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#061812",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (e) {
      console.error("PDF generation failed, opening print dialogue instead", e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400 text-sm">
        Loading invoice details...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 text-sm space-y-4">
        <p>Invoice not found or deleted.</p>
        <Link href="/invoices" className="btn-emerald-glow px-4 py-2 rounded-xl text-xs font-bold">
          Return to Invoices
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(invoice.status);
  const user = invoice.user || {};
  const client = invoice.client || {};

  return (
    <div className="min-h-screen pb-20">
      <DashboardHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle={`Billed to ${client.name || "Client"}`}
      />

      <main className="px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Share link button */}
            <button
              onClick={copyShareLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Link"}</span>
            </button>

            {/* Public Page View */}
            <Link
              href={`/invoice/${invoice.viewToken || invoice.id}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public View</span>
            </Link>

            {/* Print & PDF */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl btn-emerald-glow text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? "Exporting..." : "Download PDF"}</span>
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
              title="Delete Invoice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Transition Ribbon */}
        <div className="p-4 rounded-2xl bg-[#061812] border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Current Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Transition:</span>
            <button
              onClick={() => updateStatus("DRAFT")}
              className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                invoice.status === "DRAFT" ? "bg-slate-700 text-white border-slate-500" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => updateStatus("SENT")}
              className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                invoice.status === "SENT" ? "bg-amber-500/30 text-amber-300 border-amber-500/50" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => updateStatus("PAID")}
              className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                invoice.status === "PAID" ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/50" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => updateStatus("OVERDUE")}
              className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                invoice.status === "OVERDUE" ? "bg-rose-500/30 text-rose-300 border-rose-500/50" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* Printable Branded Invoice Paper */}
        <div
          ref={invoicePrintRef}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a261c] via-[#061812] to-[#040d0a] border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] text-xs space-y-8"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-emerald-500/20">
            {/* Sender / Studio Branding */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-black font-extrabold shadow-lg">
                  <Layers className="w-6 h-6 text-[#040d0a]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-white tracking-tight">
                    {user.companyName || "Studio Ledger"}
                  </h2>
                  {user.isPro && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Verified Pro Creator
                    </span>
                  )}
                </div>
              </div>

              <div className="text-slate-400 text-xs space-y-0.5 pt-2">
                {user.companyEmail && <div>{user.companyEmail}</div>}
                {user.companyAddress && <div>{user.companyAddress}</div>}
                {user.companyPhone && <div>{user.companyPhone}</div>}
                {user.taxNumber && <div>Tax ID: {user.taxNumber}</div>}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right space-y-2">
              <div className="font-mono text-2xl font-black text-white tracking-tight">
                {invoice.invoiceNumber}
              </div>
              <div className="space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-500 mr-2">Issue Date:</span>
                  <span className="font-medium text-white">{formatDate(invoice.issueDate)}</span>
                </div>
                <div>
                  <span className="text-slate-500 mr-2">Due Date:</span>
                  <span className="font-medium text-amber-400">{formatDate(invoice.dueDate)}</span>
                </div>
                {invoice.paidAt && (
                  <div>
                    <span className="text-slate-500 mr-2">Cleared On:</span>
                    <span className="font-bold text-emerald-400">{formatDate(invoice.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bill To Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-emerald-500/10">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-2">
                Billed To
              </span>
              <div className="font-display font-bold text-base text-white">{client.name}</div>
              {client.company && (
                <div className="font-medium text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3 h-3 text-slate-400" /> {client.company}
                </div>
              )}
              <div className="text-slate-400 mt-1 space-y-0.5">
                {client.email && <div>{client.email}</div>}
                {client.phone && <div>{client.phone}</div>}
                {client.address && <div>{client.address}</div>}
              </div>
            </div>

            <div className="sm:text-right flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Total Amount Due
              </span>
              <div className="font-display font-black text-3xl text-white">
                <span className="text-emerald-400">$</span>
                {invoice.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-emerald-500/20 text-slate-400 text-[11px] font-semibold">
                  <th className="pb-3 font-semibold">Item & Description</th>
                  <th className="pb-3 font-semibold text-center w-20">Qty / Hrs</th>
                  <th className="pb-3 font-semibold text-right w-28">Rate</th>
                  <th className="pb-3 font-semibold text-right w-28">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoice.items?.map((item: any, i: number) => (
                  <tr key={item.id || i} className="hover:bg-white/[0.01]">
                    <td className="py-4 text-slate-200 font-medium">{item.description}</td>
                    <td className="py-4 text-center text-slate-300">{item.quantity}</td>
                    <td className="py-4 text-right text-slate-300">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-4 text-right font-bold text-white">
                      {formatCurrency(item.amount, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-emerald-500/20">
            {/* Notes */}
            <div className="space-y-3">
              {invoice.notes && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Notes
                  </span>
                  <p className="text-slate-300 leading-relaxed">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Terms & Conditions
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{invoice.terms}</p>
                </div>
              )}
            </div>

            {/* Calculations Column */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount ({invoice.discount}%):</span>
                  <span>-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
                </div>
              )}
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>+{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-emerald-500/30 flex justify-between items-center">
                <span className="font-display font-bold text-sm text-white">Total Due:</span>
                <span className="font-display font-black text-2xl text-emerald-400">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
