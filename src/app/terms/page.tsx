import React from "react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <main className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Commercial SaaS Terms
          </span>
          <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 17, 2026 • Commercial Agreement for B2B Customers
          </p>
        </div>

        <div className="prose prose-slate text-xs space-y-6 leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By subscribing to or using Tricity RealtyOS, your real estate organization agrees to these terms.
              If you are registering on behalf of a builder, brokerage, or partnership firm, you warrant that you
              possess the legal authority to bind the organization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. SaaS Subscription & Recurring Billing</h2>
            <p>
              Subscriptions (Starter, Growth, Business) are billed in Indian Rupees (INR ₹) on a recurring monthly or annual basis.
              Invoices are issued automatically. Upgrades take effect immediately with pro-rata adjustments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Acceptable Use & Anti-Spam Policy</h2>
            <p>
              Customers must not utilize WhatsApp messaging integrations or email features for unsolicited bulk spam.
              All property leads must be legitimately obtained through lawful real estate marketing channels, direct inquiries, or authorized portals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Service Availability & SLA</h2>
            <p>
              We target 99.9% platform availability. Regular database backups, zero-downtime schema migrations,
              and failover monitoring are maintained to ensure uninterrupted sales operations during peak weekend property visits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive
              jurisdiction of the competent courts in Chandigarh / Mohali (Punjab).
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
