import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRolePermissions } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        organization: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ authenticated: false, error: "Inactive user" }, { status: 401 });
    }

    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
      },
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
            city: user.organization.city,
            state: user.organization.state,
            subscriptionTier: user.organization.subscriptionTier,
            subscriptionStatus: user.organization.subscriptionStatus,
            whatsappEnabled: user.organization.whatsappEnabled,
          }
        : null,
      permissions,
    });
  } catch (error: any) {
    console.error("Auth me check error:", error);
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
}
