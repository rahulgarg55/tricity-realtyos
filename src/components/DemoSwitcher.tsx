"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Sparkles, ChevronDown, Check } from "lucide-react";

const DEMO_USERS = [
  {
    roleName: "Builder Owner",
    name: "Prateek Mittal",
    email: "owner@sushmagroup.com",
    org: "Sushma Urban Developers (Zirakpur)",
    tier: "BUSINESS",
    target: "/dashboard",
  },
  {
    roleName: "Sales Rep",
    name: "Rahul Garg",
    email: "rahul.sales@sushmagroup.com",
    org: "Sushma Urban Developers",
    tier: "BUSINESS",
    target: "/dashboard/leads",
  },
  {
    roleName: "Brokerage Owner",
    name: "Amit Bansal",
    email: "owner@primechd.com",
    org: "Tricity Prime Brokers (Chandigarh)",
    tier: "GROWTH",
    target: "/dashboard",
  },
  {
    roleName: "Platform Super Admin",
    name: "Tricity Platform Admin",
    email: "superadmin@tricityrealty.com",
    org: "Global Platform",
    tier: "SUPER_ADMIN",
    target: "/admin",
  },
];

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleQuickLogin = async (email: string, target: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "TricityPass123!" }),
      });

      if (res.ok) {
        setOpen(false);
        router.push(target);
        router.refresh();
      } else {
        alert("Quick demo login failed. Check database seed.");
      }
    } catch (e) {
      alert("Network error during demo login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 text-xs font-semibold transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Demo Role Switcher</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-2 z-50 text-slate-800">
            <div className="px-2 py-1 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                1-Click Persona Login
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                Instant Demo
              </span>
            </div>

            <div className="space-y-1.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleQuickLogin(user.email, user.target)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600">
                        {user.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {user.roleName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.org}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
              Password for all seeded accounts: <code className="font-bold">TricityPass123!</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
