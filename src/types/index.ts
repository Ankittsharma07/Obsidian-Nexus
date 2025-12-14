export type AccountWithMeta = {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "AT_RISK" | "DORMANT" | "ARCHIVED";
  annualRevenue: number;
  healthScore: number;
  owner: {
    name: string;
  };
  contacts: { id: string; name: string; title: string; email: string }[];
  interactions: { id: string; type: string; summary: string; happenedAt: string }[];
  tasks: { id: string; title: string; status: string; dueDate: string; priority: number }[];
};
