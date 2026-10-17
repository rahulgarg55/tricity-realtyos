"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  Settings,
  CreditCard,
  Building,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

export default function SettingsBillingPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpgrade = async (planId: "STARTER" | "GROWTH" | "BUSINESS") => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Plan updated!");
        fetchProfile();
      } else {
        alert(data.error || "Failed to upgrade plan");
      }
    } catch (e) {
      alert("Billing error");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  const org = profile?.organization;
  const currentPlan = org?.subscriptionTier || "STARTER";

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Organization Settings & Commercial Billing"
        subtitle="Manage subscription packages, team member access, and integration credentials"
      />

      <div className="p-6 space-y-6 max-w-5xl">
        {/* Organization Details */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Organization Profile</h3>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
              {org?.city || "Tricity"} Real Estate Org
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Business Legal Name</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{org?.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Tenant Slug (Isolated Database Scope)</span>
              <code className="font-bold text-slate-800 text-xs font-mono mt-0.5 block">{org?.slug}</code>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Timezone & Currency</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">Asia/Kolkata (INR ₹)</span>
            </div>
          </div>
        </div>

        {/* Subscription & Plans */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Commercial SaaS Subscription Plans</h3>
                <p className="text-[11px] text-slate-500">
                  Current Active Plan: <span className="font-bold text-slate-800">{currentPlan}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan 1: Starter */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                currentPlan === "STARTER"
                  ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Starter Broker</h4>
                    <p className="text-[11px] text-slate-500">For boutique brokers</p>
                  </div>
                  {currentPlan === "STARTER" && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xl font-black text-slate-900">
                  ₹4,999 <span className="text-xs font-normal text-slate-500">/mo</span>
                </p>

                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 5 Sales Agents</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 500 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>3 Projects & 100 Units</span>
                  </li>
                </ul>
              </div>

              <button
                disabled={currentPlan === "STARTER" || upgrading}
                onClick={() => handleUpgrade("STARTER")}
                className="mt-4 w-full py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {currentPlan === "STARTER" ? "Current Tier" : "Select Starter"}
              </button>
            </div>

            {/* Plan 2: Growth */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                currentPlan === "GROWTH"
                  ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Growth Agency</h4>
                    <p className="text-[11px] text-slate-500">For channel partners & firms</p>
                  </div>
                  {currentPlan === "GROWTH" && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xl font-black text-slate-900">
                  ₹9,999 <span className="text-xs font-normal text-slate-500">/mo</span>
                </p>

                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 15 Sales Agents</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 2,500 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Official WhatsApp Cloud API</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>CSV Import Duplicate Guard</span>
                  </li>
                </ul>
              </div>

              <button
                disabled={currentPlan === "GROWTH" || upgrading}
                onClick={() => handleUpgrade("GROWTH")}
                className="mt-4 w-full py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
              >
                {currentPlan === "GROWTH" ? "Current Tier" : "Upgrade to Growth"}
              </button>
            </div>

            {/* Plan 3: Business */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                currentPlan === "BUSINESS"
                  ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Enterprise Builder</h4>
                    <p className="text-[11px] text-slate-500">For developers & townships</p>
                  </div>
                  {currentPlan === "BUSINESS" && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xl font-black text-slate-900">
                  ₹19,999 <span className="text-xs font-normal text-slate-500">/mo</span>
                </p>

                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 50 Sales Team Members</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Up to 10,000 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Multi-Tower Inventory Matrix</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Automated Hold Expiry TTL</span>
                  </li>
                </ul>
              </div>

              <button
                disabled={currentPlan === "BUSINESS" || upgrading}
                onClick={() => handleUpgrade("BUSINESS")}
                className="mt-4 w-full py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:opacity-50"
              >
                {currentPlan === "BUSINESS" ? "Current Tier" : "Upgrade to Business"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
