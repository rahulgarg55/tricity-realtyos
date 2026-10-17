import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantUser } from "@/lib/auth";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { normalizePhoneNumber } from "@/lib/phone";
import { logAuditEvent } from "@/lib/audit";

const SendMessageSchema = z.object({
  leadId: z.string().optional().nullable(),
  toNumber: z.string().min(10, "Phone number is required"),
  messageBody: z.string().min(1, "Message body cannot be empty"),
  templateName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = SendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const normalizedTo = normalizePhoneNumber(parsed.data.toNumber);

    const result = await sendWhatsAppMessage({
      organizationId: user.organizationId!,
      leadId: parsed.data.leadId || undefined,
      toNumber: normalizedTo,
      messageBody: parsed.data.messageBody,
      templateName: parsed.data.templateName,
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      userId: user.id,
      action: "SEND_WHATSAPP_MESSAGE",
      entityType: "WhatsAppMessage",
      details: {
        toNumber: normalizedTo,
        isMock: result.isMock,
        messageId: result.messageId,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Send WhatsApp error:", error);
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
  }
}
