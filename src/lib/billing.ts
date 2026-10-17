import { prisma } from "./db";

export interface PlanDetails {
  id: "STARTER" | "GROWTH" | "BUSINESS";
  name: string;
  priceMonthlyINR: number;
  description: string;
  maxUsers: number;
  maxLeads: number;
  maxProjects: number;
  features: string[];
}

export const SAAS_PLANS: Record<string, PlanDetails> = {
  STARTER: {
    id: "STARTER",
    name: "Starter Broker",
    priceMonthlyINR: 4999,
    description: "Ideal for individual brokers and boutique real estate firms in Tricity.",
    maxUsers: 5,
    maxLeads: 500,
    maxProjects: 3,
    features: [
      "Up to 5 Sales Agents",
      "Up to 500 Active Leads",
      "3 Projects & 100 Units Inventory",
      "Site Visit Scheduling & Calendar",
      "Lead Timeline & Activity Logs",
      "WhatsApp Sandbox & Manual Messaging",
      "Standard CSV Exports",
    ],
  },
  GROWTH: {
    id: "GROWTH",
    name: "Growth Agency",
    priceMonthlyINR: 9999,
    description: "Designed for scaling property channel partners, agencies & mid-size builders.",
    maxUsers: 15,
    maxLeads: 2500,
    maxProjects: 10,
    features: [
      "Up to 15 Sales Agents & Managers",
      "Up to 2,500 Active Leads",
      "10 Projects & 500 Units Inventory",
      "Official WhatsApp Cloud API Integration",
      "Bulk Lead CSV Import & Duplicate Detection",
      "Inventory Hold Expiry Automation",
      "Team Performance Analytics",
      "Role-Based Access Control (RBAC)",
    ],
  },
  BUSINESS: {
    id: "BUSINESS",
    name: "Enterprise Builder",
    priceMonthlyINR: 19999,
    description: "For major real estate developers, township builders & large sales forces.",
    maxUsers: 50,
    maxLeads: 10000,
    maxProjects: 50,
    features: [
      "Up to 50 Sales Reps, Managers & Execs",
      "Up to 10,000 Active Leads",
      "50 Township / Plotted Projects",
      "Multi-Tower Inventory Matrix & Hold Rules",
      "Automated WhatsApp Follow-ups & Reminders",
      "Advanced Sales Pipeline & Revenue Projection",
      "Complete Audit Logging & Compliance",
      "Dedicated Onboarding & Priority Support",
    ],
  },
};

export async function checkPlanLimits(
  organizationId: string,
  entityType: "users" | "leads" | "projects"
): Promise<{ allowed: boolean; current: number; max: number; plan: string }> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      _count: {
        select: {
          users: true,
          leads: { where: { isArchived: false } },
          projects: true,
        },
      },
    },
  });

  if (!org) {
    return { allowed: false, current: 0, max: 0, plan: "NONE" };
  }

  const plan = SAAS_PLANS[org.subscriptionTier] || SAAS_PLANS.STARTER;

  let current = 0;
  let max = 0;

  if (entityType === "users") {
    current = org._count.users;
    max = org.maxUsers || plan.maxUsers;
  } else if (entityType === "leads") {
    current = org._count.leads;
    max = org.maxLeads || plan.maxLeads;
  } else if (entityType === "projects") {
    current = org._count.projects;
    max = org.maxProjects || plan.maxProjects;
  }

  return {
    allowed: current < max,
    current,
    max,
    plan: org.subscriptionTier,
  };
}
