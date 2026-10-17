import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { checkPlanLimits } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

const CreateProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  developer: z.string().min(2, "Developer/Builder name is required"),
  location: z.string().min(2, "Location is required"),
  city: z.string().default("Mohali"),
  projectType: z.string().default("Residential"),
  description: z.string().optional(),
  amenities: z.string().optional(),
  brochureUrl: z.string().optional(),
  startingPrice: z.number().optional().nullable(),
  status: z.string().default("UNDER_CONSTRUCTION"),
  reraNumber: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireTenantUser();

    const projects = await prisma.project.findMany({
      where: { organizationId: user.organizationId! },
      include: {
        _count: {
          select: {
            units: true,
            leads: true,
            siteVisits: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canCreateProject) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create projects" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const limitCheck = await checkPlanLimits(user.organizationId!, "projects");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Project limit reached (${limitCheck.current}/${limitCheck.max}) for plan ${limitCheck.plan}. Please upgrade your subscription.`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const project = await prisma.project.create({
      data: {
        organizationId: user.organizationId!,
        name: parsed.data.name,
        developer: parsed.data.developer,
        location: parsed.data.location,
        city: parsed.data.city,
        projectType: parsed.data.projectType,
        description: parsed.data.description || null,
        amenities: parsed.data.amenities || null,
        brochureUrl: parsed.data.brochureUrl || null,
        startingPrice: parsed.data.startingPrice || null,
        status: parsed.data.status,
        reraNumber: parsed.data.reraNumber || null,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "CREATE_PROJECT",
      entityType: "Project",
      entityId: project.id,
      details: { name: project.name, city: project.city },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
