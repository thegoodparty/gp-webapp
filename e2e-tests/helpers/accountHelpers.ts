import "dotenv/config";
import { expect, chromium } from "@playwright/test";
import { userData, generateEmail, generatePhone, generateTimeStamp } from "helpers/dataHelpers";
import { acceptCookieTerms, documentReady } from "helpers/domHelpers";
import * as path from 'path';
import * as fs from 'fs';

export const testAccountLastName = 'test';
export const testAccountFirstName = generateTimeStamp();
export const baseUrl = process.env.BASE_URL;

export async function ensureSession() {
  const SESSION_FILE = path.resolve(__dirname, '../auth.json');

  if (fs.existsSync(SESSION_FILE)) {
    console.log('Existing session found, deleting and creating a new one...');

    // Remove the existing session file
    fs.unlinkSync(SESSION_FILE);

    // Remove account details file, if it exists
    const accountFile = path.resolve(__dirname, '../testAccount.json');
    if (fs.existsSync(accountFile)) {
      fs.unlinkSync(accountFile);
    }
  } else {
    console.log('No session found, creating a new one...');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const password = userData.password + '1';
  const emailAddress = generateEmail();
  const role = "South San Francisco City Clerk";
  const zipCode = "94066";

  await createAccount(page, zipCode, role, password, emailAddress);
  // Create test-results directory if it doesn't exist
  const screenshotDir = path.resolve(__dirname, '../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Take screenshot after successful login, when we're sure the page is stable
  const screenshotPath = path.resolve(screenshotDir, 'account-creation.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Save the storage state (session)
  console.log(`Saving new test account: ${testAccountFirstName} ${testAccountLastName} - ${emailAddress} - ${password}`);
  await page.context().storageState({ path: SESSION_FILE });
  await browser.close();

  // Save account details for cleanup
  fs.writeFileSync(
    path.resolve(__dirname, '../testAccount.json'),
    JSON.stringify({ emailAddress, password: password })
  );

  console.log('New session created and saved.');
}

export async function ensureAdminSession() {
  const ADMIN_SESSION_FILE = path.resolve(__dirname, '../admin-auth.json');

  if (fs.existsSync(ADMIN_SESSION_FILE)) {
    console.log('Existing admin session found, deleting and creating a new one...');
    fs.unlinkSync(ADMIN_SESSION_FILE);
  } else {
    console.log('No admin session found, creating a new one...');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Use admin credentials from environment variables
    const adminEmail = process.env.TEST_USER_ADMIN;
    const adminPassword = process.env.TEST_USER_ADMIN_PASSWORD;
    const victoryPathUrl = `${baseUrl}/admin/victory-path/${encodeURIComponent(testAccountFirstName)}-${encodeURIComponent(testAccountLastName)}`;

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin credentials not found in environment variables');
    }

    await loginAccount(page, adminEmail, adminPassword);
    console.log(`Marking ${testAccountFirstName} ${testAccountLastName} test account as verified...`);

    console.log(`Navigating to: ${victoryPathUrl}`);
    await page.goto(victoryPathUrl, { waitUntil: "domcontentloaded" });
    await documentReady(page);

    console.log('Waiting for dropdown button...');
    const dropdownButton = page.locator('.MuiSelect-select').first();
    await dropdownButton.waitFor({ state: 'visible', timeout: 60000 });
    await dropdownButton.click();

    console.log('Waiting for Yes option...');
    await page.waitForTimeout(5000);
    await page.getByRole('option', { name: 'Yes' }).waitFor({ state: 'visible', timeout: 5000 });
    await page.getByRole('option', { name: 'Yes' }).click();

    console.log('Waiting for Save button...');
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.waitFor({ state: 'visible', timeout: 60000 });
    await saveButton.click();
    await documentReady(page);

    // Save the admin storage state (session)
    console.log(`Saving admin session for: ${adminEmail}`);
    await page.context().storageState({ path: ADMIN_SESSION_FILE });
  } catch (error) {
    console.error('Error in ensureAdminSession:', error);
    // Take screenshot on error
    await page.screenshot({ path: 'admin-session-error.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }

  console.log('New admin session created and saved.');
}

export async function cleanupSession() {
  const testAccountPath = path.resolve(__dirname, '../testAccount.json');
  const ADMIN_SESSION_FILE = path.resolve(__dirname, '../admin-auth.json');
  const SESSION_FILE = path.resolve(__dirname, '../auth.json');

  // Clean up admin session if it exists
  if (fs.existsSync(ADMIN_SESSION_FILE)) {
    console.log('Cleaning up admin session...');
    fs.unlinkSync(ADMIN_SESSION_FILE);
    console.log('Admin session file deleted.');
  }

  // Clean up regular test account and session if they exist
  if (fs.existsSync(testAccountPath)) {
    console.log('Cleaning up test account...');
    await deleteAccount();

    console.log('Test account deleted.');
    fs.unlinkSync(SESSION_FILE);
    fs.unlinkSync(testAccountPath);
  } else {
    console.log('No test account to clean up.');
  }
}

export async function loginAccount(
  page,
  emailAddress,
  password
) {
  const baseURL = process.env.BASE_URL;

  await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded" });

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Log into existing account
  await page.getByTestId("login-email-input").nth(1).fill(emailAddress);
  await page.getByTestId("login-password-input").nth(1).fill(password);
  await page.getByTestId("login-submit-button").click();
  await documentReady(page);
  await page.waitForURL(`${baseURL}/dashboard`, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

export async function createAccount(
  page,
  zipCode = "94066",
  role = "South San Francisco City Clerk",
  password = userData.password,
  emailAddress = generateEmail(),
  firstName = testAccountFirstName,
  lastName = testAccountLastName
) {
  const loginPageHeader = "Join GoodParty.org";
  const phoneNumber = generatePhone();
  const baseURL = process.env.BASE_URL || '';

  await page.goto(`${baseURL}/sign-up`, { waitUntil: "domcontentloaded" });

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Verify user is on login page
  await documentReady(page);
  expect(page.getByText(loginPageHeader)).toBeVisible();

  // Fill in sign up page
  await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
  await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
  await page.getByRole("textbox", { name: "email" }).fill(emailAddress);
  await page.getByRole("textbox", { name: "phone" }).fill(phoneNumber);
  await page.getByRole("textbox", { name: "Zip Code" }).fill(zipCode);
  await page.getByRole("textbox", { name: "password" }).fill(password + "1");
  await page.getByRole("button", { name: "Join" }).click();

  await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  await page.getByText('Make sure it matches your').isVisible();
  await page.getByLabel('Office Name').fill(role);
  await page.getByRole("button", { name: role, timeout: 60000 }).first().click();
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .getByText("How will your campaign appear on the ballot?")
    .isVisible();
  await page.getByLabel("Other").fill("Test");
  await page.getByRole("button", { name: "Next" }).click();
  // Agree to GoodParty.org Terms
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole('button', { name: 'Agreed' }).isVisible();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole('button', { name: 'Agreed' }).nth(1).isVisible();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole('button', { name: 'Agreed' }).nth(2).isVisible();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole('button', { name: 'Agreed' }).nth(3).isVisible();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('button', { name: 'View Dashboard' }).click();
}

export async function upgradeToPro(page) {
  const testCardNumber = "4242424242424242";

  await page.goto("/dashboard/upgrade-to-pro");

  // Waits for page to load completely
  await documentReady(page);

  // Verify user is on voter data (free) page
  await expect(page.getByRole('heading', { name: 'Why pay more for less?' })).toBeVisible();
  await page.getByRole('link', { name: 'Start today for just $10/month.' }).click();

  // Verify office details
  await documentReady(page);
  await page.getByRole('heading', { name: 'Please confirm your office details.' }).isVisible();
  await page.getByRole('link', { name: 'Confirm' }).click();

  // Agree to GoodParty.org Terms
  await documentReady(page);
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByPlaceholder('Jane Doe').fill(userData.firstName + ' ' + userData.lastName);
  await page.getByRole('button', { name: 'Finish' }).click();

  // Pay for pro through Stripe
  await documentReady(page);
  await page.getByLabel('Email').fill(userData.email);
  await page.getByTestId('product-summary-product-image', { timeout: 10000 }).isVisible();
  await page.getByTestId('card-accordion-item').click();
  await page.getByPlaceholder('1234 1234 1234').fill(testCardNumber);
  await page.getByPlaceholder('MM / YY').fill('12/28');
  await page.getByPlaceholder('CVC').fill('123');
  await page.getByPlaceholder('Full name on card').fill(userData.firstName + ' ' + userData.lastName);
  await page.getByPlaceholder('ZIP').fill('90210');
  await page.getByLabel('Save my info for 1-click', { timeout: 10000 }).click();
  await page.getByTestId('hosted-payment-submit-button').click();
  await documentReady(page);
  await page.getByRole('heading', { name: 'You are now subscribed to GoodParty.org Pro!', timeout: 60000 }).isVisible();
  await page.getByRole('button', { name: 'Go Back to Dashboard' }).click();
  await documentReady(page);
}

export async function deleteAccount(page = null) {
  const baseURL = process.env.BASE_URL;
  const SESSION_FILE = path.resolve(__dirname, '../auth.json');

  // If no page is provided, create a new browser context with the saved session
  let shouldCloseBrowser = false;
  if (!page) {
    shouldCloseBrowser = true;
    const browser = await chromium.launch();
    const context = await browser.newContext({
      storageState: SESSION_FILE
    });
    page = await context.newPage();
  }

  console.log('Navigating to profile page...');
  // Retry logic for Delete Account button
  let deleteButton, proceedButton;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(`${baseURL}/profile`);
      await documentReady(page);
      console.log(`Looking for Delete Account button... (Attempt ${attempt})`);
      deleteButton = await page.getByRole('button', { name: 'Delete Account' });
      await deleteButton.waitFor({ state: 'visible', timeout: 30000 });
      await deleteButton.click();

      console.log('Looking for Proceed button...');
      proceedButton = await page.getByRole('button', { name: 'Proceed' });
      await proceedButton.waitFor({ state: 'visible', timeout: 30000 });
      await proceedButton.click();
      break; // Success, exit loop
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }
  if (!deleteButton || !proceedButton) {
    throw lastError || new Error('Failed to find and click Delete Account/Proceed button after retries');
  }

  await documentReady(page);
  await page.context().clearCookies();

  // Only close the browser if we created it in this function
  if (shouldCloseBrowser) {
    await page.context().browser().close();
  } else {
    await page.close();
  }

  console.log('Account deletion completed successfully');
}