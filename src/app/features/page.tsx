import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import {
  Users,
  Building2,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Deep-Dive Platform Capabilities
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
              Purpose-Built for Commercial Real Estate Operations
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Engineered to handle high-velocity property inquiries, NRI buyers, and multi-tower inventory across Tricity.
            </p>
          </div>

          {/* Feature 1: Lead CRM */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                1. Tricity Lead CRM & Duplicate Prevention
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real estate leads often come from multiple portals: MagicBricks, 99acres, Facebook Ads, and direct site walk-ins.
                Our engine automatically normalizes Indian phone numbers (+91) and blocks duplicate entries, ensuring no sales rep
                wastes time or clashes over existing customer accounts.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Formula injection protection (CSV Injection mitigation) for all exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flexible CSV bulk import with automatic column header detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lead aging metrics and lost-reason tracking</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-3 shadow-xl">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Lead Verification</span>
              <p className="text-sm font-bold">Automatic Indian Phone Normalization</p>
              <div className="p-3 bg-slate-800 rounded-xl font-mono text-xs space-y-1 text-slate-300">
                <p>Input: "098140-12345" → Output: "+919814012345"</p>
                <p>Input: "9814012345"   → Output: "+919814012345"</p>
                <p className="text-emerald-400">Status: Valid Indian Mobile • Duplicate Check: PASS</p>
              </div>
            </div>
          </div>

          {/* Feature 2: Multi-Tower Inventory Matrix */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 p-6 bg-slate-900 rounded-3xl text-white space-y-3 shadow-xl">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Inventory Hold Guard</span>
              <p className="text-sm font-bold">Hold Expiry TTL State Machine</p>
              <div className="p-3 bg-slate-800 rounded-xl font-mono text-xs space-y-1 text-slate-300">
                <p>Unit: Tower B - 801 (4BHK Luxury)</p>
                <p>Status: ON_HOLD (Token ₹1,00,000 received)</p>
                <p>Held Until: 2026-10-18T11:00:00 (Expires in 24h)</p>
                <p className="text-amber-400">Auto-Expiry: Active • Prevents double-booking</p>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                2. Real-Time Inventory Matrix & Hold Expiry
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                In high-demand projects like PR7 Zirakpur and Mohali Aerocity, double-selling a flat is disastrous for customer trust.
                RealtyOS enforces atomic database status transitions (Available, On Hold, Booked, Sold) with configurable hold TTL countdowns.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tower, floor, and unit-type matrix view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic background expiry of unconfirmed holds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complete status change audit history with agent attribution</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Site Visit Scheduler */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                3. Site Visit Appointments & Outcome Tracking
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Site visits are the single highest predictor of closed deals in real estate. Our visit scheduling engine
                prevents double-booking sales representatives, dispatches automated WhatsApp reminders with location pins,
                and captures visit outcomes (Negotiating, Price Quote, Not Interested).
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conflict detection: Alert if agent is already booked for that timeslot</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic progression of lead pipeline stage upon visit completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Agenda and calendar views for site experience centers</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-3 shadow-xl">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Automated Dispatch</span>
              <p className="text-sm font-bold">WhatsApp Site Visit Invitation</p>
              <div className="p-3 bg-slate-800 rounded-xl text-xs space-y-1 text-slate-300">
                <p className="text-emerald-400 font-semibold">To: +91 98150 12345 (Amaninder Singh)</p>
                <p className="italic text-[11px] text-slate-300">
                  "Hello Amaninder, your site visit for Sushma Grande Zirakpur has been confirmed for 18 Oct at 11:30 AM.
                  Our consultant will meet you at the site experience centre. Location: https://maps.google.com/?q=Sushma+Grande"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
