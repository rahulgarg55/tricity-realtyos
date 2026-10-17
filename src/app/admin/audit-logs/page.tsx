import React from "react";
import { prisma } from "@/lib/db";
import { ShieldAlert, Clock, User, Building } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const auditLogs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Platform Audit Trail & Security Logs</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time log of security events, stage modifications, lead bulk operations, and payments
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Tenant Organization</th>
              <th className="px-5 py-3.5">Entity</th>
              <th className="px-5 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/50 text-amber-300 font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-medium">
                    {log.organization?.name || "Global System"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{log.entityType}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                    {log.details || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
