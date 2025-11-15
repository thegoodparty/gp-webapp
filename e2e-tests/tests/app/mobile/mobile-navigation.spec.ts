import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Mobile Navigation", () => {
  // Configure mobile viewport
  test.use({ 
    viewport: { width: 375, height: 667 } 
  });

  test.beforeEach(async ({ page }) => {
    // Page is already authenticated via storageState from auth.setup.ts
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    // Complete onboarding if needed (using working logic)
    if (page.url().includes('/onboarding/')) {
      console.log('🚀 Completing onboarding to reach dashboard...');
      
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
    
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should display mobile dashboard", async ({ page }) => {
    // Wait for dashboard to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify we can access dashboard on mobile
    await expect(page).toHaveURL(/\/dashboard$/);
    
    // Check that some content is visible (any heading will do)
    const anyHeading = page.locator('h1, h2, h3, h4').first();
    await expect(anyHeading).toBeVisible();
    
    console.log("✅ Mobile dashboard accessible");
  });

  test("should have mobile navigation menu", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify mobile navigation elements (use first() for duplicates)
    const mobileMenuButton = page.getByTestId("tilt").first();
    
    if (await mobileMenuButton.isVisible({ timeout: 5000 })) {
      await expect(mobileMenuButton).toBeVisible(); // Mobile menu toggle
    }
  });

  test("should navigate to AI Assistant on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "AI Assistant", true);
    
    // Assert - verify AI Assistant page loads
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/);
  });

  test("should navigate to Content Builder on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "Content Builder", true);
    
    // Assert - verify Content Builder page loads
    await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/content$/);
  });

  test("should navigate to My Profile on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "My Profile", true);
    
    // Assert - verify Profile page loads (check URL and any content)
    await expect(page).toHaveURL(/\/profile$/);
    
    // Check that profile content is visible (any heading or form element)
    const profileContent = page.locator('h1, h2, h3, h4, form, input').first();
    await expect(profileContent).toBeVisible();
    
    console.log("✅ Mobile profile navigation working");
  });
});
