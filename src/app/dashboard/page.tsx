import React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import {
  Users,
  AlertCircle,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PhoneCall,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await requireTenantUser();
  const orgId = user.organizationId!;
  const now = new Date();
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    overdueTasks,
    upcomingVisits,
    leadsByStage,
    inventorySummary,
    urgentTasksList,
    upcomingVisitsList,
  ] = await Promise.all([
    prisma.lead.count({ where: { organizationId: orgId, isArchived: false } }),
    prisma.taskFollowUp.count({
      where: { organizationId: orgId, isCompleted: false, dueDate: { lt: now } },
    }),
    prisma.siteVisit.count({
      where: {
        organizationId: orgId,
        scheduledDate: { gte: now, lte: sevenDaysAhead },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
    }),
    prisma.lead.groupBy({
      by: ["stage"],
      where: { organizationId: orgId, isArchived: false },
      _count: { id: true },
      _sum: { expectedRevenue: true },
    }),
    prisma.inventoryUnit.groupBy({
      by: ["status"],
      where: { organizationId: orgId },
      _count: { id: true },
      _sum: { askingPrice: true },
    }),
    prisma.taskFollowUp.findMany({
      where: { organizationId: orgId, isCompleted: false, dueDate: { lt: now } },
      include: { lead: { select: { name: true, phone: true } }, assignedUser: { select: { name: true } } },
      take: 4,
      orderBy: { dueDate: "asc" },
    }),
    prisma.siteVisit.findMany({
      where: {
        organizationId: orgId,
        scheduledDate: { gte: now },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: {
        lead: { select: { name: true, phone: true } },
        project: { select: { name: true, location: true } },
        assignedUser: { select: { name: true } },
      },
      take: 4,
      orderBy: { scheduledDate: "asc" },
    }),
  ]);

  const bookedVal = inventorySummary.find((s) => s.status === "BOOKED")?._sum.askingPrice || 0;
  const soldVal = inventorySummary.find((s) => s.status === "SOLD")?._sum.askingPrice || 0;
  const totalBookingValue = bookedVal + soldVal;

  const bookedCount = leadsByStage.find((s) => s.stage === "BOOKING")?._count.id || 0;
  const wonCount = leadsByStage.find((s) => s.stage === "WON")?._count.id || 0;
  const conversionRate = totalLeads > 0 ? (((bookedCount + wonCount) / totalLeads) * 100).toFixed(1) : "0.0";

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Real Estate Sales Overview"
        subtitle={`Live metrics for ${user.organization?.name} (${user.organization?.city})`}
      />

      <div className="p-6 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Leads */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Active Leads</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" /> All Tricity micro-markets
              </p>
            </div>
          </div>

          {/* Card 2: Overdue Follow-ups */}
          <div className={`p-4 rounded-2xl border shadow-sm space-y-2 ${
            overdueTasks > 0 ? "bg-red-50/50 border-red-200" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Overdue Follow-ups</span>
              <div className={`p-2 rounded-xl ${overdueTasks > 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold ${overdueTasks > 0 ? "text-red-700" : "text-slate-900"}`}>
                {overdueTasks}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Requires immediate agent callback</p>
            </div>
          </div>

          {/* Card 3: Upcoming Site Visits */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Upcoming Visits</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{upcomingVisits}</p>
              <p className="text-[11px] text-slate-500 mt-1">Next 7 days on-site</p>
            </div>
          </div>

          {/* Card 4: Confirmed Booking Value */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Confirmed Value</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatINR(totalBookingValue)}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Booked & Sold Units</p>
            </div>
          </div>

          {/* Card 5: Conversion Rate */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Lead Conversion</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{conversionRate}%</p>
              <p className="text-[11px] text-slate-500 mt-1">Inquiry to Booking</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Pipeline & Inventory breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Breakdown */}
          <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pipeline Stages & Revenue Exposure</h3>
                <p className="text-xs text-slate-500">Active deal distribution across stages</p>
              </div>
              <Link
                href="/dashboard/pipeline"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Kanban View <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {leadsByStage.map((stage) => {
                const count = stage._count.id;
                const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                return (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{stage.stage.replace(/_/g, " ")}</span>
                      <span>
                        {count} leads ({formatINR(stage._sum.expectedRevenue || 0)})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Inventory Status</h3>
                <p className="text-xs text-slate-500">Real-time unit availability</p>
              </div>
              <Link
                href="/dashboard/inventory"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Matrix <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {inventorySummary.map((inv) => {
                let badgeClass = "bg-emerald-100 text-emerald-800";
                if (inv.status === "ON_HOLD") badgeClass = "bg-amber-100 text-amber-800";
                if (inv.status === "BOOKED") badgeClass = "bg-blue-100 text-blue-800";
                if (inv.status === "SOLD") badgeClass = "bg-slate-100 text-slate-800";

                return (
                  <div
                    key={inv.status}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                        {inv.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{inv._count.id} Units</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatINR(inv._sum.askingPrice || 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Urgent Follow-ups & Site Visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent Follow-ups */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-slate-900">Immediate Follow-ups</h3>
              </div>
              <Link href="/dashboard/tasks" className="text-xs text-blue-600 font-medium">
                View All
              </Link>
            </div>

            {urgentTasksList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No overdue follow-ups! Great job.</p>
            ) : (
              <div className="space-y-2">
                {urgentTasksList.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-red-50/40 border border-red-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{t.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Lead: {t.lead?.name || "Unassigned"} ({t.lead?.phone}) • Rep: {t.assignedUser?.name}
                      </p>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                      Overdue
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Visits */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Site Visits</h3>
              </div>
              <Link href="/dashboard/site-visits" className="text-xs text-blue-600 font-medium">
                Calendar View
              </Link>
            </div>

            {upcomingVisitsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No visits scheduled for this week.</p>
            ) : (
              <div className="space-y-2">
                {upcomingVisitsList.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{v.project.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Client: {v.lead.name} ({v.lead.phone}) • Slot: {v.timeSlot}
                      </p>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                      {new Date(v.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
