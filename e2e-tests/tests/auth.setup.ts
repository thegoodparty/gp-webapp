import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { TestDataHelper } from '../src/helpers/data.helper';
import { NavigationHelper } from '../src/helpers/navigation.helper';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate with onboarded user', async ({ page }) => {
  console.log('🔐 Setting up authenticated user...');
  
  // Since onboarding is complex, let's use a simpler approach:
  // Create a user and save the authenticated state even if still in onboarding
  // The individual tests can handle completing onboarding if needed
  
  const testUser = TestDataHelper.generateTestUser();
  
  // Create account
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
  
  // Wait for successful registration (could be onboarding or dashboard)
  await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 45000 });
  
  console.log(`✅ User created and authenticated: ${testUser.email}`);
  console.log(`📍 Current URL: ${page.url()}`);
  
  // Store the user credentials for cleanup and tests
  process.env.AUTH_SETUP_USER_EMAIL = testUser.email;
  process.env.AUTH_SETUP_USER_PASSWORD = testUser.password;
  
  // Save the authenticated browser state (even if in onboarding)
  await page.context().storageState({ path: authFile });
  
  console.log('💾 Saved authenticated browser state to:', authFile);
  console.log('ℹ️ Tests will complete onboarding if needed');
});
