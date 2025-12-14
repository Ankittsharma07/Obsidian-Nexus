"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { accountFormSchema, type AccountFormValues } from "@/lib/validation";
import { toast } from "sonner";
import type { AccountWithMeta } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: AccountWithMeta | null;
};

export function ClientDrawer({ open, onOpenChange, client }: Props) {
  const router = useRouter();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: client ?? {
      name: "",
      industry: "",
      annualRevenue: 1_000_000,
      status: "ACTIVE"
    }
  });

  useEffect(() => {
    if (client) {
      form.reset({
        id: client.id,
        name: client.name,
        industry: client.industry,
        status: client.status,
        annualRevenue: client.annualRevenue,
        healthScore: client.healthScore
      });
    } else {
      form.reset({
        name: "",
        industry: "",
        annualRevenue: 1_000_000,
        status: "ACTIVE"
      });
    }
  }, [client, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const endpoint = values.id ? `/api/accounts/${values.id}` : "/api/accounts";
      const method = values.id ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : payload?.error?.formErrors?.join(", ") ?? "Unable to persist data";
        throw new Error(message);
      }
      toast.success(client ? "Client updated" : "Client created");
      router.refresh();
      form.reset({
        name: "",
        industry: "",
        annualRevenue: 1_000_000,
        status: "ACTIVE"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Client mutation failed", error);
      const description =
        error instanceof Error && /unauthorized/i.test(error.message)
          ? "Please sign in again to continue."
          : error instanceof Error
            ? error.message
            : "Unable to persist data";
      toast.error(description);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
          <DialogDescription>Manage account metadata, revenue range, status, and health scoring.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {client && <input type="hidden" {...form.register("id")} />}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" {...form.register("industry")} />
            </div>
            <div>
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="AT_RISK">At Risk</SelectItem>
                      <SelectItem value="DORMANT">Dormant</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue</Label>
            <Input
              id="annualRevenue"
              type="text"
              inputMode="decimal"
              placeholder="Example: 4.2M or 850k"
              {...form.register("annualRevenue", { setValueAs: parseRevenueInput })}
            />
            <p className="text-xs text-slate-400">Suffix with K, M, or B to auto-convert.</p>
          </div>
          <div>
            <Label htmlFor="healthScore">Health Score</Label>
            <Input
              id="healthScore"
              type="number"
              min={0}
              max={100}
              {...form.register("healthScore", { valueAsNumber: true })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{client ? "Save Changes" : "Create Client"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function parseRevenueInput(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return 0;
  }
  const normalized = value.trim().toLowerCase().replace(/,/g, "");
  if (!normalized) {
    return 0;
  }
  const suffix = normalized.at(-1);
  const multiplier = suffix === "k" ? 1_000 : suffix === "m" ? 1_000_000 : suffix === "b" ? 1_000_000_000 : 1;
  const numericPortion = multiplier === 1 ? normalized : normalized.slice(0, -1);
  const parsed = Number(numericPortion);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.round(parsed * multiplier);
}
