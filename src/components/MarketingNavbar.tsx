"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Tricity <span className="text-blue-600">RealtyOS</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                B2B SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link href="/features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <div className="relative group">
              <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1 transition-colors">
                Solutions
              </span>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <Link
                  href="/solutions/brokers"
                  className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  For Brokers & Dealers
                </Link>
                <Link
                  href="/solutions/builders"
                  className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  For Builders & Developers
                </Link>
              </div>
            </div>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/book-demo"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 flex items-center gap-1.5 transition-all"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Features
          </Link>
          <Link
            href="/solutions/brokers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Solutions for Brokers
          </Link>
          <Link
            href="/solutions/builders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Solutions for Builders
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/book-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
