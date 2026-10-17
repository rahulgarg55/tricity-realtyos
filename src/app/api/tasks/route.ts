import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";

const CreateTaskSchema = z.object({
  leadId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  title: z.string().min(2, "Task title is required"),
  type: z.enum(["CALL", "MEETING", "SITE_VISIT", "WHATSAPP", "EMAIL", "OTHER"]).default("CALL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const { searchParams } = new URL(req.url);

    const isCompleted = searchParams.get("isCompleted");
    const overdueOnly = searchParams.get("overdue") === "true";
    const leadId = searchParams.get("leadId");

    const whereClause: any = {
      organizationId: user.organizationId!,
    };

    if (isCompleted !== null && isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === "true";
    }

    if (overdueOnly) {
      whereClause.isCompleted = false;
      whereClause.dueDate = { lt: new Date() };
    }

    if (leadId) whereClause.leadId = leadId;

    const tasks = await prisma.taskFollowUp.findMany({
      where: whereClause,
      include: {
        lead: { select: { id: true, name: true, phone: true } },
        assignedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isCompleted: "asc" }, { dueDate: "asc" }],
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const task = await prisma.taskFollowUp.create({
      data: {
        organizationId: user.organizationId!,
        leadId: parsed.data.leadId || null,
        assignedUserId: parsed.data.assignedUserId || user.id,
        title: parsed.data.title,
        type: parsed.data.type,
        priority: parsed.data.priority,
        dueDate: new Date(parsed.data.dueDate),
        notes: parsed.data.notes || null,
      },
      include: {
        lead: true,
        assignedUser: true,
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
