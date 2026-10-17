import { prisma } from "./db";

export interface LogAuditParams {
  organizationId?: string | null;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | string;
  ipAddress?: string | null;
}

export async function logAuditEvent({
  organizationId,
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: LogAuditParams) {
  try {
    const detailsString = typeof details === "object" ? JSON.stringify(details) : details;
    return await prisma.auditLog.create({
      data: {
        organizationId: organizationId || null,
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        details: detailsString || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
