"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { taskFormSchema, type TaskFormValues } from "@/lib/validation";

type AccountOption = { id: string; name: string };

type Props = {
  accounts: AccountOption[];
};

export function CreateTaskDialog({ accounts }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      accountId: accounts[0]?.id ?? "",
      dueDate: new Date().toISOString().slice(0, 10),
      priority: 2
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = typeof payload?.error === "string" ? payload.error : "Unable to create task";
        throw new Error(message);
      }
      toast.success("Task created");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Task creation failed", error);
      const detail =
        error instanceof Error && /unauthorized/i.test(error.message)
          ? "Your session expired. Please sign in again."
          : error instanceof Error
            ? error.message
            : "Unable to create task";
      toast.error(detail);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Assign focused work to an account owner with due dates and priority.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Prep adoption workshop" />
          </div>
          <div>
            <Label>Account</Label>
            <Select value={form.watch("accountId")} onValueChange={(value) => form.setValue("accountId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={form.watch("dueDate")} onChange={(e) => form.setValue("dueDate", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={String(form.watch("priority"))}
                onValueChange={(value) => form.setValue("priority", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map((level) => (
                    <SelectItem key={level} value={String(level)}>
                      {`P${level + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
