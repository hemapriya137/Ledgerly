"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid credentials");
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch (e: any) {
      setError(e.message || "Failed to sign in");
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: "password123",
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040d0a] bg-noise flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-black font-extrabold shadow-[0_0_20px_rgba(52,211,153,0.5)]">
              <Layers className="w-6 h-6 text-[#040d0a]" />
            </div>
          </Link>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Sign In to Ledgerly
          </h1>
          <p className="text-xs text-slate-400">
            Next-gen 3D financial operations for independent creators.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a261c]/90 via-[#061812]/95 to-[#040d0a]/95 border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-2xl space-y-6">
          {/* Quick 1-Click Demo Switchers */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              ⚡ Instant Demo Accounts (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("alex@ledgerly.io")}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/60 border border-emerald-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                  Alex Rivera
                </div>
                <div className="text-[10px] text-slate-400">Free Tier Demo</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("elena@ledgerly.io")}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-amber-950/60 border border-amber-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                  <span>Elena Vance</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">PRO</span>
                </div>
                <div className="text-[10px] text-slate-400">Pro Tier Demo</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#061812] px-3 text-[10px] uppercase text-slate-500 font-bold absolute">
              or credentials
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@ledgerly.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-emerald-glow font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? "Authenticating..." : "Sign In to Studio"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline">
              Create one for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040d0a] flex items-center justify-center text-emerald-400 text-xs">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
