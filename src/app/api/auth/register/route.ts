import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, signSessionToken, setSessionCookie } from "@/lib/auth";
import { normalizePhoneNumber } from "@/lib/phone";
import { logAuditEvent } from "@/lib/audit";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  city: z.string().default("Mohali"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, password, organizationName, city } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const slugBase = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

    const passwordHash = await hashPassword(password);
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : null;

    // Transaction to create organization and owner
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug,
          city,
          subscriptionTier: "STARTER",
          subscriptionStatus: "ACTIVE",
          maxUsers: 5,
          maxLeads: 500,
          maxProjects: 3,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone: normalizedPhone,
          passwordHash,
          role: "OWNER",
          organizationId: org.id,
        },
      });

      return { org, user };
    });

    const token = await signSessionToken({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      organizationId: result.org.id,
      isSuperAdmin: false,
    });

    await setSessionCookie(token);

    await logAuditEvent({
      organizationId: result.org.id,
      userId: result.user.id,
      action: "REGISTER",
      entityType: "User",
      entityId: result.user.id,
      details: { organization: result.org.name },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      organization: {
        id: result.org.id,
        name: result.org.name,
        slug: result.org.slug,
        subscriptionTier: result.org.subscriptionTier,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
