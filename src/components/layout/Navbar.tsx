"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Layers, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-[#061812]/80 backdrop-blur-xl border border-emerald-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)] group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-[#040d0a]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Ledgerly
              <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                3D
              </span>
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            Features
          </a>
          <a href="#demo" className="hover:text-emerald-400 transition-colors">
            Interactive 3D
          </a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">
            Pricing
          </a>
          <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
            Showcase
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-emerald-glow text-sm font-semibold"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-emerald-glow text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                Start Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
