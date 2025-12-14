import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { accountFilterSchema, listAccounts } from "@/lib/filters";
import { accountFormSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { addMockAccount } from "@/lib/mock-data";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const filters = accountFilterSchema.parse(params);
  const data = await listAccounts(filters, session.user.id);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = accountFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    const mockAccount = {
      ...parsed.data,
      id: `mock-${Date.now()}`,
      ownerId: parsed.data.ownerId ?? session.user.id,
      owner: { name: session.user.name ?? "Operator" },
      contacts: [],
      interactions: [],
      tasks: [],
      healthScore: parsed.data.healthScore ?? 75
    };
    addMockAccount(mockAccount);
    revalidatePath("/clients");
    return NextResponse.json(mockAccount, { status: 201 });
  }

  const account = await prisma.account.create({
    data: {
      name: parsed.data.name,
      industry: parsed.data.industry,
      annualRevenue: parsed.data.annualRevenue,
      status: parsed.data.status,
      ownerId: parsed.data.ownerId ?? session.user.id,
      healthScore: parsed.data.healthScore ?? 75
    }
  });

  revalidatePath("/clients");
  return NextResponse.json(account);
}
