import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!user.isSuperAdmin && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            leads: true,
            projects: true,
            inventoryUnits: true,
            siteVisits: true,
          },
        },
        invoices: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ organizations });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}
