import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Workflow, LineChart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Unified Client Graph",
    description: "Every signal from revenue, product, and success teams converges into a living dossier for each client.",
    icon: Workflow
  },
  {
    title: "AI Health Intelligence",
    description: "Summaries and revival playbooks generated from telemetry, adoption gaps, and custom health formulas.",
    icon: Sparkles
  },
  {
    title: "Enterprise Guardrails",
    description: "Fine-grained roles, audit trails, and hardened sessions keep high-stakes data compliant from day zero.",
    icon: Shield
  }
];

const stats = [
  { label: "Signals processed", value: "2.7M+" },
  { label: "In-flight accounts", value: "1,200" },
  { label: "AI playbooks shipped", value: "480" }
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden px-6 pb-24 pt-24 lg:px-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-1 text-xs uppercase tracking-[0.35em] text-purple-100">
          OBSIDIAN · NEXUS
        </span>
        <h1 className="mt-8 text-5xl font-semibold leading-tight text-white md:text-6xl">
          Reimagine <span className="gradient-text">client intelligence</span> with couture-grade SaaS aesthetics.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
          A full-stack Next.js 16 reference that blends glassmorphism, adaptive AI workflows, and hardened infra so you can
          showcase how you design premium SaaS systems end-to-end.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-10 text-base">
            <Link href="/sign-in">
              Launch Console <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="border border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white/20"
          >
            <Link href="https://github.com/Ankittsharma07/obsidian-nexus" target="_blank">
              View Source
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="flex items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-r from-purple-500/40 to-indigo-500/40 p-3 text-purple-100">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">{feature.description}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
              <LineChart className="h-3 w-3" /> telemetry
            </div>
            <CardTitle>Precision telemetry, curated visuals</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Built with App Router, Server Actions, and cache tags to stream live data into luxe dashboards. AI summaries and
            per-client health bars show how you think about narrative UX, not just CRUD.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
              <Compass className="h-3 w-3" /> craft
            </div>
            <CardTitle>Royal-grade interactions</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            From password reveals and AI dialogs to the gradient chrome, every interaction reinforces a premium identity. It’s a
            hiring artifact that feels like a live product, not a demo.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
