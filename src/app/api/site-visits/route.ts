import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { sendWhatsAppMessage, TRICITY_WHATSAPP_TEMPLATES } from "@/lib/whatsapp";
import { logAuditEvent } from "@/lib/audit";

const CreateSiteVisitSchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  projectId: z.string().min(1, "Project is required"),
  inventoryUnitId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  scheduledDate: z.string().min(1, "Date is required"),
  timeSlot: z.string().default("11:00 AM - 12:00 PM"),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sendWhatsAppConfirmation: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const projectId = searchParams.get("projectId");
    const leadId = searchParams.get("leadId");

    const whereClause: any = {
      organizationId: user.organizationId!,
    };

    if (status) whereClause.status = status;
    if (projectId) whereClause.projectId = projectId;
    if (leadId) whereClause.leadId = leadId;

    const visits = await prisma.siteVisit.findMany({
      where: whereClause,
      include: {
        lead: { select: { id: true, name: true, phone: true, stage: true } },
        project: { select: { id: true, name: true, city: true, location: true } },
        inventoryUnit: { select: { id: true, unitNumber: true, unitType: true } },
        assignedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledDate: "asc" },
    });

    return NextResponse.json({ visits });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch site visits" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = CreateSiteVisitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      leadId,
      projectId,
      inventoryUnitId,
      assignedUserId,
      scheduledDate,
      timeSlot,
      location,
      notes,
      sendWhatsAppConfirmation,
    } = parsed.data;

    const assignedAgentId = assignedUserId || user.id;
    const visitDate = new Date(scheduledDate);

    // Conflict prevention check: Check if same agent already has a confirmed visit at the same date and timeslot
    const existingVisit = await prisma.siteVisit.findFirst({
      where: {
        organizationId: user.organizationId!,
        assignedUserId: assignedAgentId,
        scheduledDate: visitDate,
        timeSlot: timeSlot,
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: {
        assignedUser: { select: { name: true } },
      },
    });

    if (existingVisit) {
      return NextResponse.json(
        {
          error: `Scheduling conflict: Agent ${existingVisit.assignedUser.name} already has a site visit scheduled for this time slot (${timeSlot}).`,
        },
        { status: 409 }
      );
    }

    // Verify lead and project belong to tenant
    const [lead, project] = await Promise.all([
      prisma.lead.findFirst({
        where: { id: leadId, organizationId: user.organizationId! },
      }),
      prisma.project.findFirst({
        where: { id: projectId, organizationId: user.organizationId! },
      }),
    ]);

    if (!lead || !project) {
      return NextResponse.json({ error: "Lead or Project not found" }, { status: 404 });
    }

    const visit = await prisma.siteVisit.create({
      data: {
        organizationId: user.organizationId!,
        leadId: lead.id,
        projectId: project.id,
        inventoryUnitId: inventoryUnitId || null,
        assignedUserId: assignedAgentId,
        scheduledDate: visitDate,
        timeSlot,
        location: location || `${project.name} Sales Gallery, ${project.location}`,
        notes: notes || null,
        status: "SCHEDULED",
      },
      include: {
        lead: true,
        project: true,
        assignedUser: true,
      },
    });

    // Advance lead stage to SITE_VISIT_SCHEDULED if at earlier stage
    if (lead.stage === "NEW_LEAD" || lead.stage === "CONTACTED" || lead.stage === "QUALIFIED") {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { stage: "SITE_VISIT_SCHEDULED" },
      });

      await prisma.leadActivity.create({
        data: {
          organizationId: user.organizationId!,
          leadId: lead.id,
          userId: user.id,
          activityType: "STAGE_CHANGE",
          title: "Stage Updated to Site Visit Scheduled",
          description: `Site visit booked for ${project.name} on ${scheduledDate} (${timeSlot})`,
        },
      });
    }

    // Dispatch WhatsApp confirmation message if requested
    if (sendWhatsAppConfirmation && lead.phone) {
      const templateText = TRICITY_WHATSAPP_TEMPLATES.SITE_VISIT_INVITATION(
        lead.name,
        project.name,
        new Date(scheduledDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        timeSlot
      );

      await sendWhatsAppMessage({
        organizationId: user.organizationId!,
        leadId: lead.id,
        toNumber: lead.phone,
        messageBody: templateText,
        templateName: "site_visit_invitation",
      });
    }

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "SCHEDULE_SITE_VISIT",
      entityType: "SiteVisit",
      entityId: visit.id,
      details: { lead: lead.name, project: project.name, date: scheduledDate },
    });

    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Schedule site visit error:", error);
    return NextResponse.json({ error: "Failed to schedule site visit" }, { status: 500 });
  }
}
