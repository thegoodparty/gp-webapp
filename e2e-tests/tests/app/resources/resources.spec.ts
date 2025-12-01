import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "src/helpers/wait.helper";

test.describe("Resources Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/resources');
    await WaitHelper.waitForPageReady(page);
    
    if (!page.url().includes('/dashboard/resources')) {
      throw new Error(`Expected resources page but got: ${page.url()}`);
    }
    
    await NavigationHelper.dismissOverlays(page);
  });

  test("should display resources page with guides and templates @experimental", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/resources$/);
    await expect(page.getByRole('heading', { name: 'Guides' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Campaign Playbook/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Launch Checklist/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /GOTV Checklist/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Templates' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Social Media/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Meta Ads/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Yard Signs/ })).toBeVisible();
  });
});