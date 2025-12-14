import { test, expect } from "@playwright/test";

test("landing page renders hero", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByRole("heading", { name: /client intelligence/i })).toBeVisible();
});
