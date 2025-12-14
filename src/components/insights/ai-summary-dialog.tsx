"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  accountId: string;
  children?: React.ReactNode;
};

export function AISummaryDialog({ accountId, children }: Props) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInsight = async () => {
    setLoading(true);
    const response = await fetch("/api/insights", {
      method: "POST",
      body: JSON.stringify({ accountId }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          loadInsight().catch(() => setLoading(false));
        }
      }}
    >
      <DialogTrigger asChild>{children ?? <Button size="sm">AI Insight</Button>}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Client Insight</DialogTitle>
          <DialogDescription>Summaries generated on demand from telemetry, health, and task signals.</DialogDescription>
        </DialogHeader>
        <Card className="bg-slate-900/70">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-200">
            {loading ? (
              <div className="flex items-center gap-3 text-purple-200">
                <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing insight...
              </div>
            ) : (
              summary ?? "No insight generated"
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
