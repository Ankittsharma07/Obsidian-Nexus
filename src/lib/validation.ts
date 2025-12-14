import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signupSchema = credentialsSchema.extend({
  name: z.string().min(2, "Name is required")
});

export const accountFormSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(3, "Client name is required"),
  industry: z.string().min(2),
  status: z.enum(["ACTIVE", "AT_RISK", "DORMANT", "ARCHIVED"]).default("ACTIVE"),
  annualRevenue: z.preprocess(
    (value) => Number(value),
    z.number().int().min(0, "Revenue must be positive").max(10_000_000_000)
  ),
  ownerId: z.string().min(1).optional(),
  healthScore: z.preprocess((value) => Number(value), z.number().min(0).max(100)).optional()
});

export const accountPatchSchema = accountFormSchema.partial({
  id: true,
  status: true,
  annualRevenue: true,
  ownerId: true,
  healthScore: true
});

export const taskFormSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(3),
  accountId: z.string().min(1),
  dueDate: z.string(),
  priority: z.coerce.number().min(0).max(4).default(2),
  assigneeId: z.string().min(1).optional()
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
