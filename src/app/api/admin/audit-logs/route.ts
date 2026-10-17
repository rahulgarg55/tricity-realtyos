import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!user.isSuperAdmin && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        organization: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ auditLogs });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
