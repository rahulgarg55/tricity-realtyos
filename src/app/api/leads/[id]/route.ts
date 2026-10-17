import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

const UpdateLeadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  preferredLocation: z.string().optional().nullable(),
  budgetMin: z.number().optional().nullable(),
  budgetMax: z.number().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "HOT"]).optional(),
  stage: z.string().optional(),
  assignedUserId: z.string().optional().nullable(),
  expectedRevenue: z.number().optional().nullable(),
  lostReason: z.string().optional().nullable(),
  lostNotes: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    const lead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId!,
      },
      include: {
        project: true,
        assignedUser: { select: { id: true, name: true, email: true, phone: true } },
        siteVisits: {
          include: {
            project: { select: { name: true } },
            inventoryUnit: { select: { unitNumber: true } },
            assignedUser: { select: { name: true } },
          },
          orderBy: { scheduledDate: "desc" },
        },
        tasks: {
          include: {
            assignedUser: { select: { name: true } },
          },
          orderBy: { dueDate: "asc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
        whatsAppMessages: {
          orderBy: { createdAt: "desc" },
        },
        inventoryUnits: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (!permissions.canViewAllLeads && lead.assignedUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You are not assigned to this lead" }, { status: 403 });
    }

    return NextResponse.json({ lead });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    const existingLead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId!,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (!permissions.canViewAllLeads && existingLead.assignedUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You are not assigned to this lead" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updateData: any = { ...parsed.data };
    if (updateData.nextFollowUpDate !== undefined) {
      updateData.nextFollowUpDate = updateData.nextFollowUpDate
        ? new Date(updateData.nextFollowUpDate)
        : null;
    }

    const updatedLead = await prisma.lead.update({
      where: { id: existingLead.id },
      data: updateData,
      include: {
        project: true,
        assignedUser: true,
      },
    });

    // Check if stage changed to log activity
    if (parsed.data.stage && parsed.data.stage !== existingLead.stage) {
      await prisma.leadActivity.create({
        data: {
          organizationId: user.organizationId!,
          leadId: existingLead.id,
          userId: user.id,
          activityType: "STAGE_CHANGE",
          title: "Stage Updated",
          description: `Stage moved from ${existingLead.stage} to ${parsed.data.stage} by ${user.name}`,
          metadata: JSON.stringify({ from: existingLead.stage, to: parsed.data.stage }),
        },
      });
    }

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "UPDATE_LEAD",
      entityType: "Lead",
      entityId: existingLead.id,
      details: parsed.data,
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canDeleteLeads) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete leads" }, { status: 403 });
    }

    const existingLead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId!,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Soft-archive lead
    await prisma.lead.update({
      where: { id: existingLead.id },
      data: { isArchived: true },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "ARCHIVE_LEAD",
      entityType: "Lead",
      entityId: existingLead.id,
    });

    return NextResponse.json({ success: true, message: "Lead archived successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to archive lead" }, { status: 500 });
  }
}
