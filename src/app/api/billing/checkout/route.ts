import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { SAAS_PLANS } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

const CheckoutSchema = z.object({
  planId: z.enum(["STARTER", "GROWTH", "BUSINESS"]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const permissions = getRolePermissions(user.role, user.isSuperAdmin);

    if (!permissions.canManageBilling) {
      return NextResponse.json(
        { error: "Forbidden: Only organization owners can change subscription plans" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
    }

    const targetPlan = SAAS_PLANS[parsed.data.planId];
    if (!targetPlan) {
      return NextResponse.json({ error: "Selected plan does not exist" }, { status: 400 });
    }

    // In local / sandbox mode, perform immediate atomic plan upgrade and generate invoice
    const updatedOrg = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.update({
        where: { id: user.organizationId! },
        data: {
          subscriptionTier: targetPlan.id,
          subscriptionStatus: "ACTIVE",
          maxUsers: targetPlan.maxUsers,
          maxLeads: targetPlan.maxLeads,
          maxProjects: targetPlan.maxProjects,
          subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
      await tx.subscriptionInvoice.create({
        data: {
          organizationId: org.id,
          amount: targetPlan.priceMonthlyINR,
          currency: "INR",
          plan: targetPlan.id,
          status: "PAID",
          invoiceNumber: invoiceNum,
          paidAt: new Date(),
        },
      });

      return org;
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "UPDATE_PLAN",
      entityType: "Organization",
      entityId: updatedOrg.id,
      details: {
        newPlan: targetPlan.id,
        priceINR: targetPlan.priceMonthlyINR,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${targetPlan.name} (₹${targetPlan.priceMonthlyINR.toLocaleString("en-IN")}/mo)`,
      organization: updatedOrg,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Billing checkout error:", error);
    return NextResponse.json({ error: "Failed to process plan change" }, { status: 500 });
  }
}
