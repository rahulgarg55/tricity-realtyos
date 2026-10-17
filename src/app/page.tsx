import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import {
  Building2,
  Users,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Check,
  FileSpreadsheet,
  IndianRupee,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* Tricity pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Engineered specifically for Chandigarh, Mohali, Zirakpur, Panchkula & New Chandigarh</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              The Complete <span className="text-blue-600">Lead-to-Site-Visit</span> & Property Sales OS
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop losing high-value property buyers. Tricity RealtyOS combines multi-tower inventory
              holds, WhatsApp automation, and site visit scheduling into a purpose-built B2B SaaS for
              Tricity builders, channel partners, and brokers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/book-demo"
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Schedule a 1-on-1 Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
              >
                <span>Explore Live Demo Persona</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Tenant Isolation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Meta WhatsApp Cloud API
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> RERA Compliance Ready
              </span>
            </div>
          </div>

          {/* Interactive Feature Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 p-2 sm:p-4">
            <div className="bg-slate-950 rounded-xl p-4 sm:p-6 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs text-slate-400 font-mono">Tricity RealtyOS • Live Command Centre</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">
                  Sushma Urban (Zirakpur)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Active Leads</span>
                  <span className="text-xl font-bold text-white mt-1 block">142</span>
                  <span className="text-[10px] text-emerald-400">PR7, Aerocity, New Chd</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Upcoming Visits</span>
                  <span className="text-xl font-bold text-purple-400 mt-1 block">18</span>
                  <span className="text-[10px] text-slate-400">Next 7 Days Scheduled</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Units On Hold</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">6 Units</span>
                  <span className="text-[10px] text-amber-300">Auto-Expiry TTL Guard</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Confirmed Value</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">₹21.3 Cr</span>
                  <span className="text-[10px] text-emerald-300">Booked & Sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tricity Micro-Markets Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Built for Tricity's Fastest-Growing Real Estate Corridors</h2>
            <p className="text-xs text-slate-600">
              Unlike generic international CRMs, RealtyOS comes pre-configured with Tricity localities, sectors, and developer projects.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-blue-600 font-bold text-sm block">Mohali</span>
              <p className="text-[11px] text-slate-500">Aerocity, IT City, Sector 82 & Sector 88 luxury towers</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-blue-600 font-bold text-sm block">Zirakpur</span>
              <p className="text-[11px] text-slate-500">PR7 Airport Ring Road, VIP Road, High-rise residences</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-blue-600 font-bold text-sm block">Chandigarh</span>
              <p className="text-[11px] text-slate-500">Sectors 1–48, Commercial SCOs in Sector 34 & 35</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-blue-600 font-bold text-sm block">New Chandigarh</span>
              <p className="text-[11px] text-slate-500">Eco City, Medicity, Lake-view luxury plotted townships</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-blue-600 font-bold text-sm block">Panchkula</span>
              <p className="text-[11px] text-slate-500">MDC, Sector 20, Pinjore-Kalka foothill gated villas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Everything Your Real Estate Sales Engine Demands
            </h2>
            <p className="text-sm text-slate-600">
              Eliminate lead leakage, double bookings, and forgotten customer follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Intelligent Lead CRM</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic +91 Indian phone normalization, duplicate detection, and formula-injection-safe CSV import/export.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Site Visit Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule property walkthroughs without agent slot conflicts. Auto-advance pipeline stages and record outcomes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Meta WhatsApp Cloud API</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verified WhatsApp business templates with HMAC SHA256 webhook signatures, automated visit invitations, and brochures.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Inventory Matrix & Hold TTL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-tower unit grid (Available, On Hold, Booked, Sold). Never double-sell a flat with strict hold expiration rules.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">8-Stage Deal Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kanban deal tracking from New Lead to Site Visit, Negotiation, and Confirmed Booking with projected revenue analytics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Multi-Tenancy & DPDP Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict database isolation across brokerages and builders. Granular role permissions (Owner, Manager, Sales Rep).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Accelerate Your Tricity Real Estate Sales?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Join premier builders and brokers across Chandigarh, Mohali, and Zirakpur. Onboard your sales team today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Free Trial (14 Days)
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors"
            >
              View Pricing Packages
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
