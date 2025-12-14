"use client";

import { Button } from "@/components/ui/button";

export default function ClientsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="glass-panel p-10 text-center">
      <h2 className="text-2xl font-semibold text-white">We lost the signal</h2>
      <p className="mt-2 text-slate-400">An unexpected error occurred while loading clients.</p>
      <Button className="mt-6" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
