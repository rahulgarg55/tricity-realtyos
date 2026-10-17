import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { parseAndValidateLeadCsv } from "@/lib/csv";
import { checkPlanLimits } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canImportLeads) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to import leads" },
        { status: 403 }
      );
    }

    const { csvContent } = await req.json();
    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'csvContent' parameter" }, { status: 400 });
    }

    // Fetch existing phone numbers in organization to avoid duplicates
    const existingLeads = await prisma.lead.findMany({
      where: { organizationId: user.organizationId!, isArchived: false },
      select: { phone: true },
    });
    const existingPhoneSet = new Set(existingLeads.map((l) => l.phone));

    // Parse and validate
    const { validLeads, errors, duplicates } = parseAndValidateLeadCsv(csvContent, existingPhoneSet);

    if (validLeads.length === 0) {
      return NextResponse.json({
        success: false,
        importedCount: 0,
        errors,
        duplicates,
        message: "No valid leads could be processed from the CSV.",
      });
    }

    // Check plan limits
    const limitCheck = await checkPlanLimits(user.organizationId!, "leads");
    if (limitCheck.current + validLeads.length > limitCheck.max) {
      return NextResponse.json(
        {
          error: `Importing ${validLeads.length} leads exceeds your plan limit (${limitCheck.current}/${limitCheck.max}). Please upgrade your plan.`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Insert leads
    const createdLeads = await prisma.$transaction(
      validLeads.map((item) =>
        prisma.lead.create({
          data: {
            organizationId: user.organizationId!,
            name: item.name,
            phone: item.phone,
            email: item.email || null,
            preferredLocation: item.preferredLocation || null,
            budgetMax: item.budgetMax || null,
            propertyType: item.propertyType || null,
            leadSource: item.leadSource || "CSV Import",
            assignedUserId: user.id,
            notes: item.notes || null,
          },
        })
      )
    );

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "BULK_IMPORT",
      entityType: "Lead",
      details: {
        importedCount: createdLeads.length,
        duplicateCount: duplicates.length,
        errorCount: errors.length,
      },
    });

    return NextResponse.json({
      success: true,
      importedCount: createdLeads.length,
      duplicateCount: duplicates.length,
      errorCount: errors.length,
      duplicates,
      errors,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("CSV import error:", error);
    return NextResponse.json({ error: "Failed to process CSV import" }, { status: 500 });
  }
}
