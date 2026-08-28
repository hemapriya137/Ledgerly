"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Printer,
  Download,
  CreditCard,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";

export default function PublicInvoicePage() {
  const params = useParams();
  const tokenOrId = params.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const invoicePrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPublicInvoice();
  }, [tokenOrId]);

  async function fetchPublicInvoice() {
    try {
      const res = await fetch(`/api/invoices/public/${tokenOrId}`);
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

  const handlePayInvoice = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/invoices/public/${tokenOrId}`, {
        method: "POST",
      });
      if (res.ok) {
        setPaidSuccess(true);
        fetchPublicInvoice();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
    }
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
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (e) {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex items-center justify-center text-emerald-400 text-sm">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <h2 className="font-display font-bold text-xl text-white">Invoice Not Found</h2>
        <p className="text-xs">The link may have expired or the invoice was removed.</p>
        <Link href="/" className="px-4 py-2 rounded-xl btn-emerald-glow text-xs font-bold mt-2">
          Return to Ledgerly
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status === "PAID";
  const user = invoice.user || {};
  const client = invoice.client || {};
  const badge = getStatusBadge(invoice.status);

  return (
    <div className="min-h-screen bg-[#040d0a] bg-noise text-[#f3f4f6] pb-24 selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-emerald-500/15 bg-[#061812]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-white">
              {user.companyName || "Ledgerly Invoice"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded-xl bg-[#09241b] border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Payment Banner if not paid */}
        {!isPaid ? (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0a261c] to-[#040d0a] border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PAYMENT DUE
                </span>
                <span className="text-xs text-slate-300">
                  Due by {formatDate(invoice.dueDate)}
                </span>
              </div>
              <div className="font-display font-extrabold text-3xl text-white">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </div>
            </div>

            <button
              onClick={handlePayInvoice}
              disabled={paying}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gold-glow text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
            >
              <CreditCard className="w-4 h-4" />
              {paying ? "Processing Payment..." : "Pay Invoice Online Now"}
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Invoice Paid</h3>
                <p className="text-xs text-emerald-300">
                  Thank you! Payment of {formatCurrency(invoice.totalAmount, invoice.currency)} was received.
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-xs font-semibold text-slate-400">
              Receipt Available Below
            </div>
          </div>
        )}

        {/* Printable Branded Invoice Paper */}
        <div
          ref={invoicePrintRef}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a261c] via-[#061812] to-[#040d0a] border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] text-xs space-y-8"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-emerald-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-black font-extrabold shadow-lg">
                  <Layers className="w-6 h-6 text-[#040d0a]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-white tracking-tight">
                    {user.companyName || "Studio Ledger"}
                  </h2>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Verified Digital Invoice
                  </span>
                </div>
              </div>

              <div className="text-slate-400 text-xs space-y-0.5 pt-2">
                {user.companyEmail && <div>{user.companyEmail}</div>}
                {user.companyAddress && <div>{user.companyAddress}</div>}
                {user.companyPhone && <div>{user.companyPhone}</div>}
                {user.taxNumber && <div>Tax ID: {user.taxNumber}</div>}
              </div>
            </div>

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
                <div>
                  <span className="text-slate-500 mr-2">Status:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>
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
                    Terms & Payment Information
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{invoice.terms}</p>
                </div>
              )}
            </div>

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

        {/* Footer */}
        <div className="text-center pt-8 text-xs text-slate-500">
          Powered by <Link href="/" className="text-emerald-400 hover:underline font-bold">Ledgerly 3D</Link> — Modern Invoicing & Cashflow Engine.
        </div>
      </main>
    </div>
  );
}
