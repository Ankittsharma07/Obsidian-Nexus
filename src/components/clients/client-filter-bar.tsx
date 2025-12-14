"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardFilters } from "@/components/shared/data-state";

export function ClientFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const { filters, setFilters } = useDashboardFilters();

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: params.get("search") ?? "",
      status: (params.get("status") as typeof prev.status) ?? "ALL"
    }));
  }, [params, setFilters]);

  const update = (next: Partial<typeof filters>) => {
    const updated = { ...filters, ...next };
    setFilters(updated);
    const query = new URLSearchParams(params.toString());
    query.set("search", updated.search);
    query.set("status", updated.status);
    router.push(`/clients?${query.toString()}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Input
        placeholder="Search clients..."
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
      />
      <Select value={filters.status} onValueChange={(value) => update({ status: value as typeof filters.status })}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="AT_RISK">At Risk</SelectItem>
          <SelectItem value="DORMANT">Dormant</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
