import crypto from "crypto";
import { prisma } from "./db";

export interface SendWhatsAppMessageParams {
  organizationId: string;
  leadId?: string;
  toNumber: string;
  messageBody: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

export function verifyWhatsAppWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) return false;

  const parts = signatureHeader.split("=");
  if (parts.length !== 2 || parts[0] !== "sha256") return false;

  const expectedSignature = parts[1];
  const calculatedSignature = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (e) {
    return false;
  }
}

export async function sendWhatsAppMessage({
  organizationId,
  leadId,
  toNumber,
  messageBody,
  templateName,
}: SendWhatsAppMessageParams): Promise<{ success: boolean; messageId: string; isMock: boolean; error?: string }> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const isLiveConfigured =
    org?.whatsappEnabled &&
    org.whatsappAccessToken &&
    org.whatsappPhoneNumberId &&
    process.env.WHATSAPP_LIVE_MODE === "true";

  if (!isLiveConfigured) {
    // Development / Sandbox mode
    const mockId = `mock_wamid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await prisma.whatsAppMessage.create({
      data: {
        organizationId,
        leadId: leadId || null,
        direction: "OUTBOUND",
        fromNumber: org?.phone || "+911720000000",
        toNumber,
        messageBody,
        templateName: templateName || null,
        status: "DELIVERED",
        whatsappMessageId: mockId,
        isMock: true,
      },
    });

    return {
      success: true,
      messageId: mockId,
      isMock: true,
    };
  }

  // Live Meta Graph API Call
  try {
    const apiUrl = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || "v20.0"}/${org!.whatsappPhoneNumberId}/messages`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${org!.whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toNumber.replace("+", ""),
        type: "text",
        text: { preview_url: false, body: messageBody },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.message || "WhatsApp API request failed";
      await prisma.whatsAppMessage.create({
        data: {
          organizationId,
          leadId: leadId || null,
          direction: "OUTBOUND",
          fromNumber: org?.phone || "+911720000000",
          toNumber,
          messageBody,
          templateName: templateName || null,
          status: "FAILED",
          errorMessage: errorMsg,
          isMock: false,
        },
      });
      return { success: false, messageId: "", isMock: false, error: errorMsg };
    }

    const messageId = data?.messages?.[0]?.id || `wamid_${Date.now()}`;
    await prisma.whatsAppMessage.create({
      data: {
        organizationId,
        leadId: leadId || null,
        direction: "OUTBOUND",
        fromNumber: org?.phone || "+911720000000",
        toNumber,
        messageBody,
        templateName: templateName || null,
        status: "SENT",
        whatsappMessageId: messageId,
        isMock: false,
      },
    });

    return { success: true, messageId, isMock: false };
  } catch (err: any) {
    return { success: false, messageId: "", isMock: false, error: err.message };
  }
}

export const TRICITY_WHATSAPP_TEMPLATES = {
  SITE_VISIT_INVITATION: (leadName: string, project: string, date: string, time: string) =>
    `Hello ${leadName}, your site visit for *${project}* has been confirmed for ${date} at ${time}. Our property consultant will meet you at the site experience centre. Location: https://maps.google.com/?q=${encodeURIComponent(project)}. See you there! - Tricity RealtyOS Team`,
  
  BROCHURE_SHARE: (leadName: string, project: string, brochureUrl: string) =>
    `Hello ${leadName}, thank you for your enquiry on *${project}*. Here is the official project brochure and unit floor plans: ${brochureUrl}. Feel free to reply here if you'd like to schedule a site walk!`,
  
  FOLLOW_UP_REMINDER: (leadName: string, agentName: string) =>
    `Hi ${leadName}, this is ${agentName} following up regarding your property requirement in Tricity. Are you available for a brief 2-minute call today?`,
};
