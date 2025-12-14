"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDrawer } from "./client-drawer";

export function NewClientButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Client
      </Button>
      <ClientDrawer open={open} onOpenChange={setOpen} client={null} />
    </>
  );
}
