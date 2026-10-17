import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Building,
  Users,
  IndianRupee,
  Activity,
  Server,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [totalOrgs, totalUsers, totalLeads, activeOrgs, invoices] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.lead.count(),
    prisma.organization.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.subscriptionInvoice.findMany({ where: { status: "PAID" } }),
  ]);

  const totalMRR = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  const orgs = await prisma.organization.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true, leads: true, projects: true } },
    },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Platform Operations & SaaS Health</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Global multi-tenant governance across Chandigarh, Mohali, Zirakpur, Panchkula & New Chandigarh
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Tenant Organizations</span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalOrgs}</p>
          <p className="text-[11px] text-emerald-400 font-medium">{activeOrgs} Active Subscriptions</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Platform Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
          <p className="text-[11px] text-slate-400">Across all builders & brokers</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Managed Leads</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalLeads}</p>
          <p className="text-[11px] text-slate-400">Tricity Property Inquiries</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">B2B SaaS Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">₹{totalMRR.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-emerald-400 font-medium">Commercial Subscriptions</p>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Active Organizations</h3>
          <Link
            href="/admin/organizations"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Manage All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Plan Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white">{org.name}</td>
                  <td className="px-4 py-3 text-slate-400">{org.city}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300">
                      {org.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300">
                      {org.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{org._count.users}</td>
                  <td className="px-4 py-3">{org._count.leads}</td>
                  <td className="px-4 py-3">{org._count.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
