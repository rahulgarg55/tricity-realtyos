import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ShieldAlert,
  Building,
  Activity,
  FileText,
  ArrowLeft,
  Server,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || (!user.isSuperAdmin && user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Super Admin Dark Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Super Admin</h1>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
              Platform Governance
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Platform Overview</span>
          </Link>
          <Link
            href="/admin/organizations"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Building className="w-4 h-4 text-blue-400" />
            <span>Organizations ({await prisma.organization.count()})</span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Audit Trail</span>
          </Link>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tenant CRM</span>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300">{user.name}</p>
          <p className="text-[10px] text-amber-400">System Administrator</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>

      <DemoSwitcher />
    </div>
  );
}
