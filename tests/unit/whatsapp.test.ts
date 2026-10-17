import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  verifyWhatsAppWebhookSignature,
  TRICITY_WHATSAPP_TEMPLATES,
} from "@/lib/whatsapp";

describe("WhatsApp Business API & Webhook Verification Tests", () => {
  const appSecret = "test_meta_app_secret_12345";
  const rawPayload = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{ id: "123", changes: [] }],
  });

  it("should verify valid HMAC SHA256 webhook signatures", () => {
    const validSignature = crypto
      .createHmac("sha256", appSecret)
      .update(rawPayload, "utf8")
      .digest("hex");

    const header = `sha256=${validSignature}`;
    expect(verifyWhatsAppWebhookSignature(rawPayload, header, appSecret)).toBe(true);
  });

  it("should reject tampered payloads or invalid signatures", () => {
    const header = "sha256=invalid_hex_digest_9999999999999999999999999999999999999999999999999999999999999999";
    expect(verifyWhatsAppWebhookSignature(rawPayload, header, appSecret)).toBe(false);
  });

  it("should reject when signature header is null or malformed", () => {
    expect(verifyWhatsAppWebhookSignature(rawPayload, null, appSecret)).toBe(false);
    expect(verifyWhatsAppWebhookSignature(rawPayload, "sha1=abcd", appSecret)).toBe(false);
  });

  it("should render site visit invitation template correctly", () => {
    const text = TRICITY_WHATSAPP_TEMPLATES.SITE_VISIT_INVITATION(
      "Amaninder Singh",
      "Sushma Grande",
      "18 Oct 2026",
      "11:30 AM"
    );
    expect(text).toContain("Amaninder Singh");
    expect(text).toContain("Sushma Grande");
    expect(text).toContain("11:30 AM");
    expect(text).toContain("https://maps.google.com");
  });
});
