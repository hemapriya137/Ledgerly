"use client";

import React, { useState } from "react";
import { Check, Sparkles, X, Zap, Shield, ArrowRight, Lock } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [demoActivating, setDemoActivating] = useState(false);

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.mockSuccess) {
        // Mock Stripe mode fallback
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoToggle = async () => {
    setDemoActivating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPro: true }),
      });
      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDemoActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#09241b] via-[#061812] to-[#040d0a] border border-amber-500/40 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            UNLOCK UNLIMITED POTENTIAL
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Ledgerly Pro</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Remove the 5-client limit, unlock custom invoice branding, high-res PDF exports, and automate client payments.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-6">
          <div className="p-1 rounded-full bg-[#030d09] border border-emerald-500/20 flex items-center gap-1 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-emerald-500 text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly ($19/mo)
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-amber-400 text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Yearly ($190/yr)</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Feature Grid Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#040d0a]/80 border border-slate-800 text-xs space-y-3">
            <div className="font-bold text-slate-300 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Free Tier Included
            </div>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Up to 5 Active Clients
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Basic Invoicing & Calculations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Expense Tracking & Receipts
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Lock className="w-3.5 h-3.5" /> No Custom Studio Branding
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-[#0a261c] to-[#040d0a] border border-amber-500/40 text-xs space-y-3 shadow-lg">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              Pro Tier Unlocked
            </div>
            <ul className="space-y-2 text-slate-200">
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-amber-400" />
                <span className="text-white font-bold">Unlimited</span> Clients & Invoices
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" /> Custom Logo & Business Branding
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" /> Direct PDF Generator & Print
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" /> Shareable Client Portal with 1-Click Pay
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStripeCheckout}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl btn-gold-glow font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
          >
            <Shield className="w-4 h-4" />
            {loading ? "Preparing Stripe Checkout..." : `Upgrade Now (${billingCycle === "yearly" ? "$190/year" : "$19/month"})`}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleInstantDemoToggle}
            disabled={demoActivating}
            className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {demoActivating ? "Activating Pro..." : "⚡ Quick Demo Mode: Activate Pro Instantly"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpgradeModal;
