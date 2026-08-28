"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Receipt,
  FileText,
  Users,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  DollarSign,
  ChevronRight,
  Star,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Card3D from "@/components/ui/Card3D";
import StaticHeroFallback from "@/components/3d/StaticHeroFallback";
import UpgradeModal from "@/components/ui/UpgradeModal";

// Lazy load R3F Canvas with fallback
const HeroScene3D = dynamic(() => import("@/components/3d/HeroScene3D"), {
  ssr: false,
  loading: () => <StaticHeroFallback />,
});

export default function LandingPage() {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#040d0a] bg-noise text-[#f3f4f6] selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Ambient background glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Left Content */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>THE 3D FREELANCER FINANCIAL ENGINE</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
            Invoicing that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              commands respect.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Ditch generic flat SaaS dashboards. Ledgerly pairs tactile 3D visual depth with ultra-fast invoice generation, intelligent expense categorization, and seamless client payments.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full btn-emerald-glow font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/25 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Explore Live Demo</span>
            </Link>
          </div>

          {/* Social Proof metrics */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
            <div>
              <div className="text-lg font-bold text-white font-display">$4.8M+</div>
              <div>Invoices Processed</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-lg font-bold text-white font-display">99.4%</div>
              <div>On-Time Client Pay</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-lg font-bold text-emerald-400 font-display">4.9 / 5</div>
              <div>Creator Rating</div>
            </div>
          </div>
        </div>

        {/* Hero Right: 3D Interactive Canvas Scene */}
        <div className="w-full lg:w-1/2 z-10">
          {mounted ? <HeroScene3D /> : <StaticHeroFallback />}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            ARCHITECTED FOR CREATORS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Everything your studio needs to thrive
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered from the ground up for 3D artists, design directors, developers, and creative consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card3D depth={10} glowColor="emerald">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              High-Precision Invoicing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate pixel-perfect multi-item invoices with automated tax calculations, discounts, multi-currency support, and instant PDF exports.
            </p>
          </Card3D>

          <Card3D depth={10} glowColor="gold">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Client Portfolio Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track client billing history, contracts, and payment statuses. Free tier allows up to 5 clients; Pro unlocks limitless scaling.
            </p>
          </Card3D>

          <Card3D depth={10} glowColor="emerald">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Expense Radar & Receipts
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log software subscriptions, hardware gear, contractor fees, and travel. Attach visual receipts and tag billable client expenses effortlessly.
            </p>
          </Card3D>

          <Card3D depth={10} glowColor="gold">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Shareable Client Portal
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Send unique branded links where clients can view invoice items, download official PDF records, and pay in one click.
            </p>
          </Card3D>

          <Card3D depth={10} glowColor="emerald">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Telemetry & Cashflow Charts
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visualise monthly revenue velocity, overdue receivables, and expense breakdowns using custom-themed Recharts matching our 3D palette.
            </p>
          </Card3D>

          <Card3D depth={10} glowColor="emerald">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Pro Studio Custom Branding
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlock custom studio logos, unique payment terms, priority tax rules, and enterprise-grade billing telemetry with Stripe Pro.
            </p>
          </Card3D>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            TRANSPARENT VALUE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Simple, predictable pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Start completely free, then scale up as your client roster grows.
          </p>

          {/* Interval Switcher */}
          <div className="flex justify-center pt-4">
            <div className="p-1 rounded-full bg-[#061812] border border-emerald-500/20 flex items-center gap-1 text-xs">
              <button
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                  billingInterval === "monthly"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("yearly")}
                className={`px-4 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  billingInterval === "yearly"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-bold">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier Card */}
          <div className="p-8 rounded-3xl bg-[#061812]/80 border border-emerald-500/20 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-xl text-white">Starter Free</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  Forever Free
                </span>
              </div>
              <div className="font-display font-black text-4xl text-white">
                $0 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
              </div>
              <p className="text-xs text-slate-400">
                Ideal for newly independent freelancers establishing their initial client base.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 5 active clients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full invoice creation & tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Expense logging & categories
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Downloadable invoice PDFs
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Lock className="w-3.5 h-3.5" /> No custom studio branding
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pro Tier Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-[#0a261c] to-[#040d0a] border border-amber-500/50 shadow-[0_20px_50px_rgba(245,158,11,0.15)] space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-[10px] shadow-lg">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-extrabold text-xl text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Studio Pro
                </h3>
              </div>
              <div className="font-display font-black text-4xl text-white">
                {billingInterval === "yearly" ? "$190" : "$19"}
                <span className="text-xs text-slate-400 font-sans font-normal">
                  {billingInterval === "yearly" ? " / year" : " / month"}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                For active freelancers and boutique studios managing ongoing retainers.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-amber-500/20">
                <li className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Unlimited clients & invoices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Custom studio logo & branding
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Public shareable client portals with 1-click pay
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> High-resolution PDF exports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority telemetry & Stripe checkout
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="w-full py-3.5 rounded-2xl btn-gold-glow font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-white text-sm">Ledgerly 3D</span>
        </div>

        <div>
          © {new Date().getFullYear()} Ledgerly. Crafted with React Three Fiber, Next.js & Prisma.
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-white">Sign In</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
          <Link href="/dashboard" className="hover:text-emerald-400 font-semibold">Dashboard</Link>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
