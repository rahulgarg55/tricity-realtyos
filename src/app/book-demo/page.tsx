"use client";

import React, { useState } from "react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { CalendarCheck, Phone, CheckCircle2, Building, ShieldCheck } from "lucide-react";

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    organizationType: "Channel Partner / Brokerage",
    city: "Mohali",
    teamSize: "6-15",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit request");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="py-16 bg-gradient-to-b from-blue-50/50 via-white to-white flex-1 flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left information */}
            <div className="space-y-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                Private Product Walkthrough
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Experience Tricity RealtyOS in Action
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                See how our multi-tower inventory matrix, WhatsApp automation, and site visit scheduler
                help top real estate teams in Chandigarh, Mohali, and Zirakpur close 35% more units.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>20-minute tailored walkthrough of your sales pipeline</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live demonstration of hold auto-expiry & duplicate prevention</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom onboarding roadmap for your Tricity sales team</span>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full w-fit mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Demo Scheduled!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our Tricity
                    onboarding director will call you on <span className="font-semibold text-slate-900">{formData.phone}</span> within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Book Your Session</h3>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaswinder Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile (+91) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 98140 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Business Type</label>
                      <select
                        value={formData.organizationType}
                        onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                      >
                        <option value="Channel Partner / Brokerage">Channel Partner / Broker</option>
                        <option value="Builder / Developer">Real Estate Developer</option>
                        <option value="Sole Consultant">Independent Agent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Primary Market</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                      >
                        <option value="Mohali">Mohali</option>
                        <option value="Zirakpur">Zirakpur</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="New Chandigarh">New Chandigarh</option>
                        <option value="Panchkula">Panchkula</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Sales Team Size</label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                    >
                      <option value="1-5">1–5 Sales Agents</option>
                      <option value="6-15">6–15 Agents & Managers</option>
                      <option value="16-50">16–50 Sales Executives</option>
                      <option value="50+">50+ Enterprise Team</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all text-xs"
                  >
                    {loading ? "Scheduling..." : "Confirm Demo Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <DemoSwitcher />
    </div>
  );
}
