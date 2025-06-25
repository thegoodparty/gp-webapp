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
  console.log(`Saving new test account: ${testAccountFirstName} ${testAccountLastName} - ${emailAddress} - ${password + '1'}`);
  await page.context().storageState({ path: SESSION_FILE });
  await browser.close();

  // Save account details for cleanup - use the actual password that was used in the form
  fs.writeFileSync(
    path.resolve(__dirname, '../testAccount.json'),
    JSON.stringify({ emailAddress, password: password + '1' })
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

    // Retry logic for dropdown and Yes option
    let maxRetries = 3;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        console.log(`Attempt ${retryCount + 1} to click dropdown and select Yes...`);
        await dropdownButton.click();
        await page.waitForTimeout(5000);
        const yesOption = page.getByRole('option', { name: 'Yes' });
        await yesOption.waitFor({ state: 'visible', timeout: 5000 });
        await yesOption.click();
        success = true;
      } catch (error) {
        console.log(`Attempt ${retryCount + 1} failed:`, error.message);
        retryCount++;
        if (retryCount === maxRetries) {
          throw new Error(`Failed to select Yes option after ${maxRetries} attempts`);
        }
      }
    }

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
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Login attempt ${attempt}/${maxRetries}`);
      
      // Check if page is still valid
      if (page.isClosed()) {
        throw new Error('Page was closed before login process could start');
      }

      await page.goto(`${baseURL}/login`);
      await documentReady(page);

      // Check page state after navigation
      if (page.isClosed()) {
        throw new Error('Page was closed after navigating to login page');
      }

      // Accept cookie terms (if visible)
      console.log('About to accept cookie terms...');
      await acceptCookieTerms(page);
      console.log('Cookie terms accepted successfully');

      // Check page state after cookie terms
      if (page.isClosed()) {
        throw new Error('Page was closed after accepting cookie terms');
      }

      // Check page state before form interaction
      if (page.isClosed()) {
        throw new Error('Page was closed before form interaction');
      }

      // Log into existing account
      console.log('About to fill email input...');
      await page.getByTestId("login-email-input").nth(1).fill(emailAddress);
      console.log('Email input filled successfully');
      
      // Check page state after email input
      if (page.isClosed()) {
        throw new Error('Page was closed after email input');
      }
      
      console.log('About to fill password input...');
      await page.getByTestId("login-password-input").nth(1).fill(password);
      console.log('Password input filled successfully');
      
      // Check page state after password input
      if (page.isClosed()) {
        throw new Error('Page was closed after password input');
      }
      
      console.log('About to click submit button...');
      await page.getByTestId("login-submit-button").click();
      console.log('Submit button clicked successfully');
      await documentReady(page);
      await page.waitForURL(`${baseURL}/dashboard`, { timeout: 30000 });
      await page.waitForLoadState('networkidle');

      // Verify we're actually on the dashboard
      const currentUrl = page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error('Login failed - not redirected to dashboard as expected');
      }
      
      console.log(`Login successful on attempt ${attempt}`);
      return;
      
    } catch (error) {
      console.error(`Login attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Login failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
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
  await page.getByLabel('Office Name').waitFor({ state: 'visible', timeout: 60000 });
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
      break;
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

  if (shouldCloseBrowser) {
    await page.context().browser().close();
  } else {
    await page.close();
  }

  console.log('Account deletion completed successfully');
}

export async function useTestAccountCredentials(page) {
  const testAccountPath = path.resolve(__dirname, '../testAccount.json');

  if (!fs.existsSync(testAccountPath)) {
    throw new Error('Test account file not found. Run ensureSession() first to create a test account.');
  }

  try {
    const accountData = JSON.parse(fs.readFileSync(testAccountPath, 'utf-8'));
    console.log(`Found test account credentials for: ${accountData.emailAddress}`);

    // Check if page is still available before attempting login
    if (page.isClosed()) {
      throw new Error('Page was closed before login could start');
    }

    // Login with the saved credentials using the safer approach
    await loginAccount(page, accountData.emailAddress, accountData.password);

    // Verify login was successful by checking if we're on the dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error('Login failed - not redirected to dashboard');
    }

    // Return the credentials for use in the test
    return {
      emailAddress: accountData.emailAddress,
      password: accountData.password
    };
  } catch (error) {
    console.error('Error in useTestAccountCredentials:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function useAdminCredentials(page) {
  const adminEmail = process.env.TEST_USER_ADMIN;
  const adminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not found in environment variables. Please set TEST_USER_ADMIN and TEST_USER_ADMIN_PASSWORD.');
  }

  console.log(`Logging in as admin: ${adminEmail}`);

  try {
    // Check if page is still available before attempting login
    if (page.isClosed()) {
      throw new Error('Page was closed before admin login could start');
    }

    await loginAccount(page, adminEmail, adminPassword);

    // Verify login was successful by checking if we're on the dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error('Admin login failed - not redirected to dashboard');
    }

    console.log('Admin login completed successfully');

    return {
      emailAddress: adminEmail,
      password: adminPassword
    };
  } catch (error) {
    console.error('Error in useAdminCredentials:', error);
    throw error;
  }
}

export async function createFreshPageContext(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  return { context, page };
}

export async function safePageNavigation(page, url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if page is still valid
      if (page.isClosed()) {
        throw new Error('Page was closed before navigation');
      }
      
      await page.goto(url);
      await documentReady(page);
      return; // Success
    } catch (error) {
      console.log(`Navigation attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw new Error(`Failed to navigate to ${url} after ${maxRetries} attempts: ${error.message}`);
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function prepareTest(type, url, text, page, browser = null) {
  const adminSessionFile = path.resolve(__dirname, '../admin-auth.json');
  const sessionFile = path.resolve(__dirname, '../auth.json');
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Authentication attempt ${attempt}/${maxRetries}`);
      
      // Check if page is valid
      if (page.isClosed()) {
        if (browser && attempt < maxRetries) {
          console.log('Page was closed, creating fresh context...');
          const { context, page: newPage } = await createFreshPageContext(browser);
          page = newPage;
        } else {
          throw new Error('Page was closed and no browser available for recovery');
        }
      }

      if (type === 'admin') {
        if (fs.existsSync(adminSessionFile)) {
          try {
            console.log('Using existing admin session...');
            await safePageNavigation(page, url);

            const isLoggedIn = await page.getByText(text).isVisible().catch(() => false);
            if (isLoggedIn) {
              console.log('Successfully logged in with admin session');
              return page;
            }
          } catch (error) {
            console.log('Admin session login failed, falling back to manual login...');
          }
        }

        console.log('Performing manual admin login...');
        await useAdminCredentials(page);
        
        // Verify page is still valid before attempting navigation
        if (page.isClosed()) {
          throw new Error('Page was closed during admin login process');
        }
        
        const currentUrl = page.url();
        if (!currentUrl.includes(url)) {
          await safePageNavigation(page, url);
        }
      }
      
      if (type === 'user') {
        if (fs.existsSync(sessionFile)) {
          try {
            console.log('Using existing session...');
            await safePageNavigation(page, url);

            const isLoggedIn = await page.getByText(text).isVisible().catch(() => false);
            if (isLoggedIn) {
              console.log('Successfully logged in with session');
              return page;
            }
          } catch (error) {
            console.log('Session login failed, falling back to manual login...');
          }
        }
        console.log('Performing manual login...');
        await useTestAccountCredentials(page);
        
        // Verify page is still valid before attempting navigation
        if (page.isClosed()) {
          throw new Error('Page was closed during user login process');
        }
        
        const currentUrl = page.url();
        if (!currentUrl.includes(url)) {
          await safePageNavigation(page, url);
        }
      }
      
      console.log(`Authentication successful on attempt ${attempt}`);
      return page;
      
    } catch (error) {
      console.error(`Authentication attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Authentication failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}