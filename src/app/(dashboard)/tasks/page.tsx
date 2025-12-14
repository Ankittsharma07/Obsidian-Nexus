import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { prisma } from "@/lib/prisma";
import { getMockAccounts } from "@/lib/mock-data";

type TaskListItem = {
  id: string;
  title: string;
  account: string;
  priority: number;
  dueDate: Date | string;
};

async function fetchTasks(): Promise<TaskListItem[]> {
  if (!process.env.DATABASE_URL) {
    return getMockAccounts().flatMap((account) =>
      (account.tasks ?? []).map((task) => ({
        id: task.id,
        title: task.title,
        account: account.name,
        priority: task.priority,
        dueDate: task.dueDate
      }))
    );
  }

  const tasks = await prisma.task.findMany({
    include: { account: { select: { name: true } } },
    orderBy: { dueDate: "asc" }
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    account: task.account.name,
    priority: task.priority,
    dueDate: task.dueDate
  }));
}

async function fetchAccountOptions() {
  if (!process.env.DATABASE_URL) {
    return getMockAccounts().map((account) => ({ id: account.id, name: account.name }));
  }
  const accounts = await prisma.account.findMany({ select: { id: true, name: true } });
  return accounts;
}

export default async function TasksPage() {
  const [tasks, accounts] = await Promise.all([fetchTasks(), fetchAccountOptions()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operational Flow</p>
          <h1 className="text-3xl font-semibold text-white">Team Tasks</h1>
        </div>
        {accounts.length > 0 ? <CreateTaskDialog accounts={accounts} /> : <Button disabled>No accounts</Button>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-slate-900/70">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">{task.title}</CardTitle>
              <Badge variant={task.priority <= 1 ? "destructive" : "secondary"}>Priority {task.priority + 1}</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-slate-300">
              <span>{task.account}</span>
              <Button variant="ghost" size="sm" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Mark Done
              </Button>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <Card className="bg-slate-900/60">
            <CardContent className="py-10 text-center text-sm text-slate-400">No tasks yet. Create one to get started.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
