import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getMockAccounts, addMockTask } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { taskFormSchema } from "@/lib/validation";

function serializeTasks() {
  return getMockAccounts().flatMap((account) =>
    (account.tasks ?? []).map((task) => ({
      ...task,
      accountName: account.name
    }))
  );
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ items: serializeTasks() });
  }

  const tasks = await prisma.task.findMany({
    orderBy: { dueDate: "asc" },
    include: { account: { select: { name: true } } }
  });

  const items = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    accountName: task.account.name
  }));

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = taskFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    const mockTask = {
      id: `task-${Date.now()}`,
      title: parsed.data.title,
      status: "OPEN",
      priority: parsed.data.priority ?? 2,
      dueDate: parsed.data.dueDate,
      accountId: parsed.data.accountId,
      assigneeId: session.user.id
    };
    addMockTask(parsed.data.accountId, mockTask);
    revalidatePath("/tasks");
    return NextResponse.json(mockTask, { status: 201 });
  }

  const created = await prisma.task.create({
    data: {
      title: parsed.data.title,
      accountId: parsed.data.accountId,
      dueDate: new Date(parsed.data.dueDate),
      priority: parsed.data.priority ?? 2,
      status: "OPEN",
      assigneeId: parsed.data.assigneeId ?? session.user.id
    }
  });

  revalidatePath("/tasks");
  return NextResponse.json(created, { status: 201 });
}
