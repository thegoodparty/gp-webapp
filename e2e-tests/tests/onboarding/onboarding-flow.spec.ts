import { test, expect } from "@playwright/test";
import type { TestUser } from "../../src/utils/test-data-manager";
import { TestDataHelper } from "../../src/helpers/data.helper";
import { NavigationHelper } from "../../src/helpers/navigation.helper";

// Reset storage state for onboarding tests since they create their own users
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Onboarding Flow", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Generate test user data
    testUser = TestDataHelper.generateTestUser();
    console.log(`🧪 Testing onboarding with: ${testUser.email}`);
  });

  test("should complete full onboarding flow from signup to dashboard", async ({ page }) => {
    // Step 0: Create account
    await page.goto("/sign-up");
    await NavigationHelper.dismissOverlays(page);
    
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    const joinButton = page.getByRole("button", { name: "Join" });
    await joinButton.waitFor({ state: "visible", timeout: 15000 });
    await joinButton.click();
    
    // Wait for successful registration and redirect to onboarding
    await page.waitForURL(url => url.toString().includes('/onboarding/'), { timeout: 45000 });
    
    // Step 1: Office Selection
    await test.step("Complete Step 1: Office Selection", async () => {
      expect(page.url()).toContain('/onboarding/');
      expect(page.url()).toContain('/1');
      
      // Fill zip code
      const zipField = page.getByLabel("Zip Code");
      await zipField.fill("28739");
      
      // Select office level - try different approaches
      let levelSelected = false;
      
      // Try the Office Level dropdown
      const levelSelect = page.getByLabel("Office Level");
      if (await levelSelect.isVisible({ timeout: 3000 })) {
        try {
          await levelSelect.selectOption("Local/Township/City");
          levelSelected = true;
        } catch (error) {
          // Try selecting by index
          await levelSelect.selectOption({ index: 1 });
          levelSelected = true;
        }
      }
      
      if (!levelSelected) {
        // Fallback: try any select element
        const anySelect = page.locator('select').first();
        if (await anySelect.isVisible({ timeout: 3000 })) {
          await anySelect.selectOption({ index: 1 });
        }
      }
      
      // Wait for offices to appear (more reliable than waiting for networkidle)
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('offices found') || text.includes('office found');
      }, { timeout: 30000 });
      
      // Select an office - try multiple approaches
      let officeSelected = false;
      
      // Method 1: Radio buttons
      const officeRadios = page.locator('input[type="radio"]');
      const radioCount = await officeRadios.count();
      
      if (radioCount > 0) {
        await officeRadios.first().click();
        officeSelected = true;
        console.log("✅ Selected office via radio button");
      } else {
        // Method 2: Office buttons
        const officeButtons = page.getByRole("button").filter({ 
          hasText: /Council|Mayor|Board|Commission|Village|County|Flat Rock|Henderson/ 
        });
        const buttonCount = await officeButtons.count();
        
        if (buttonCount > 0) {
          await officeButtons.first().click();
          officeSelected = true;
          console.log("✅ Selected office via button");
        }
      }
      
      expect(officeSelected).toBe(true);
      
      // Wait for selection to register
      await page.waitForTimeout(2000);
      
      // Click Next
      const nextButton = page.getByRole("button", { name: "Next" }).first();
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
      
      // Verify we moved to step 2
      await page.waitForURL(url => url.toString().includes('/2'), { timeout: 15000 });
    });
    
    // Step 2: Party Selection
    await test.step("Complete Step 2: Party Selection", async () => {
      expect(page.url()).toContain('/2');
      
      let partySelected = false;
      
      // Method 1: Look for "Other" input field
      const otherLabel = page.getByLabel("Other");
      if (await otherLabel.isVisible({ timeout: 3000 })) {
        await otherLabel.fill("Independent");
        partySelected = true;
        console.log("✅ Filled 'Other' party field");
      } else {
        // Method 2: Look for any text input that might be for party
        const textInputs = page.locator('input[type="text"]');
        const inputCount = await textInputs.count();
        
        if (inputCount > 0) {
          // Try each text input until one accepts the value
          for (let i = 0; i < inputCount; i++) {
            try {
              const input = textInputs.nth(i);
              await input.fill("Independent");
              
              // Check if the value was accepted
              const value = await input.inputValue();
              if (value === "Independent") {
                partySelected = true;
                console.log(`✅ Filled party input field ${i}`);
                break;
              }
            } catch (error) {
              continue;
            }
          }
        }
      }
      
      if (!partySelected) {
        // Method 3: Look for radio buttons for party selection
        const partyRadios = page.locator('input[type="radio"]');
        const radioCount = await partyRadios.count();
        
        if (radioCount > 0) {
          await partyRadios.first().click();
          partySelected = true;
          console.log("✅ Selected party via radio button");
        }
      }
      
      expect(partySelected).toBe(true);
      
      // Wait for form validation
      await page.waitForTimeout(2000);
      
      // Click Next
      const nextButton = page.getByRole("button", { name: "Next" }).first();
      await expect(nextButton).toBeVisible();
      
      // Check if button is enabled, if not try to make it enabled
      const isEnabled = await nextButton.isEnabled();
      if (!isEnabled) {
        console.warn("Next button not enabled, checking form state...");
        // Log the button attributes for debugging
        const buttonAttrs = await nextButton.evaluate(el => ({
          disabled: el.disabled,
          'data-step': el.getAttribute('data-step'),
          'data-party': el.getAttribute('data-party'),
          'data-other-party': el.getAttribute('data-other-party')
        }));
        console.log("Button attributes:", buttonAttrs);
      }
      
      await nextButton.click();
      
      // Verify we moved to step 3
      await page.waitForURL(url => url.toString().includes('/3'), { timeout: 15000 });
    });
    
    // Step 3: Pledge Agreement
    await test.step("Complete Step 3: Pledge Agreement", async () => {
      expect(page.url()).toContain('/3');
      
      const agreeButton = page.getByRole("button", { name: "I Agree" });
      await expect(agreeButton).toBeVisible();
      await agreeButton.click();
      
      // Verify we moved to step 4
      await page.waitForURL(url => url.toString().includes('/4'), { timeout: 15000 });
    });
    
    // Step 4: Complete Onboarding
    await test.step("Complete Step 4: Finish Onboarding", async () => {
      expect(page.url()).toContain('/4');
      
      const viewDashboardButton = page.getByRole("button", { name: "View Dashboard" });
      await expect(viewDashboardButton).toBeVisible();
      await viewDashboardButton.click();
      
      // Verify we reached the dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      expect(page.url()).toContain('/dashboard');
    });
    
    // Verify dashboard is accessible
    await expect(page.getByRole("heading", { name: "Campaign progress" })).toBeVisible();
    
    console.log(`✅ Onboarding completed successfully for ${testUser.email}`);
    
    // Store the completed user credentials for other tests to use
    process.env.COMPLETED_ONBOARDING_USER_EMAIL = testUser.email;
    process.env.COMPLETED_ONBOARDING_USER_PASSWORD = testUser.password;
    
    // Clean up - delete the test account
    await page.goto("/profile");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const deleteButton = page.getByText("Delete Account");
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await deleteButton.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      await page.getByRole("button", { name: "Proceed" }).click();
      await page.waitForURL(url => new URL(url).pathname === '/', { timeout: 15000 });
      console.log("✅ Test account cleaned up");
    }
  });
  
  test("should handle office selection step validation", async ({ page }) => {
    // Test just the office selection step in isolation
    await page.goto("/sign-up");
    
    // Create account quickly
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    await page.getByRole("button", { name: "Join" }).click();
    await page.waitForURL(url => url.toString().includes('/onboarding/'), { timeout: 45000 });
    
    // Test that Next button is disabled without office selection
    const nextButton = page.getByRole("button", { name: "Next" }).first();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();
    
    // Fill form but don't select office
    await page.getByLabel("Zip Code").fill("28739");
    
    // Button should still be disabled
    await expect(nextButton).toBeDisabled();
    
    // Now select office level and wait for offices
    const levelSelect = page.getByLabel("Office Level");
    if (await levelSelect.isVisible({ timeout: 3000 })) {
      await levelSelect.selectOption({ index: 1 });
      
      // Wait for offices to load
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('offices found') || text.includes('office found');
      }, { timeout: 30000 });
      
      // Select an office
      const officeRadios = page.locator('input[type="radio"]');
      if (await officeRadios.count() > 0) {
        await officeRadios.first().click();
        await page.waitForTimeout(1000);
        
        // Now button should be enabled
        await expect(nextButton).toBeEnabled();
      }
    }
  });
});
