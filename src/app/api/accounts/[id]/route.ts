import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { accountFormSchema } from "@/lib/validation";
import { getMockAccounts, updateMockAccount } from "@/lib/mock-data";

const paramsSchema = z.object({
  id: z.string()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const routeParams = await context.params;
  const params = paramsSchema.safeParse(routeParams);
  if (!params.success) {
    console.error("Invalid account id payload", routeParams);
    return NextResponse.json({ error: "Invalid account id" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = accountFormSchema.safeParse({ ...body, id: params.data.id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    const current = getMockAccounts().find((account) => account.id === params.data.id);
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = {
      ...current,
      ...parsed.data,
      owner: current.owner ?? { name: session.user.name ?? "Operator" }
    };
    updateMockAccount(params.data.id, updated);
    revalidatePath("/clients");
    return NextResponse.json(updated);
  }

  const updatedAccount = await prisma.account.update({
    where: { id: params.data.id },
    data: {
      name: parsed.data.name,
      industry: parsed.data.industry,
      annualRevenue: parsed.data.annualRevenue,
      status: parsed.data.status,
      healthScore: parsed.data.healthScore ?? 75,
      ownerId: parsed.data.ownerId ?? session.user.id
    }
  });

  revalidatePath("/clients");
  return NextResponse.json(updatedAccount);
}
