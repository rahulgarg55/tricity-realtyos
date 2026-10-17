import React from "react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <main className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Cookie Policy & Technology Audit
          </span>
          <h1 className="text-3xl font-black text-slate-900">Cookie Policy</h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 17, 2026 • Transparent Cookie Governance
          </p>
        </div>

        <div className="prose prose-slate text-xs space-y-6 leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device to ensure secure authentication,
              remember organization preferences, and analyze platform performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Categories of Cookies Used</h2>
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Essential / Strictly Necessary (Cannot be disabled)</span>
                <p>
                  Includes <code className="font-mono text-blue-600">tricity_session</code> (HttpOnly, Secure, SameSite=Lax).
                  Used to keep you securely signed in to your organization workspace and enforce CSRF protection.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Performance & Diagnostics (Optional)</span>
                <p>
                  Measures page loading speeds, inventory search latency, and backend API performance.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Marketing & Attribution (Optional)</span>
                <p>
                  Tracks channel attribution for inbound demo requests and real estate conference campaigns.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Managing and Withdrawing Consent</h2>
            <p>
              You can modify or withdraw non-essential cookie permissions at any time via the Cookie Consent Banner
              at the bottom of our pages, or by clearing cookies in your browser settings.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
