import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTenantUser } from "@/lib/auth";

const UpdateTaskSchema = z.object({
  isCompleted: z.boolean().optional(),
  title: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireTenantUser();
    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const task = await prisma.taskFollowUp.findFirst({
      where: { id: params.id, organizationId: user.organizationId! },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData: any = { ...parsed.data };
    if (parsed.data.isCompleted !== undefined) {
      updateData.completedAt = parsed.data.isCompleted ? new Date() : null;
    }
    if (parsed.data.dueDate) {
      updateData.dueDate = new Date(parsed.data.dueDate);
    }

    const updatedTask = await prisma.taskFollowUp.update({
      where: { id: task.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "NO_TENANT_ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
