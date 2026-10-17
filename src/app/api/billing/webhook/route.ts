import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody || "{}");

    // Idempotent event processing
    const eventType = event.type || "invoice.paid";
    const dataObj = event.data?.object || event;

    if (eventType === "invoice.paid" || eventType === "payment.captured") {
      const customerId = dataObj.customer || dataObj.customer_id;
      const amount = dataObj.amount_paid ? dataObj.amount_paid / 100 : (dataObj.amount || 9999);

      if (customerId) {
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              subscriptionStatus: "ACTIVE",
              subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });

          await prisma.subscriptionInvoice.create({
            data: {
              organizationId: org.id,
              amount,
              currency: "INR",
              plan: org.subscriptionTier,
              status: "PAID",
              invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
              paidAt: new Date(),
            },
          });

          await logAuditEvent({
            organizationId: org.id,
            action: "PAYMENT_SUCCEEDED",
            entityType: "SubscriptionInvoice",
            details: { amount, customerId },
          });
        }
      }
    } else if (eventType === "invoice.payment_failed") {
      const customerId = dataObj.customer;
      if (customerId) {
        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: "PAST_DUE" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Billing webhook error:", error);
    return NextResponse.json({ error: "Billing webhook handling failed" }, { status: 500 });
  }
}
