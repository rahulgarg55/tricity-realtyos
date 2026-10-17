import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Users, CheckCircle2, ArrowRight, Phone, MessageSquare, ShieldCheck } from "lucide-react";

export default function BrokerSolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Tailored for Channel Partners & Property Dealers
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Scale Your Brokerage Across Chandigarh, Mohali & Zirakpur
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Whether you are an independent property consultant in Sector 34 Chandigarh or an established channel
              partner firm with 15 sales reps on PR7 Zirakpur, RealtyOS gives you the professional discipline of a corporate sales organization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">Zero Overdue Follow-ups</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Most brokers lose deals simply because agents forget to call clients back within 24 hours.
                Our urgent follow-up notifications and daily dashboard agenda keep your team accountable.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">Multi-Project Visibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Showcase verified inventory across Sushma, Omaxe, Homeland, Manohar, and Hero Homes in one catalog.
                Instantly match buyer budgets to available 2BHK, 3BHK, or luxury villa options.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900">Instant WhatsApp Brochures</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send official project PDFs, payment schedules, and Google Maps location pins with 1-click official
                WhatsApp templates right from your CRM.
              </p>
            </div>
          </div>

          <div className="p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to empower your brokerage sales team?</h3>
              <p className="text-xs text-blue-100">Starter package begins at ₹4,999/month with 14-day free trial.</p>
            </div>
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-md"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
