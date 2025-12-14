"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      closeButton
      position="bottom-right"
      toastOptions={{
        className: "glass-panel border border-white/10 text-slate-100"
      }}
    />
  );
}
