import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWhatsAppWebhookSignature } from "@/lib/whatsapp";
import { normalizePhoneNumber } from "@/lib/phone";

// GET for Meta Hub Challenge verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "tricity_verify_secret_12345";

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden: Webhook verify token mismatch", { status: 403 });
}

// POST for incoming messages and delivery receipt events
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const appSecret = process.env.WHATSAPP_WEBHOOK_APP_SECRET || "";

    // Signature verification (enforced in production)
    if (appSecret && process.env.NODE_ENV === "production") {
      const isValid = verifyWhatsAppWebhookSignature(rawBody, signature, appSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook HMAC signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody || "{}");

    // Process entries
    if (payload.entry && Array.isArray(payload.entry)) {
      for (const entry of payload.entry) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // 1. Process Message Status Updates (delivered, read, failed)
          if (value.statuses && Array.isArray(value.statuses)) {
            for (const statusObj of value.statuses) {
              const wamid = statusObj.id;
              const status = statusObj.status?.toUpperCase(); // DELIVERED, READ, FAILED
              if (wamid && status) {
                await prisma.whatsAppMessage.updateMany({
                  where: { whatsappMessageId: wamid },
                  data: { status },
                });
              }
            }
          }

          // 2. Process Inbound Messages from customer
          if (value.messages && Array.isArray(value.messages)) {
            for (const msg of value.messages) {
              const fromPhone = normalizePhoneNumber(msg.from);
              const messageText = msg.text?.body || `[Media: ${msg.type}]`;
              const wamid = msg.id;

              // Find lead by phone number
              const lead = await prisma.lead.findFirst({
                where: { phone: fromPhone, isArchived: false },
                include: { organization: true },
              });

              if (lead) {
                await prisma.whatsAppMessage.create({
                  data: {
                    organizationId: lead.organizationId,
                    leadId: lead.id,
                    direction: "INBOUND",
                    fromNumber: fromPhone,
                    toNumber: lead.organization.phone || "+911720000000",
                    messageBody: messageText,
                    status: "READ",
                    whatsappMessageId: wamid,
                    isMock: false,
                  },
                });

                // Record activity on lead timeline
                await prisma.leadActivity.create({
                  data: {
                    organizationId: lead.organizationId,
                    leadId: lead.id,
                    activityType: "WHATSAPP_SENT",
                    title: "Inbound WhatsApp Received",
                    description: `Customer replied: "${messageText.substring(0, 100)}"`,
                  },
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("WhatsApp webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
