import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireTenantUser();
    const orgId = user.organizationId!;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      totalLeads,
      newLeads7Days,
      overdueTasks,
      upcomingVisits,
      completedVisits,
      cancelledOrNoShowVisits,
      leadsByStage,
      inventorySummary,
      leadSources,
      salesTeam,
    ] = await Promise.all([
      // 1. Total active leads
      prisma.lead.count({
        where: { organizationId: orgId, isArchived: false },
      }),

      // 2. New leads last 7 days
      prisma.lead.count({
        where: {
          organizationId: orgId,
          isArchived: false,
          createdAt: { gte: sevenDaysAgo },
        },
      }),

      // 3. Overdue follow-up tasks
      prisma.taskFollowUp.count({
        where: {
          organizationId: orgId,
          isCompleted: false,
          dueDate: { lt: now },
        },
      }),

      // 4. Upcoming site visits
      prisma.siteVisit.count({
        where: {
          organizationId: orgId,
          scheduledDate: { gte: now, lte: sevenDaysAhead },
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
      }),

      // 5. Completed visits
      prisma.siteVisit.count({
        where: {
          organizationId: orgId,
          status: "COMPLETED",
        },
      }),

      // 6. Cancelled or No Show visits
      prisma.siteVisit.count({
        where: {
          organizationId: orgId,
          status: { in: ["CANCELLED", "NO_SHOW"] },
        },
      }),

      // 7. Leads grouped by stage
      prisma.lead.groupBy({
        by: ["stage"],
        where: { organizationId: orgId, isArchived: false },
        _count: { id: true },
        _sum: { expectedRevenue: true },
      }),

      // 8. Inventory unit summary
      prisma.inventoryUnit.groupBy({
        by: ["status"],
        where: { organizationId: orgId },
        _count: { id: true },
        _sum: { askingPrice: true, bookingAmount: true },
      }),

      // 9. Lead sources breakdown
      prisma.lead.groupBy({
        by: ["leadSource"],
        where: { organizationId: orgId, isArchived: false },
        _count: { id: true },
      }),

      // 10. Team performance
      prisma.user.findMany({
        where: { organizationId: orgId, isActive: true },
        select: {
          id: true,
          name: true,
          role: true,
          _count: {
            select: {
              assignedLeads: true,
              assignedVisits: true,
              assignedTasks: true,
            },
          },
        },
      }),
    ]);

    // Calculate confirmed booking value
    const bookedUnits = inventorySummary.find((s) => s.status === "BOOKED");
    const soldUnits = inventorySummary.find((s) => s.status === "SOLD");
    const onHoldUnits = inventorySummary.find((s) => s.status === "ON_HOLD");

    const totalConfirmedBookingValue =
      (bookedUnits?._sum?.askingPrice || 0) + (soldUnits?._sum?.askingPrice || 0);

    // Calculate conversion rate: Won or Booked / Total Leads
    const bookedLeads =
      leadsByStage.find((s) => s.stage === "BOOKING")?._count.id || 0;
    const wonLeads = leadsByStage.find((s) => s.stage === "WON")?._count.id || 0;
    const conversionRate =
      totalLeads > 0 ? (((bookedLeads + wonLeads) / totalLeads) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      overview: {
        totalLeads,
        newLeads7Days,
        overdueTasks,
        upcomingVisits,
        completedVisits,
        missedVisits: cancelledOrNoShowVisits,
        totalConfirmedBookingValue,
        conversionRate: `${conversionRate}%`,
      },
      pipelineDistribution: leadsByStage.map((s) => ({
        stage: s.stage,
        count: s._count.id,
        revenue: s._sum.expectedRevenue || 0,
      })),
      inventoryStatus: inventorySummary.map((s) => ({
        status: s.status,
        count: s._count.id,
        totalValue: s._sum.askingPrice || 0,
      })),
      leadSources: leadSources.map((s) => ({
        source: s.leadSource,
        count: s._count.id,
      })),
      teamPerformance: salesTeam,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
