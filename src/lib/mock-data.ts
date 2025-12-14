type MockAccount = {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "AT_RISK" | "DORMANT" | "ARCHIVED";
  annualRevenue: number;
  healthScore: number;
  ownerId: string;
  owner: { name: string };
  contacts: { id: string; name: string; email: string; title: string }[];
  interactions: { id: string; type: string; summary: string; happenedAt: string }[];
  tasks: { id: string; title: string; dueDate: string; priority: number; status: string }[];
};

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
};

const seedUsers: MockUser[] = [
  {
    id: "usr_admin",
    name: "Ava Patel",
    email: "ava@obsidian.dev",
    role: "ADMIN",
    passwordHash: "$2a$10$v1fxUJMocBrh9wZzLsRR7eHYGsvLRLCOYLB7EaHKxahVl/bbmzGD."
  },
  {
    id: "usr_mgr",
    name: "Noah Iyer",
    email: "noah@obsidian.dev",
    role: "MANAGER",
    passwordHash: "$2a$10$v1fxUJMocBrh9wZzLsRR7eHYGsvLRLCOYLB7EaHKxahVl/bbmzGD."
  },
  {
    id: "usr_analyst",
    name: "Mia Khan",
    email: "mia@obsidian.dev",
    role: "ANALYST",
    passwordHash: "$2a$10$v1fxUJMocBrh9wZzLsRR7eHYGsvLRLCOYLB7EaHKxahVl/bbmzGD."
  }
];

let runtimeUsers = [...seedUsers];

export function getMockUsers() {
  return runtimeUsers;
}

export function addMockUser(user: MockUser) {
  runtimeUsers = [user, ...runtimeUsers];
}

const seedAccounts: MockAccount[] = [
  {
    id: "acc_precision",
    name: "Precision Labs",
    industry: "BioTech",
    status: "ACTIVE",
    annualRevenue: 42000000,
    healthScore: 82,
    ownerId: "usr_admin",
    owner: { name: "Ava Patel" },
    contacts: [
      { id: "c1", name: "Dr. Ethan Wells", email: "ethan@precision.ai", title: "CTO" },
      { id: "c2", name: "Lia Samson", email: "lia@precision.ai", title: "Product Director" }
    ],
    interactions: [
      { id: "i1", type: "Quarterly Review", summary: "Explored LLM roadmap", happenedAt: new Date().toISOString() }
    ],
    tasks: [
      {
        id: "t1",
        title: "Prep adoption workshop",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: 1,
        status: "OPEN"
      }
    ]
  },
  {
    id: "acc_charcoal",
    name: "Charcoal Analytics",
    industry: "Finance",
    status: "AT_RISK",
    annualRevenue: 77000000,
    healthScore: 55,
    ownerId: "usr_mgr",
    owner: { name: "Noah Iyer" },
    contacts: [
      { id: "c3", name: "Priya Menon", email: "priya@charcoal.ai", title: "COO" },
      { id: "c4", name: "Felix Ren", email: "felix@charcoal.ai", title: "Head of Ops" }
    ],
    interactions: [
      { id: "i2", type: "Escalation", summary: "Pipeline throughput issues", happenedAt: new Date().toISOString() }
    ],
    tasks: [
      {
        id: "t2",
        title: "Create recovery plan",
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        priority: 0,
        status: "OPEN"
      }
    ]
  },
  {
    id: "acc_synergy",
    name: "Synergy Grid",
    industry: "Energy",
    status: "DORMANT",
    annualRevenue: 22000000,
    healthScore: 36,
    ownerId: "usr_analyst",
    owner: { name: "Mia Khan" },
    contacts: [{ id: "c5", name: "Leo Hughes", email: "leo@synergygrid.io", title: "VP Operations" }],
    interactions: [],
    tasks: []
  }
];

let runtimeAccounts = [...seedAccounts];

export function getMockAccounts() {
  return runtimeAccounts;
}

export function addMockAccount(account: MockAccount) {
  runtimeAccounts = [account, ...runtimeAccounts];
}

export function updateMockAccount(id: string, data: Partial<MockAccount>) {
  runtimeAccounts = runtimeAccounts.map((account) => (account.id === id ? { ...account, ...data } : account));
}

export function addMockTask(accountId: string, task: MockAccount["tasks"][number]) {
  runtimeAccounts = runtimeAccounts.map((account) => {
    if (account.id !== accountId) return account;
    const nextTasks = Array.isArray(account.tasks) ? [task, ...account.tasks] : [task];
    return { ...account, tasks: nextTasks };
  });
  return task;
}

export type { MockAccount };
