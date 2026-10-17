import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

const UpdateSiteVisitSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  outcome: z.string().optional().nullable(),
  clientFeedback: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  scheduledDate: z.string().optional(),
  timeSlot: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = UpdateSiteVisitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const visit = await prisma.siteVisit.findFirst({
      where: { id: params.id, organizationId: user.organizationId! },
      include: { lead: true, project: true },
    });

    if (!visit) {
      return NextResponse.json({ error: "Site visit not found" }, { status: 404 });
    }

    const updateData: any = { ...parsed.data };
    if (updateData.scheduledDate) {
      updateData.scheduledDate = new Date(updateData.scheduledDate);
    }

    const updatedVisit = await prisma.siteVisit.update({
      where: { id: visit.id },
      data: updateData,
      include: { lead: true, project: true, assignedUser: true },
    });

    // If marked completed, update lead stage
    if (parsed.data.status === "COMPLETED" && visit.lead.stage === "SITE_VISIT_SCHEDULED") {
      await prisma.lead.update({
        where: { id: visit.leadId },
        data: { stage: "SITE_VISIT_COMPLETED" },
      });

      await prisma.leadActivity.create({
        data: {
          organizationId: user.organizationId!,
          leadId: visit.leadId,
          userId: user.id,
          activityType: "VISIT_SCHEDULED",
          title: "Site Visit Completed",
          description: `Site visit for ${visit.project.name} marked completed. Outcome: ${parsed.data.outcome || "Interested"}`,
        },
      });
    }

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "UPDATE_SITE_VISIT",
      entityType: "SiteVisit",
      entityId: visit.id,
      details: parsed.data,
    });

    return NextResponse.json({ success: true, visit: updatedVisit });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update site visit" }, { status: 500 });
  }
}
