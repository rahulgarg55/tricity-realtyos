import React from "react";
import Link from "next/link";
import { Building2, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Tricity <span className="text-blue-500">RealtyOS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier lead-to-site-visit & property inventory management OS built specifically for
              real estate developers, channel partners, and brokers across Chandigarh, Mohali, Zirakpur,
              Panchkula, and New Chandigarh.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Multi-Tenant Architecture • DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Micro-Markets Served */}
          <div className="space-y-3">
            <p className="font-semibold text-white text-xs uppercase tracking-wider">Tricity Markets</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Mohali (Aerocity, IT City, Sec 82)</li>
              <li>Zirakpur (PR7 Airport Ring Rd, VIP Rd)</li>
              <li>Chandigarh (Sectors 1–48)</li>
              <li>New Chandigarh (Medicity, Eco City)</li>
              <li>Panchkula (MDC, Sec 20, Pinjore)</li>
            </ul>
          </div>

          {/* Solutions & Product */}
          <div className="space-y-3">
            <p className="font-semibold text-white text-xs uppercase tracking-wider">Product</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Lead Management CRM
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Property Inventory Matrix
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Site Visit Scheduling
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Official WhatsApp Cloud API
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Subscription Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <p className="font-semibold text-white text-xs uppercase tracking-wider">Legal & Compliance</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (India)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Tricity RealtyOS. All rights reserved. Built for Tricity Real Estate.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> Sector 82, Mohali, Punjab 160055
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 172 400 1122
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
