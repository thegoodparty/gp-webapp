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

  const browser = await chromium.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
    ]
  });
  
  const { context, page } = await createStableBrowserContext(browser);
  const password = userData.password + '1';
  const emailAddress = generateEmail();
  const role = "South San Francisco City Clerk";
  const zipCode = "94066";

  try {
    const successfulEmail = await createAccount(page, zipCode, role, password, emailAddress);
    
    // Create test-results directory if it doesn't exist
    const screenshotDir = path.resolve(__dirname, '../test-results');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Take screenshot after successful login, when we're sure the page is stable
    const screenshotPath = path.resolve(screenshotDir, 'account-creation.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Save the storage state (session)
    console.log(`Saving new test account: ${testAccountFirstName} ${testAccountLastName} - ${successfulEmail} - ${password + '1'}`);
    await context.storageState({ path: SESSION_FILE });
    
    fs.writeFileSync(
      path.resolve(__dirname, '../testAccount.json'),
      JSON.stringify({ emailAddress: successfulEmail, password: password + '1' })
    );

    console.log('New session created and saved.');
  } catch (error) {
    console.error('Error during session creation:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function ensureAdminSession() {
  const ADMIN_SESSION_FILE = path.resolve(__dirname, '../admin-auth.json');

  if (fs.existsSync(ADMIN_SESSION_FILE)) {
    console.log('Existing admin session found, deleting and creating a new one...');
    fs.unlinkSync(ADMIN_SESSION_FILE);
  } else {
    console.log('No admin session found, creating a new one...');
  }

  const browser = await chromium.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
    ]
  });
  
  const { context, page } = await createStableBrowserContext(browser);

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
    const saveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 60000 });
    await saveButton.click();
    await documentReady(page);

    // Save the admin storage state (session)
    console.log(`Saving admin session for: ${adminEmail}`);
    await context.storageState({ path: ADMIN_SESSION_FILE });
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
      
      if (page.isClosed()) {
        throw new Error('Page was closed before login process could start');
      }

      try {
        await page.goto(`${baseURL}/login`, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
      } catch (navError) {
        console.log(`Navigation failed: ${navError.message}`);
        if (navError.message.includes('ERR_ABORTED') || navError.message.includes('frame was detached')) {
          throw new Error('Page was detached during navigation');
        }
        throw navError;
      }

      if (page.isClosed()) {
        throw new Error('Page was closed after navigating to login page');
      }

      await documentReady(page);

      // Check if we're already logged in (redirected to dashboard)
      let currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('Already on dashboard page, login successful');
        return;
      }

      const isLoginPageValid = await validateLoginPage(page);
      if (!isLoginPageValid) {
        throw new Error('Login page validation failed');
      }

      // Accept cookie terms (if visible)
      console.log('About to accept cookie terms...');
      await acceptCookieTerms(page);
      console.log('Cookie terms accepted successfully');

      await documentReady(page);
      
      console.log('Waiting for login form elements...');
      
      const emailInput = page.getByPlaceholder('hello@email.com');
      const passwordInput = page.getByPlaceholder('Please don\'t use your dog\'s');
      const submitButton = page.getByTestId("login-submit-button");
      
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await submitButton.waitFor({ state: 'visible', timeout: 10000 });

      await emailInput.fill(emailAddress);
      await passwordInput.fill(password);
      await submitButton.click();
      
      console.log('Waiting for login redirect...');
      await documentReady(page);
      
      try {
        await page.waitForURL(`${baseURL}/dashboard`, { timeout: 5000 });
      } catch (urlError) {
        console.log('URL wait failed, checking current URL...');
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/dashboard')) {
          console.log('Already on dashboard page, login successful');
        } else {
          await page.waitForTimeout(3000);
          await page.waitForURL(`${baseURL}/dashboard`, { timeout: 20000 });
        }
      }
      
      currentUrl = page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`Login failed - not redirected to dashboard. Current URL: ${currentUrl}`);
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

export async function validateLoginPage(page, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Validating login page (attempt ${attempt}/${maxRetries})`);
      
      // Wait for page to be ready with shorter timeout
      await page.waitForLoadState('domcontentloaded', { timeout: 8000 });
      
      // Check if we're actually on a login page
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        throw new Error(`Not on login page. Current URL: ${currentUrl}`);
      }
      
      // Try to find login form elements with shorter timeout
      const hasEmailInput = await page.locator('input[type="email"], [data-testid*="email"]').count() > 0;
      const hasPasswordInput = await page.locator('input[type="password"], [data-testid*="password"]').count() > 0;
      const hasSubmitButton = await page.locator('button[type="submit"], [data-testid*="submit"]').count() > 0;
      
      if (hasEmailInput && hasPasswordInput && hasSubmitButton) {
        console.log('Login page validation successful');
        return true;
      } else {
        throw new Error('Login form elements not found');
      }
    } catch (error) {
      console.log(`Login page validation attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        return false;
      }
      await page.waitForTimeout(1000);
    }
  }
  return false;
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
  const baseURL = process.env.BASE_URL || '';
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Account creation attempt ${attempt}/${maxRetries}`);
      
      // Generate fresh credentials for each attempt to avoid duplicates
      const attemptEmailAddress = attempt === 1 ? emailAddress : generateEmail();
      const attemptPhoneNumber = generatePhone();
      
      await page.goto(`${baseURL}/sign-up`, { waitUntil: "domcontentloaded" });

      // Accept cookie terms (if visible)
      await acceptCookieTerms(page);

      // Verify user is on login page
      await documentReady(page);
      expect(page.getByText(loginPageHeader)).toBeVisible();

      // Fill in sign up page
      await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
      await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
      await page.getByRole("textbox", { name: "email" }).fill(attemptEmailAddress);
      await page.getByRole("textbox", { name: "phone" }).fill(attemptPhoneNumber);
      await page.getByRole("textbox", { name: "Zip Code" }).fill(zipCode);
      await page.getByRole("textbox", { name: "password" }).fill(password + "1");
      await page.getByRole("button", { name: "Join" }).click();

      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      await page.getByText('Make sure it matches your').isVisible();
      
      // Wait for Office Name field
      const officeNameField = page.getByLabel('Office Name');
      await officeNameField.waitFor({ state: 'visible', timeout: 30000 });
      
      await officeNameField.fill(role);
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
      
      console.log(`Account creation successful on attempt ${attempt}`);
      return attemptEmailAddress;
      
    } catch (error) {
      console.error(`Account creation attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Account creation failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Clear any existing session/cookies before retry
      console.log('Clearing session data before retry...');
      try {
        await page.context().clearCookies();
      } catch (clearError) {
        console.log('Error clearing session data:', clearError.message);
      }
      
      // Wait before retrying
      console.log(`Waiting 5 seconds before retry ${attempt + 1}...`);
      await page.waitForTimeout(5000);
    }
  }
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
    throw error;
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

export async function createStableBrowserContext(browser, options = {}) {
  const defaultOptions = {
    viewport: null,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
    },
    ...options
  };

  try {
    const context = await browser.newContext(defaultOptions);
    const page = await context.newPage();
    
    // Set default timeout
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    
    return { context, page };
  } catch (error) {
    console.error('Failed to create browser context:', error.message);
    throw error;
  }
}

export async function safePageNavigation(page, url, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if page is still valid
      if (page.isClosed()) {
        throw new Error('Page was closed before navigation');
      }
      
      console.log(`Navigating to ${url} (attempt ${attempt}/${maxRetries})`);
      
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 60000
        });
      } catch (navError) {
        console.log(`Navigation error: ${navError.message}`);
        if (navError.message.includes('ERR_ABORTED') || navError.message.includes('frame was detached')) {
          throw new Error('Page was detached during navigation');
        }
        throw navError;
      }
      
      // Check if page is still valid after navigation
      if (page.isClosed()) {
        throw new Error('Page was closed after navigation');
      }
      
      await documentReady(page);
      
      // Wait for network to be idle with shorter timeout
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch (networkError) {
        console.log('Network idle timeout, continuing anyway...');
      }
      
      console.log(`Successfully navigated to ${url}`);
      return; // Success
    } catch (error) {
      console.log(`Navigation attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw new Error(`Failed to navigate to ${url} after ${maxRetries} attempts: ${error.message}`);
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export async function validateSession(page, expectedText) {
  const maxRetries = 1;
  const domContentTimeout = 8000;
  const elementTimeout = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: domContentTimeout });
      const currentUrl = page.url();
      if (currentUrl.includes('/sign-up') || currentUrl.includes('/login')) {
        console.log('Detected signup page - session is invalid, need manual login');
        return false;
      }
      
      let isLoggedIn = false;
      
      try {
        isLoggedIn = await page.getByText(expectedText).first().isVisible({ timeout: elementTimeout });
      } catch (e) {
        isLoggedIn = currentUrl.includes('/dashboard') || currentUrl.includes('/admin');
      }
      
      if (isLoggedIn) {
        console.log('Session validation successful');
        return true;
      } else {
        console.log(`Session validation attempt ${attempt} failed - not logged in`);
        if (attempt < maxRetries) {
          await page.waitForTimeout(1000);
        }
      }
    } catch (error) {
      console.log(`Session validation attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        await page.waitForTimeout(1000);
      }
    }
  }
  
  return false;
}

export async function isSessionRecent(sessionFile, maxAgeMinutes = 30) {
  if (!fs.existsSync(sessionFile)) {
    return false;
  }
  
  try {
    const stats = fs.statSync(sessionFile);
    const ageInMinutes = (Date.now() - stats.mtime.getTime()) / (1000 * 60);
    return ageInMinutes < maxAgeMinutes;
  } catch (error) {
    console.log('Error checking session file age:', error.message);
    return false;
  }
}

export async function prepareTest(type, url, text, page, browser = null) {
  const adminSessionFile = path.resolve(__dirname, '../admin-auth.json');
  const sessionFile = path.resolve(__dirname, '../auth.json');
  const maxRetries = 2;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Authentication attempt ${attempt}/${maxRetries}`);

      if (type === 'admin') {
        if (fs.existsSync(adminSessionFile) && await isSessionRecent(adminSessionFile, 15)) {
          try {
            console.log('Using recent admin session, skipping validation...');
            await safePageNavigation(page, url);
            console.log('Successfully navigated with recent admin session');
            await page.waitForTimeout(10000);
            return page;
          } catch (error) {
            console.log('Recent admin session failed, trying with validation...');
          }
        }
        
        if (fs.existsSync(adminSessionFile)) {
          try {
            console.log('Using existing admin session...');
            await safePageNavigation(page, url);

            // Quick session validation with shorter timeout
            const isValidSession = await validateSession(page, text);
            
            if (isValidSession) {
              console.log('Successfully logged in with admin session');
              return page;
            } else {
              console.log('Admin session appears to be invalid, falling back to manual login...');
            }
          } catch (error) {
            console.log('Admin session login failed, falling back to manual login...', error.message);
          }
        }

        console.log('Performing manual admin login...');
        await useAdminCredentials(page);
        
        if (page.isClosed()) {
          throw new Error('Page was closed during admin login process');
        }
        
        const currentUrl = page.url();
        if (!currentUrl.includes(url)) {
          await safePageNavigation(page, url);
        }
      }
      
      if (type === 'user') {
        if (fs.existsSync(sessionFile) && await isSessionRecent(sessionFile, 30)) {
          try {
            console.log('Using recent user session, skipping validation...');
            await safePageNavigation(page, url);
            console.log('Successfully navigated with recent user session');
            return page;
          } catch (error) {
            console.log('Recent user session failed, trying with validation...');
          }
        }
        
        if (fs.existsSync(sessionFile)) {
          try {
            console.log('Using existing session...');
            await safePageNavigation(page, url);

            // Quick session validation with shorter timeout
            const isValidSession = await validateSession(page, text);
            
            if (isValidSession) {
              console.log('Successfully logged in with session');
              return page;
            } else {
              console.log('Session appears to be invalid, falling back to manual login...');
            }
          } catch (error) {
            console.log('Session login failed, falling back to manual login...', error.message);
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
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export async function authenticateWithTimeout(page, url, expectedText) {
  const maxAuthTime = process.env.CI ? 180000 : 120000;
  const startTime = Date.now();
  
  console.log(`Starting authentication process (timeout: ${maxAuthTime/1000}s)...`);
  
  try {
    await Promise.race([
      prepareTest('user', url, expectedText, page),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Authentication timeout after ${maxAuthTime/1000}s`)), maxAuthTime)
      )
    ]);
    
    const authTime = Date.now() - startTime;
    console.log(`Authentication completed successfully in ${authTime}ms`);
    
  } catch (error) {
    const authTime = Date.now() - startTime;
    console.error(`Authentication failed after ${authTime}ms:`, error.message);
    throw error;
  }
}