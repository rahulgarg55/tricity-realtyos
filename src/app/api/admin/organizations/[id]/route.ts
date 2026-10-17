import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

const AdminUpdateOrgSchema = z.object({
  subscriptionTier: z.enum(["STARTER", "GROWTH", "BUSINESS", "ENTERPRISE"]).optional(),
  subscriptionStatus: z.enum(["ACTIVE", "TRIALING", "PAST_DUE", "CANCELLED"]).optional(),
  maxUsers: z.number().optional(),
  maxLeads: z.number().optional(),
  maxProjects: z.number().optional(),
  whatsappEnabled: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (!user.isSuperAdmin && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AdminUpdateOrgSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const org = await prisma.organization.update({
      where: { id: params.id },
      data: parsed.data,
    });

    await logAuditEvent({
      userId: user.id,
      organizationId: org.id,
      action: "ADMIN_UPDATE_ORGANIZATION",
      entityType: "Organization",
      entityId: org.id,
      details: parsed.data,
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
