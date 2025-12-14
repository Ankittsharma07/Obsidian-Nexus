import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  title: string;
  summary: string;
  type?: string;
};

export function InsightCard({ title, summary, type = "AI" }: Props) {
  return (
    <Card className="bg-slate-900/70">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge>{type}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-slate-300">{summary}</CardContent>
    </Card>
  );
}
