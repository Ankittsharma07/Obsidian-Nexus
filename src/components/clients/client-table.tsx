"use client";

import { useOptimistic, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Edit2, Sparkles, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AISummaryDialog } from "@/components/insights/ai-summary-dialog";
import { ClientDrawer } from "./client-drawer";
import { toast } from "sonner";
import type { AccountWithMeta } from "@/types";

const statusVariants: Record<AccountWithMeta["status"], "default" | "secondary" | "destructive" | "success"> = {
  ACTIVE: "success",
  AT_RISK: "destructive",
  DORMANT: "secondary",
  ARCHIVED: "default"
};

export function ClientTable({ accounts }: { accounts: AccountWithMeta[] }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AccountWithMeta | null>(null);
  const [optimisticAccounts, addOptimisticAccount] = useOptimistic(accounts, (state, updated: AccountWithMeta) => {
    return state.map((account) => (account.id === updated.id ? updated : account));
  });
  const [pending, startTransition] = useTransition();

  const handleStatusChange = (account: AccountWithMeta, status: AccountWithMeta["status"]) => {
    startTransition(async () => {
      const optimistic = { ...account, status };
      addOptimisticAccount(optimistic);
      try {
        const payload = {
          id: account.id,
          name: account.name,
          industry: account.industry,
          annualRevenue: account.annualRevenue,
          status,
          healthScore: account.healthScore
        };
        const response = await fetch(`/api/accounts/${account.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Request failed");
        }
        router.refresh();
        toast.success(status === "ARCHIVED" ? "Client archived" : "Client restored");
      } catch {
        toast.error(status === "ARCHIVED" ? "Could not archive client" : "Could not restore client");
      }
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Health</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className="font-semibold text-white">{account.name}</div>
                <p className="text-xs text-slate-400">Owner: {account.owner?.name ?? "Unassigned"}</p>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[account.status]}>{account.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>{account.industry}</TableCell>
              <TableCell>{formatRevenue(account.annualRevenue)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span>{account.healthScore}</span>
                  <div className="h-1.5 w-24 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-300 transition-all"
                      style={{ width: `${account.healthScore}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelected(account);
                    setDrawerOpen(true);
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <AISummaryDialog accountId={account.id}>
                  <Button size="sm" variant="ghost">
                    <Sparkles className="mr-1 h-4 w-4" />
                    Insight
                  </Button>
                </AISummaryDialog>
                {account.status === "ARCHIVED" ? (
                  <Button size="sm" variant="ghost" disabled={pending} onClick={() => handleStatusChange(account, "ACTIVE")}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled={pending} onClick={() => handleStatusChange(account, "ARCHIVED")}>
                    <Archive className="mr-2 h-4 w-4" /> Archive
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {pending && (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton className="h-12 w-full" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ClientDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setSelected(null);
        }}
        client={selected}
      />
    </>
  );
}

function formatRevenue(amount: number) {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}




