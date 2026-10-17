import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Building2, CheckCircle2, ShieldCheck, ArrowRight, BarChart3 } from "lucide-react";

export default function BuilderSolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Tailored for Township Developers & Builders
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Enterprise Inventory Control & Sales Discipline for Developers
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Managing 500+ units across multiple residential towers in Mohali, New Chandigarh, or Zirakpur
              requires real-time inventory locking, token hold expiry guards, and strict sales team attribution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">Atomic Hold & Booking Locks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevent internal sales reps and external channel partners from promising the same flat to two clients.
                Temporary reservations expire automatically after 24 or 48 hours unless converted to confirmed bookings.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">Sales Velocity & Conversion Funnel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track inquiry-to-visit and visit-to-booking conversion rates per project. Compare sales manager performance,
                measure channel partner contributions, and monitor confirmed booking cash flows.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">RERA & Compliance Ready</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record official Punjab RERA and Haryana RERA registration identifiers, carpet areas vs super areas,
                and maintain immutable audit logs of every status change and customer interaction.
              </p>
            </div>
          </div>

          <div className="p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Deploy Tricity RealtyOS for your upcoming township launch</h3>
              <p className="text-xs text-slate-400">Enterprise tier supports up to 50 sales team members and unlimited units.</p>
            </div>
            <Link
              href="/book-demo"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              Request Developer Demo
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
