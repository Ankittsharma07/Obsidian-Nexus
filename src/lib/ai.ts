import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getMockAccounts } from "@/lib/mock-data";

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const GEMINI_MODEL = "gemini-1.5-pro-latest";

export async function generateAccountInsight(accountId: string) {
  const account =
    getMockAccounts().find((item) => item.id === accountId) ??
    (process.env.DATABASE_URL
      ? await prisma.account.findUnique({
          where: { id: accountId },
          include: { interactions: { orderBy: { happenedAt: "desc" }, take: 5 }, tasks: true }
        })
      : null);

  if (!account || !gemini) {
    return deriveFallbackInsight(account ?? getMockAccounts()[0]);
  }

  const prompt = `You are an AI revenue strategist. Create a succinct summary and three recommended actions for the account ${account.name} (${account.industry}).
Health score: ${account.healthScore}
Revenue: ${account.annualRevenue}
Recent interactions: ${(account.interactions ?? []).map((i) => `${i.type}: ${i.summary}`).join("; ") || "none"}
Open tasks: ${(account.tasks ?? []).map((task) => `${task.title} due ${task.dueDate}`).join("; ") || "none"}
Highlight risk, acceleration opportunities, and next best action.`;

  try {
    const model = gemini.getGenerativeModel({ model: GEMINI_MODEL });
    const response = await model.generateContent(prompt);
    const text = response.response?.text()?.trim();
    return text?.length ? text : deriveFallbackInsight(account);
  } catch (error) {
    console.error("Gemini insight generation failed:", error);
    return deriveFallbackInsight(account);
  }
}

function deriveFallbackInsight(account?: { name: string; industry: string; healthScore: number }) {
  if (!account) return "No insight available yet.";
  if (account.healthScore >= 80) {
    return `${account.name} is healthy. Maintain executive cadence and expand value pilots.`;
  }
  if (account.healthScore >= 55) {
    return `${account.name} shows early friction. Re-align on milestones and surface ROI dashboards.`;
  }
  return `${account.name} is at risk. Escalate with CXO sponsor, deploy rescue plan, and over-communicate progress.`;
}
