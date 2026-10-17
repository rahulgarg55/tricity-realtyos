import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizePhoneNumber } from "@/lib/phone";

const PublicLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  organizationType: z.string().default("Brokerage"),
  city: z.string().default("Mohali"),
  teamSize: z.string().default("1-5"),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PublicLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, organizationType, city, teamSize, notes } = parsed.data;
    const normalizedPhone = normalizePhoneNumber(phone);

    // Save lead into demo organization or record as system inbound lead
    const defaultOrg = await prisma.organization.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (defaultOrg) {
      await prisma.lead.create({
        data: {
          organizationId: defaultOrg.id,
          name,
          phone: normalizedPhone,
          email: email || null,
          preferredLocation: city,
          leadSource: "Website Book a Demo",
          priority: "HIGH",
          stage: "NEW_LEAD",
          notes: `Demo Request: Org Type: ${organizationType}, Team Size: ${teamSize}. Notes: ${notes || "None"}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Our Tricity onboarding specialist will contact you on WhatsApp / Phone within 15 minutes.",
    });
  } catch (err: any) {
    console.error("Public lead capture error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
