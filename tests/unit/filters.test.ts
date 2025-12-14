import { describe, expect, it } from "vitest";
import { accountFilterSchema, buildAccountWhere } from "@/lib/filters";

describe("account filters", () => {
  it("parses defaults", () => {
    const result = accountFilterSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.status).toBe("ALL");
  });

  it("builds prisma where clause", () => {
    const where = buildAccountWhere(
      {
        search: "precision",
        status: "ACTIVE",
        industry: "BioTech",
        page: 1,
        pageSize: 10,
        sort: "health",
        dir: "desc"
      },
      "user-1"
    );

    expect(where.where?.ownerId).toBe("user-1");
    expect(where.where?.status).toBe("ACTIVE");
  });
});
