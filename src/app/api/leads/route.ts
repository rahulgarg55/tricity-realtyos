import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { normalizePhoneNumber } from "@/lib/phone";
import { checkPlanLimits } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

const CreateLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  preferredLocation: z.string().optional(),
  budgetMin: z.number().optional().nullable(),
  budgetMax: z.number().optional().nullable(),
  propertyType: z.string().optional(),
  projectId: z.string().optional().nullable(),
  leadSource: z.string().default("Website"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "HOT"]).default("MEDIUM"),
  stage: z.string().default("NEW_LEAD"),
  assignedUserId: z.string().optional().nullable(),
  expectedRevenue: z.number().optional().nullable(),
  notes: z.string().optional(),
  nextFollowUpDate: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const priority = searchParams.get("priority");
    const projectId = searchParams.get("projectId");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // Build tenant-isolated query
    const whereClause: any = {
      organizationId: user.organizationId!,
      isArchived: false,
    };

    // Role-based lead visibility: Sales Reps only see their assigned leads
    if (!permissions.canViewAllLeads) {
      whereClause.assignedUserId = user.id;
    }

    if (stage) whereClause.stage = stage;
    if (priority) whereClause.priority = priority;
    if (projectId) whereClause.projectId = projectId;
    if (location) whereClause.preferredLocation = { contains: location };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { preferredLocation: { contains: search } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        include: {
          project: { select: { id: true, name: true, city: true } },
          assignedUser: { select: { id: true, name: true, email: true } },
          _count: {
            select: {
              siteVisits: true,
              tasks: true,
              whatsAppMessages: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("List leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = CreateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // 1. Check plan limits
    const limitCheck = await checkPlanLimits(user.organizationId!, "leads");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Lead limit reached (${limitCheck.current}/${limitCheck.max}) for plan ${limitCheck.plan}. Please upgrade your subscription.`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const { phone, email, ...rest } = parsed.data;
    const normalizedPhone = normalizePhoneNumber(phone);

    // 2. Duplicate check within same organization
    const existing = await prisma.lead.findFirst({
      where: {
        organizationId: user.organizationId!,
        phone: normalizedPhone,
        isArchived: false,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `Duplicate lead detected! A lead with phone ${normalizedPhone} already exists: '${existing.name}' (Stage: ${existing.stage})`,
          duplicateId: existing.id,
        },
        { status: 409 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId: user.organizationId!,
        name: rest.name,
        phone: normalizedPhone,
        email: email || null,
        preferredLocation: rest.preferredLocation || null,
        budgetMin: rest.budgetMin || null,
        budgetMax: rest.budgetMax || null,
        propertyType: rest.propertyType || null,
        projectId: rest.projectId || null,
        leadSource: rest.leadSource,
        priority: rest.priority,
        stage: rest.stage,
        assignedUserId: rest.assignedUserId || user.id, // default to creator if not specified
        expectedRevenue: rest.expectedRevenue || null,
        notes: rest.notes || null,
        nextFollowUpDate: rest.nextFollowUpDate ? new Date(rest.nextFollowUpDate) : null,
      },
      include: {
        project: true,
        assignedUser: true,
      },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        organizationId: user.organizationId!,
        leadId: lead.id,
        userId: user.id,
        activityType: "CREATED",
        title: "Lead Created",
        description: `Lead '${lead.name}' created via ${lead.leadSource} by ${user.name}`,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "CREATE_LEAD",
      entityType: "Lead",
      entityId: lead.id,
      details: { name: lead.name, phone: lead.phone },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
