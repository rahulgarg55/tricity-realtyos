"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Settings, Check, X } from "lucide-react";

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tricity_cookie_consent");
    if (!saved) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "tricity_cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setIsOpen(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      "tricity_cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "tricity_cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: analyticsAllowed,
        marketing: marketingAllowed,
        timestamp: new Date().toISOString(),
      })
    );
    setShowCustomize(false);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur border-t border-slate-800 text-slate-200 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        {!showCustomize ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-white">Your Privacy & Cookie Choices</p>
                <p className="text-slate-400 leading-relaxed max-w-3xl">
                  We use cookies and secure session tokens to ensure our real estate CRM operates reliably,
                  protect your tenant data, and analyze platform performance. In accordance with Indian DPDP Act 2023,
                  you have full control over non-essential cookies. Read our{" "}
                  <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/cookies" className="text-blue-400 underline hover:text-blue-300">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={() => setShowCustomize(true)}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Customize
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Cookie Consent Preferences</h3>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Essential (Required)</span>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-900/50 text-emerald-400 rounded border border-emerald-700/50 font-medium">
                    Always Active
                  </span>
                </div>
                <p className="text-slate-400">
                  Required for secure multi-tenant sessions, CSRF protection, and account authentication.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Performance & Analytics</span>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-0"
                  />
                </div>
                <p className="text-slate-400">
                  Helps us measure dashboard latency, lead search speed, and resolve technical issues.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Marketing & Attribution</span>
                  <input
                    type="checkbox"
                    checked={marketingAllowed}
                    onChange={(e) => setMarketingAllowed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-0"
                  />
                </div>
                <p className="text-slate-400">
                  Allows tracking of campaign source attribution for real estate demo requests.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowCustomize(false)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
