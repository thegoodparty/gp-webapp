import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated via storageState from auth.setup.ts
    // Navigate to dashboard, but handle onboarding if needed
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    // If we're redirected to onboarding, complete it using our working test logic
    if (page.url().includes('/onboarding/')) {
      console.log('🚀 Completing onboarding to reach dashboard...');
      
      // Use the exact working logic from our successful onboarding test
      // Step 1: Office Selection
      if (page.url().includes('/1')) {
        const zipField = page.getByLabel("Zip Code");
        await zipField.fill("28739");
        
        const levelSelect = page.getByLabel("Office Level");
        if (await levelSelect.isVisible({ timeout: 3000 })) {
          await levelSelect.selectOption({ index: 1 });
          await page.waitForLoadState('networkidle', { timeout: 15000 });
          
          await page.waitForFunction(() => {
            const text = document.body.textContent || '';
            return text.includes('offices found') || text.includes('office found');
          }, { timeout: 20000 });
          
          const officeButtons = page.getByRole("button").filter({ 
            hasText: /Council|Mayor|Board|Commission|Village|County|Flat Rock|Henderson/ 
          });
          
          if (await officeButtons.count() > 0) {
            await officeButtons.first().click();
            await page.waitForTimeout(2000);
            
            const nextButton = page.getByRole("button", { name: "Next" }).first();
            await nextButton.click();
            await page.waitForURL(url => url.toString().includes('/2'), { timeout: 15000 });
          }
        }
      }
      
      // Step 2: Party Selection
      if (page.url().includes('/2')) {
        const otherLabel = page.getByLabel("Other");
        if (await otherLabel.isVisible({ timeout: 3000 })) {
          await otherLabel.fill("Independent");
          await page.waitForTimeout(2000);
          
          const nextButton = page.getByRole("button", { name: "Next" }).first();
          await nextButton.click({ force: true });
          await page.waitForURL(url => url.toString().includes('/3'), { timeout: 15000 });
        }
      }
      
      // Step 3: Pledge Agreement
      if (page.url().includes('/3')) {
        const agreeButton = page.getByRole("button", { name: "I Agree" });
        await agreeButton.click();
        await page.waitForURL(url => url.toString().includes('/4'), { timeout: 15000 });
      }
      
      // Step 4: Complete Onboarding
      if (page.url().includes('/4')) {
        const viewDashboardButton = page.getByRole("button", { name: "View Dashboard" });
        await viewDashboardButton.click();
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      }
    }
    
    // Dismiss any overlays
    await NavigationHelper.dismissOverlays(page);
  });

  test("should access AI Assistant with authenticated user", async ({ page }) => {
    console.log(`🧪 Testing AI Assistant with authenticated user`);
      
      // Navigate to AI Assistant
      await page.goto('/dashboard/campaign-assistant');
      await WaitHelper.waitForPageReady(page);
      
      // Test AI Assistant functionality
      await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
      
      // Look for conversation topics
      const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy/ });
      const buttonCount = await topicButtons.count();
      
      if (buttonCount > 0) {
        console.log(`✅ AI Assistant working - ${buttonCount} topics available`);
      }
      
  });
});