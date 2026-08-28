"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Settings,
  Building,
  Sparkles,
  Shield,
  Zap,
  Save,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  Lock,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import UpgradeModal from "@/components/ui/UpgradeModal";

function SettingsContent() {
  const searchParams = useSearchParams();
  const upgradedQuery = searchParams.get("upgraded");

  const [profile, setProfile] = useState<any>({
    name: "",
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    companyPhone: "",
    currency: "USD",
    taxNumber: "",
    isPro: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProDemo = async () => {
    const updatedStatus = !profile.isPro;
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPro: updatedStatus }),
      });
      if (res.ok) {
        setProfile({ ...profile, isPro: updatedStatus });
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <DashboardHeader
        title="Studio Settings & Branding"
        subtitle="Configure your invoice branding, business details, and subscription tier."
      />

      <main className="px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Upgrade Success Notification if redirected from Stripe */}
        {upgradedQuery && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <strong className="block font-bold text-white text-sm">Welcome to Ledgerly Pro!</strong>
              Your account has been upgraded with unlimited clients, custom studio branding, and priority tools.
            </div>
          </div>
        )}

        {/* Pro Status Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#09241b] via-[#061812] to-[#040d0a] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-3d-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg">
              <Zap className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-white">
                  {profile.isPro ? "Ledgerly Pro Subscription" : "Ledgerly Free Starter Tier"}
                </h3>
                {profile.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile.isPro
                  ? "Unlimited clients active, custom studio branding unlocked, direct high-res PDF generation."
                  : "Capped at 5 clients. Upgrade to Pro for unlimited clients, custom logo branding, and instant client portals."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!profile.isPro ? (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="w-full md:w-auto px-5 py-3 rounded-2xl btn-gold-glow text-xs font-bold flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Upgrade to Pro ($19/mo)
              </button>
            ) : (
              <button
                onClick={handleToggleProDemo}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Switch to Free (Demo Mode)
              </button>
            )}
          </div>
        </div>

        {/* Studio Branding Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Business & Invoice Identity
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Studio / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance Spatial Design"
                    value={profile.companyName || ""}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-bold text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Billing Email</label>
                    <input
                      type="email"
                      placeholder="billing@studio.com"
                      value={profile.companyEmail || ""}
                      onChange={(e) => setProfile({ ...profile, companyEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Business Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 123-4567"
                      value={profile.companyPhone || ""}
                      onChange={(e) => setProfile({ ...profile, companyPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Studio Address</label>
                  <input
                    type="text"
                    placeholder="100 5th Ave, Suite 1400, New York, NY"
                    value={profile.companyAddress || ""}
                    onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Tax ID / VAT</label>
                    <input
                      type="text"
                      placeholder="US-123456789"
                      value={profile.taxNumber || ""}
                      onChange={(e) => setProfile({ ...profile, taxNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Default Currency</label>
                    <select
                      value={profile.currency || "USD"}
                      onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto px-6 py-2.5 rounded-xl btn-emerald-glow text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving Changes..." : "Save Branding"}
                </button>
              </div>
            </div>
          </div>

          {/* Live Invoice Preview Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                Live Invoice Header Preview
              </span>

              <div className="p-4 rounded-xl bg-[#040d0a]/80 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-white">
                      {profile.companyName || "Studio Name"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {profile.companyEmail || "billing@studio.com"}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5 pt-2 border-t border-white/5">
                  <div>{profile.companyAddress || "Studio Address"}</div>
                  {profile.taxNumber && <div>Tax ID: {profile.taxNumber}</div>}
                </div>
              </div>

              {/* Instant Pro Demo Switcher */}
              <div className="pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleToggleProDemo}
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {profile.isPro ? "⚡ Switch to Free Plan" : "⚡ Switch to Pro Plan Instantly"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => {
          setIsUpgradeOpen(false);
          fetchProfile();
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-emerald-400 text-xs">Loading studio settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
