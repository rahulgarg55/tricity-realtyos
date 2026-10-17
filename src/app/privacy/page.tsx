import React from "react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <main className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Compliance & Privacy Notice
          </span>
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 17, 2026 • Governed by the Digital Personal Data Protection Act (DPDP), 2023 (India)
          </p>
        </div>

        <div className="prose prose-slate text-xs space-y-6 leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Commitment to Data Privacy</h2>
            <p>
              Tricity RealtyOS ("we", "us", or "our") is dedicated to protecting the personal data of our SaaS
              customers (builders, brokers, property dealers) and their customer prospects in Chandigarh, Mohali,
              Zirakpur, Panchkula, and New Chandigarh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Data We Collect</h2>
            <p>
              When utilizing our platform, we process:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Identifiers:</strong> Name, work email, phone number, and password hashes for authentication.</li>
              <li><strong>Tenant Leads & Prospects:</strong> Customer names, normalized phone numbers (+91), property preferences, budget brackets, and interaction notes entered into your isolated organization workspace.</li>
              <li><strong>WhatsApp Cloud API Logs:</strong> Delivery receipts, template interaction history, and communication timestamps for customer inquiry tracking.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Strict Multi-Tenant Data Isolation</h2>
            <p>
              Each organization's leads, projects, site visits, and inventory records are logically isolated.
              Under no circumstances does one real estate organization have access to another organization's customer leads or pricing negotiations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Your Rights under Indian Law (DPDP Act 2023)</h2>
            <p>
              In accordance with Indian privacy regulations, data principals have the right to request:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access and summary of personal data held.</li>
              <li>Correction, completion, or updating of inaccurate records.</li>
              <li>Erasure of personal information no longer required for real estate sales fulfillment.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">5. Contact Our Data Protection Officer (DPO)</h2>
            <p>
              For privacy inquiries, audit requests, or data deletion petitions, contact our compliance office at{" "}
              <a href="mailto:privacy@tricityrealtyos.com" className="text-blue-600 underline">
                privacy@tricityrealtyos.com
              </a>{" "}
              or at our physical office: Sector 82, Mohali, Punjab 160055.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
