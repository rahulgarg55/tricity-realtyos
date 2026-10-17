"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user?.isSuperAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error during login");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("TricityPass123!");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <MarketingNavbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign In to Tricity RealtyOS</h1>
            <p className="text-xs text-slate-500">
              Enter your credentials or choose a pre-configured demo account below
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all text-xs"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            {/* Quick Demo Fills */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Accounts
                </span>
                <span className="text-slate-400">Click to fill</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => fillCredentials("owner@sushmagroup.com")}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors"
                >
                  <span className="font-bold text-slate-800 block truncate">Builder Owner</span>
                  <span className="text-slate-500 block truncate">Sushma Urban</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("rahul.sales@sushmagroup.com")}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors"
                >
                  <span className="font-bold text-slate-800 block truncate">Sales Rep</span>
                  <span className="text-slate-500 block truncate">Rahul Garg</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("owner@primechd.com")}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors"
                >
                  <span className="font-bold text-slate-800 block truncate">Brokerage Owner</span>
                  <span className="text-slate-500 block truncate">Prime Brokers</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("superadmin@tricityrealty.com")}
                  className="p-2 text-left bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-lg transition-colors"
                >
                  <span className="font-bold text-amber-900 block truncate">Super Admin</span>
                  <span className="text-amber-700 block truncate">Global Platform</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an organization yet?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
