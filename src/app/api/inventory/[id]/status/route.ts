import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

const UpdateStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "ON_HOLD", "BOOKED", "SOLD", "UNAVAILABLE"]),
  leadId: z.string().optional().nullable(),
  holdHours: z.number().min(1).max(168).default(24), // default 24h hold, max 7 days
  bookingAmount: z.number().optional().nullable(),
  reason: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canBookInventory && !permissions.canEditInventory) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to change inventory status" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = UpdateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status: targetStatus, leadId, holdHours, bookingAmount, reason } = parsed.data;

    // Use Prisma transaction with atomic check to avoid race conditions
    const updated = await prisma.$transaction(async (tx) => {
      const currentUnit = await tx.inventoryUnit.findFirst({
        where: { id: params.id, organizationId: user.organizationId! },
      });

      if (!currentUnit) {
        throw new Error("NOT_FOUND");
      }

      // Check terminal state
      if (currentUnit.status === "SOLD") {
        throw new Error("ALREADY_SOLD");
      }

      // If unit is already booked and caller is not admin/owner
      if (currentUnit.status === "BOOKED" && targetStatus !== "SOLD" && targetStatus !== "AVAILABLE") {
        throw new Error("UNIT_ALREADY_BOOKED");
      }

      // If unit is on hold by another agent and not expired
      const now = new Date();
      if (
        currentUnit.status === "ON_HOLD" &&
        currentUnit.heldUntil &&
        currentUnit.heldUntil > now &&
        currentUnit.heldByUserId !== user.id &&
        !permissions.canEditInventory
      ) {
        throw new Error("ON_HOLD_BY_ANOTHER_AGENT");
      }

      let heldUntilDate: Date | null = null;
      let heldUser: string | null = null;

      if (targetStatus === "ON_HOLD") {
        heldUntilDate = new Date(Date.now() + holdHours * 60 * 60 * 1000);
        heldUser = user.id;
      }

      const unit = await tx.inventoryUnit.update({
        where: { id: currentUnit.id },
        data: {
          status: targetStatus,
          leadId: leadId !== undefined ? leadId : currentUnit.leadId,
          heldUntil: heldUntilDate,
          heldByUserId: heldUser,
          bookingAmount: bookingAmount !== undefined ? bookingAmount : currentUnit.bookingAmount,
        },
        include: {
          project: true,
          lead: true,
        },
      });

      // Record state history
      await tx.inventoryStatusHistory.create({
        data: {
          unitId: unit.id,
          fromStatus: currentUnit.status,
          toStatus: targetStatus,
          changedByUserId: user.id,
          reason: reason || `Status changed from ${currentUnit.status} to ${targetStatus}`,
        },
      });

      return { unit, fromStatus: currentUnit.status };
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "INVENTORY_STATUS_CHANGE",
      entityType: "InventoryUnit",
      entityId: updated.unit.id,
      details: {
        from: updated.fromStatus,
        to: targetStatus,
        leadId,
        bookingAmount,
      },
    });

    return NextResponse.json({ success: true, unit: updated.unit });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Inventory unit not found" }, { status: 404 });
    }
    if (error.message === "ALREADY_SOLD") {
      return NextResponse.json({ error: "Cannot change status of a unit that is already marked SOLD" }, { status: 409 });
    }
    if (error.message === "UNIT_ALREADY_BOOKED") {
      return NextResponse.json({ error: "Unit is already booked. Only managers can cancel or mark sold." }, { status: 409 });
    }
    if (error.message === "ON_HOLD_BY_ANOTHER_AGENT") {
      return NextResponse.json({ error: "Unit is currently on hold by another sales representative" }, { status: 409 });
    }
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Inventory status update error:", error);
    return NextResponse.json({ error: "Failed to update inventory status" }, { status: 500 });
  }
}
