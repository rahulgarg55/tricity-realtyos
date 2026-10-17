import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { checkPlanLimits, SAAS_PLANS } from "@/lib/billing";

const prisma = new PrismaClient();

describe("Multi-Tenant Isolation & Authentication Tests", () => {
  let orgA: any;
  let orgB: any;
  let leadA: any;
  let leadB: any;

  beforeAll(async () => {
    // Create test organizations
    orgA = await prisma.organization.create({
      data: {
        name: "Test Builder Org A",
        slug: `test-org-a-${Date.now()}`,
        subscriptionTier: "STARTER",
        maxUsers: 5,
        maxLeads: 500,
        maxProjects: 3,
      },
    });

    orgB = await prisma.organization.create({
      data: {
        name: "Test Broker Org B",
        slug: `test-org-b-${Date.now()}`,
        subscriptionTier: "GROWTH",
        maxUsers: 15,
        maxLeads: 2500,
        maxProjects: 10,
      },
    });

    // Create a lead in Org A
    leadA = await prisma.lead.create({
      data: {
        organizationId: orgA.id,
        name: "Customer Org A",
        phone: "+919814000001",
        preferredLocation: "Mohali Sector 82",
        stage: "NEW_LEAD",
      },
    });

    // Create a lead in Org B
    leadB = await prisma.lead.create({
      data: {
        organizationId: orgB.id,
        name: "Customer Org B",
        phone: "+919814000002",
        preferredLocation: "Zirakpur PR7",
        stage: "QUALIFIED",
      },
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.lead.deleteMany({
      where: { id: { in: [leadA.id, leadB.id] } },
    });
    await prisma.organization.deleteMany({
      where: { id: { in: [orgA.id, orgB.id] } },
    });
    await prisma.$disconnect();
  });

  it("should enforce complete tenant isolation between organizations", async () => {
    // Querying with Org A's ID must ONLY return Org A's leads
    const leadsForOrgA = await prisma.lead.findMany({
      where: { organizationId: orgA.id },
    });

    expect(leadsForOrgA.some((l) => l.id === leadA.id)).toBe(true);
    expect(leadsForOrgA.some((l) => l.id === leadB.id)).toBe(false);

    // Querying with Org B's ID must ONLY return Org B's leads
    const leadsForOrgB = await prisma.lead.findMany({
      where: { organizationId: orgB.id },
    });

    expect(leadsForOrgB.some((l) => l.id === leadB.id)).toBe(true);
    expect(leadsForOrgB.some((l) => l.id === leadA.id)).toBe(false);
  });

  it("should securely hash and verify passwords using bcrypt", async () => {
    const rawPass = "SecretSecurePass123!";
    const hash = await hashPassword(rawPass);

    expect(hash).not.toBe(rawPass);
    expect(await verifyPassword(rawPass, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword123!", hash)).toBe(false);
  });

  it("should accurately check plan limits for organizations", async () => {
    const limitCheck = await checkPlanLimits(orgA.id, "leads");
    expect(limitCheck.allowed).toBe(true);
    expect(limitCheck.max).toBe(500);
    expect(limitCheck.current).toBe(1);
    expect(limitCheck.plan).toBe("STARTER");
  });
});
