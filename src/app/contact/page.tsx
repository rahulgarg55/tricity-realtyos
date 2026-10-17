"use client";

import React, { useState } from "react";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { MarketingFooter } from "@/components/MarketingFooter";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Mohali",
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
        body: JSON.stringify({
          ...formData,
          organizationType: "General Contact Inquiry",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit message");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <MarketingNavbar />

      <section className="py-16 bg-gradient-to-b from-blue-50/50 via-white to-white flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              Tricity Office & Support
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Get in Touch with RealtyOS</h1>
            <p className="text-xs text-slate-600">
              Have questions about platform integration, WhatsApp Business onboarding, or multi-tenant deployment?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Headquarters & Experience Hub</h3>
                    <p className="text-slate-600 mt-0.5">
                      Tricity RealtyOS Hub, Sector 82, JLPL Industrial & IT Park, Mohali, Punjab 160055
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Direct Phone & WhatsApp Support</h3>
                    <p className="text-slate-600 mt-0.5">+91 172 400 1122 / +91 98140 11111</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Email Inquiries</h3>
                    <p className="text-slate-600 mt-0.5">support@tricityrealtyos.com / sales@tricityrealtyos.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-600 text-white rounded-lg shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Operating Hours</h3>
                    <p className="text-slate-600 mt-0.5">Monday – Saturday: 9:30 AM to 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full w-fit mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600">
                    We'll respond to your inquiry within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <h3 className="text-base font-bold text-slate-900">Send an Inquiry</h3>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="rahul@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Message / Requirements</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about your team size, projects, or specific features needed..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                  >
                    {loading ? "Sending..." : "Submit Inquiry"}
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
