import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { generateCsvString } from "@/lib/csv";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canExportLeads) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to export leads" },
        { status: 403 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: {
        organizationId: user.organizationId!,
        isArchived: false,
      },
      include: {
        project: { select: { name: true } },
        assignedUser: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Lead ID",
      "Full Name",
      "Phone Number",
      "Email Address",
      "Preferred Location",
      "Property Type",
      "Budget (Max INR)",
      "Project Interest",
      "Lead Source",
      "Priority",
      "Pipeline Stage",
      "Assigned Agent",
      "Next Follow-up Date",
      "Created At",
    ];

    const rows = leads.map((l) => [
      l.id,
      l.name,
      l.phone,
      l.email || "",
      l.preferredLocation || "",
      l.propertyType || "",
      l.budgetMax ? l.budgetMax.toString() : "",
      l.project?.name || "",
      l.leadSource,
      l.priority,
      l.stage,
      l.assignedUser?.name || "Unassigned",
      l.nextFollowUpDate ? l.nextFollowUpDate.toISOString().split("T")[0] : "",
      l.createdAt.toISOString().split("T")[0],
    ]);

    const csvContent = generateCsvString(headers, rows);

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "EXPORT_LEADS",
      entityType: "Lead",
      details: { exportCount: leads.length },
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tricity_leads_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Export leads error:", error);
    return NextResponse.json({ error: "Failed to export leads" }, { status: 500 });
  }
}
