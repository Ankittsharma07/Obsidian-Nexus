"use client";

import { useActionState, useState } from "react";
import { Github, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginState } from "@/types/auth";

type SignInAction = (state: LoginState, formData: FormData) => Promise<LoginState>;

type Props = {
  action: SignInAction;
};

const initialState: LoginState = {};

export function SignInForm({ action }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass-panel border border-white/10 p-8 shadow-2xl">
      <div className="mb-8 space-y-2 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Lock className="h-7 w-7 text-purple-200" />
        </div>
        <h1 className="text-3xl font-semibold text-white">Secure Access</h1>
        <p className="text-sm text-slate-400">Use the seeded credentials or your organization SSO.</p>
        {state.error && <p className="rounded-full bg-rose-500/10 px-4 py-2 text-xs text-rose-200">{state.error}</p>}
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="ava@obsidian.dev" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="******"
              required
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-slate-200 transition hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <Button type="button" variant="secondary" className="w-full gap-2" disabled>
          <Github className="h-4 w-4" /> Continue with GitHub (soon)
        </Button>
        <p className="text-xs text-slate-400">
          Need an account?{" "}
          <Link href="/sign-up" className="text-purple-300 hover:text-purple-200">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
