import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Control Room</p>
        <h1 className="text-3xl font-semibold text-white">Workspace Settings</h1>
      </div>

      <Card className="bg-slate-900/70">
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Workspace</span>
            <Badge>House of EdTech</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Plan</span>
            <Badge variant="secondary">Enterprise</Badge>
          </div>
          <Button variant="secondary" className="mt-4">
            Configure Billing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
