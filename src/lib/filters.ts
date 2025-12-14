import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "./prisma";
import { getMockAccounts } from "./mock-data";

export const accountFilterSchema = z.object({
  search: z.string().trim().optional().default(""),
  status: z.enum(["ACTIVE", "AT_RISK", "DORMANT", "ARCHIVED", "ALL"]).default("ALL"),
  industry: z.string().optional(),
  minRevenue: z.coerce.number().min(0).optional(),
  maxRevenue: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(5).max(100).default(20),
  sort: z.enum(["name", "revenue", "health"]).default("health"),
  dir: z.enum(["asc", "desc"]).default("desc")
});

export type AccountFilters = z.infer<typeof accountFilterSchema>;

export function buildAccountWhere(filters: AccountFilters, userId?: string) {
  const where: Prisma.AccountWhereInput = {};
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { industry: { contains: filters.search, mode: "insensitive" } }
    ];
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters.industry) {
    where.industry = { equals: filters.industry, mode: "insensitive" };
  }
  if (typeof filters.minRevenue === "number" || typeof filters.maxRevenue === "number") {
    where.annualRevenue = {};
    if (typeof filters.minRevenue === "number") {
      where.annualRevenue.gte = filters.minRevenue;
    }
    if (typeof filters.maxRevenue === "number") {
      where.annualRevenue.lte = filters.maxRevenue;
    }
  }
  if (userId) {
    where.ownerId = userId;
  }

  const orderBy: Prisma.AccountOrderByWithRelationInput =
    filters.sort === "name"
      ? { name: filters.dir }
      : filters.sort === "revenue"
        ? { annualRevenue: filters.dir }
        : { healthScore: filters.dir };

  return { where, orderBy };
}

export function defaultPagination(page: number, pageSize: number) {
  return {
    take: pageSize,
    skip: (page - 1) * pageSize
  };
}

export async function listAccounts(filters: AccountFilters, userId?: string) {
  if (!process.env.DATABASE_URL) {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    const filtered = getMockAccounts().filter((account) => {
      const matchesSearch =
        !filters.search ||
        account.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.industry.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || filters.status === "ALL" || account.status === filters.status;
      return matchesSearch && matchesStatus;
    });
    return {
      items: filtered.slice(start, end),
      total: filtered.length
    };
  }

  const { where, orderBy } = buildAccountWhere(filters, userId);
  const { take, skip } = defaultPagination(filters.page, filters.pageSize);
  const [items, total] = await prisma.$transaction([
    prisma.account.findMany({
      where,
      orderBy,
      take,
      skip,
      include: { contacts: true, owner: { select: { name: true, id: true } }, tasks: true }
    }),
    prisma.account.count({ where })
  ]);
  return { items, total };
}
