import React from "react";
import { prisma } from "@/lib/db";
import { Building, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          leads: true,
          projects: true,
          inventoryUnits: true,
          siteVisits: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Organization Tenancy Directory</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tenant database boundaries, subscription limits, and enterprise overrides
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Organization</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Plan / Status</th>
              <th className="px-5 py-3.5">Limits (Users/Leads/Projects)</th>
              <th className="px-5 py-3.5">Current Usage</th>
              <th className="px-5 py-3.5">WhatsApp API</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-800/30">
                <td className="px-5 py-4">
                  <span className="font-bold text-white block">{org.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{org.slug}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-slate-300 block">{org.city}, {org.state}</span>
                  <span className="text-[10px] text-slate-500">{org.address || "Tricity"}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300 mr-2">
                    {org.subscriptionTier}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300">
                    {org.subscriptionStatus}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {org.maxUsers} Users • {org.maxLeads} Leads • {org.maxProjects} Projects
                </td>
                <td className="px-5 py-4 text-slate-300 font-medium">
                  {org._count.users} Users • {org._count.leads} Leads • {org._count.inventoryUnits} Units
                </td>
                <td className="px-5 py-4">
                  {org.whatsappEnabled ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Sandbox Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
