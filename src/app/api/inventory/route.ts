import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

const CreateUnitSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  unitNumber: z.string().min(1, "Unit Number is required"),
  tower: z.string().optional().nullable(),
  floor: z.number().optional().nullable(),
  unitType: z.string().default("3BHK"),
  carpetAreaSqFt: z.number().min(1, "Carpet area must be greater than 0"),
  superAreaSqFt: z.number().optional().nullable(),
  askingPrice: z.number().min(1000, "Asking price is required"),
  status: z.enum(["AVAILABLE", "ON_HOLD", "BOOKED", "SOLD", "UNAVAILABLE"]).default("AVAILABLE"),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const { searchParams } = new URL(req.url);

    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const unitType = searchParams.get("unitType");

    // Auto-expire any expired holds before querying
    const now = new Date();
    await prisma.inventoryUnit.updateMany({
      where: {
        organizationId: user.organizationId!,
        status: "ON_HOLD",
        heldUntil: { lt: now },
      },
      data: {
        status: "AVAILABLE",
        heldUntil: null,
        heldByUserId: null,
      },
    });

    const whereClause: any = {
      organizationId: user.organizationId!,
    };

    if (projectId) whereClause.projectId = projectId;
    if (status) whereClause.status = status;
    if (unitType) whereClause.unitType = unitType;

    const units = await prisma.inventoryUnit.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true, city: true, location: true } },
        lead: { select: { id: true, name: true, phone: true } },
        statusHistory: {
          orderBy: { timestamp: "desc" },
          take: 3,
        },
      },
      orderBy: [{ tower: "asc" }, { floor: "asc" }, { unitNumber: "asc" }],
    });

    return NextResponse.json({ units });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canEditInventory && !permissions.canCreateProject) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to add inventory" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CreateUnitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Verify project belongs to organization
    const project = await prisma.project.findFirst({
      where: { id: parsed.data.projectId, organizationId: user.organizationId! },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or belongs to another tenant" }, { status: 404 });
    }

    // Check duplicate unit in same project
    const existingUnit = await prisma.inventoryUnit.findFirst({
      where: {
        organizationId: user.organizationId!,
        projectId: project.id,
        unitNumber: parsed.data.unitNumber,
      },
    });

    if (existingUnit) {
      return NextResponse.json(
        { error: `Unit '${parsed.data.unitNumber}' already exists in this project.` },
        { status: 409 }
      );
    }

    const unit = await prisma.inventoryUnit.create({
      data: {
        organizationId: user.organizationId!,
        projectId: project.id,
        unitNumber: parsed.data.unitNumber,
        tower: parsed.data.tower || null,
        floor: parsed.data.floor || null,
        unitType: parsed.data.unitType,
        carpetAreaSqFt: parsed.data.carpetAreaSqFt,
        superAreaSqFt: parsed.data.superAreaSqFt || null,
        askingPrice: parsed.data.askingPrice,
        status: parsed.data.status,
        notes: parsed.data.notes || null,
      },
    });

    await prisma.inventoryStatusHistory.create({
      data: {
        unitId: unit.id,
        fromStatus: "NEW",
        toStatus: unit.status,
        changedByUserId: user.id,
        reason: "Initial unit creation",
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "CREATE_INVENTORY_UNIT",
      entityType: "InventoryUnit",
      entityId: unit.id,
      details: { unitNumber: unit.unitNumber, project: project.name },
    });

    return NextResponse.json({ success: true, unit }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }
}
