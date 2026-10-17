"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Check, HelpCircle, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Transparent Commercial SaaS Plans
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
              Simple Pricing for Real Estate Teams of All Sizes
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              From individual Tricity property consultants to multi-tower township developers in Mohali & Zirakpur.
            </p>

            {/* Annual toggle */}
            <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold">
              <span className={!billingAnnual ? "text-slate-900 font-bold" : "text-slate-500"}>Monthly Billing</span>
              <button
                onClick={() => setBillingAnnual(!billingAnnual)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  billingAnnual ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    billingAnnual ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className={billingAnnual ? "text-slate-900 font-bold" : "text-slate-500"}>
                Annual Billing <span className="text-emerald-600 font-bold">(Save 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1 */}
            <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Starter Broker</h3>
                  <p className="text-xs text-slate-500 mt-1">For boutique dealers & sole brokers in Tricity</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {billingAnnual ? "₹3,999" : "₹4,999"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> /month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Up to 5 Sales Agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>500 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>3 Projects & 100 Inventory Units</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Site Visit Calendar Scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>CSV Leads Export</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full text-center py-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Plan 2: Growth (Featured) */}
            <div className="p-7 rounded-3xl border-2 border-blue-600 bg-blue-50/20 shadow-xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular for Agencies
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Growth Agency</h3>
                  <p className="text-xs text-slate-500 mt-1">For property channel partners & mid-size builders</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {billingAnnual ? "₹7,999" : "₹9,999"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> /month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-200/60 pt-4">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Up to 15 Sales Reps & Managers</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>2,500 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>10 Projects & 500 Inventory Units</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Official WhatsApp Cloud API</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Bulk CSV Import Duplicate Guard</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Role-Based Access Control (RBAC)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full text-center py-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Plan 3: Business */}
            <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Enterprise Builder</h3>
                  <p className="text-xs text-slate-500 mt-1">For developers & large township sales operations</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {billingAnnual ? "₹15,999" : "₹19,999"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> /month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Up to 50 Sales Team Members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>10,000 Active Leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>50 Township / Plotted Projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Multi-Tower Inventory Hold TTL Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Automated WhatsApp Reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Dedicated SLA & Priority Onboarding</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/book-demo"
                className="w-full text-center py-3 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
