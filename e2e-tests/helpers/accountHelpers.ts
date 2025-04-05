import "dotenv/config";
import { expect, chromium } from "@playwright/test";
import { userData, generateEmail, generatePhone } from "helpers/dataHelpers";
import { acceptCookieTerms } from "helpers/domHelpers";
import * as path from 'path';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';

export const testAccountLastName = 'test';

export async function ensureSession() {
  const SESSION_FILE = path.resolve(__dirname, '../auth.json');
  const baseURL = process.env.BASE_URL || '';

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

  try {
    console.log('Creating new test account...');
    await createAccount(page, undefined, undefined, password, emailAddress);

    // Verify the account was created by checking if we're logged in
    console.log('Verifying account creation...');
    await page.goto(`${baseURL}/profile`, { waitUntil: 'networkidle' });
    const isLoggedIn = await page.locator("[data-testid='personal-first-name']").isVisible();
    if (!isLoggedIn) {
      throw new Error('Failed to verify account creation - not logged in after signup');
    }

    // Save the storage state (session)
    console.log(`Saving new test account: ${emailAddress} + ${password}`);
    await page.context().storageState({ path: SESSION_FILE });

    // Verify the session file was created
    if (!fs.existsSync(SESSION_FILE)) {
      throw new Error('Session file was not created successfully');
    }

    // Save account details for cleanup
    fs.writeFileSync(
      path.resolve(__dirname, '../testAccount.json'),
      JSON.stringify({ emailAddress, password: password })
    );

    console.log('New session created and saved successfully');
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

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Use admin credentials from environment variables
  const adminEmail = process.env.TEST_USER_ADMIN;
  const adminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not found in environment variables');
  }

  await loginAccount(page, adminEmail, adminPassword);

  // Save the admin storage state (session)
  console.log(`Saving admin session for: ${adminEmail}`);
  await page.context().storageState({ path: ADMIN_SESSION_FILE });
  await browser.close();

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
    await deleteAccount(); // No need to create browser/page or login

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

  await page.goto(`${baseURL}/login`, { waitUntil: "networkidle" });

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Log into existing account
  await page.getByTestId("login-email-input").nth(1).fill(emailAddress);
  await page.getByTestId("login-password-input").nth(1).fill(password);
  await page.getByTestId("login-submit-button").click();
  await page.waitForLoadState('networkidle');
}

export async function createAccount(
  page,
  zipCode = "94066",
  role = "San Mateo Union School Board",
  password = userData.password,
  emailAddress = generateEmail()
) {
  const loginPageHeader = "Join GoodParty.org";
  const firstName = userData.firstName;
  const lastName = testAccountLastName;
  const phoneNumber = generatePhone();
  const baseURL = process.env.BASE_URL || '';
  const electionLevel = 'Local/Township/City';

  console.log('Starting account creation process...');
  console.log(`Using baseURL: ${baseURL}`);

  try {
    // Navigate to sign-up page with retry
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting to navigate to sign-up page (attempt ${retryCount + 1})...`);
        await page.goto(`${baseURL}/sign-up`, {
          waitUntil: "networkidle",
          timeout: 30000
        });
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) throw error;
        console.log(`Navigation attempt ${retryCount} failed, retrying...`);
        await page.waitForTimeout(2000);
      }
    }
    console.log('Successfully navigated to sign-up page');

    // Verify user is on login page
    console.log('Waiting for sign-up page header...');
    await expect(page.getByText(loginPageHeader)).toBeVisible({ timeout: 30000 });
    console.log('Verified sign-up page header');

    // Fill in sign up page
    console.log('Filling sign-up form...');
    await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
    await page.getByRole("textbox", { name: "email" }).fill(emailAddress);
    await page.getByRole("textbox", { name: "phone" }).fill(phoneNumber);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(zipCode);
    await page.getByRole("textbox", { name: "password" }).fill(password + "1");
    console.log('Form filled, clicking Join button...');
    await page.getByRole("button", { name: "Join" }).click();

    // Accept cookie terms (if visible)
    console.log('Checking for cookie terms...');
    await acceptCookieTerms(page);

    console.log('Waiting for election level selection...');
    await page.getByText('To pull accurate results,').isVisible({ timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.getByRole('combobox').selectOption(electionLevel);
    await page.getByRole('button', { name: 'Next' }).click();

    console.log('Selecting office...');
    await page.getByText("What office are you interested in?").isVisible({ timeout: 30000 });
    await page
      .getByRole("progressbar")
      .waitFor({ state: "hidden", timeout: 30000 });
    await page.getByRole("button", { name: role }).first().click();
    await page.getByRole("button", { name: "Next" }).click();

    console.log('Setting campaign name...');
    await page
      .getByText("How will your campaign appear on the ballot?")
      .isVisible({ timeout: 30000 });
    await page.getByLabel("Other").fill("Test");
    await page.getByRole("button", { name: "Next" }).click();

    // Agree to GoodParty.org Terms
    console.log('Accepting terms...');
    await page.getByRole("button", { name: "I Agree" }).click();
    await page.getByRole("button", { name: "I Agree" }).click();
    await page.getByRole("button", { name: "I Agree" }).click();
    await page.getByRole("button", { name: "I Agree" }).click();
    await page.getByRole("button", { name: "Submit" }).click();

    console.log('Waiting for dashboard...');
    await page.getByText("View Dashboard").click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Verify we're on the dashboard
    const dashboardVisible = await page.getByText("View Dashboard").isVisible({ timeout: 30000 });
    if (!dashboardVisible) {
      console.log('Current URL:', page.url());
      console.log('Page content:', await page.content());
      throw new Error('Failed to reach dashboard after signup');
    }
    console.log('Account creation completed successfully');
  } catch (error) {
    console.error('Error during account creation:', error);
    console.log('Current URL:', page.url());
    console.log('Page content:', await page.content());
    throw error;
  }
}

export async function upgradeToPro(page, campaignCommittee = "Test Campaign") {
  const testCardNumber = "4242424242424242";
  const phoneNumber = generatePhone();

  await page.goto("/dashboard/upgrade-to-pro", { waitUntil: "commit" });

  // Waits for page to load completely
  await page.waitForLoadState('networkidle');

  // Verify user is on voter data (free) page
  await expect(page.getByRole('heading', { name: 'Upgrade to Pro for just $10 a month!' })).toBeVisible();
  await page.getByRole('button', { name: 'Join Pro Today' }).click();

  // Verify office details
  await page.getByRole('heading', { name: 'Please confirm your office details.' }).isVisible();
  await page.getByRole('link', { name: 'Confirm' }).click();
  await page.getByLabel('Name Of Campaign Committee').fill(campaignCommittee);
  await page.getByRole('checkbox').click();

  // Generate a PDF file
  const pdfPath = path.resolve(__dirname, 'sample.pdf');
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);
  doc.text('This is a dynamically generated PDF file.');
  doc.end();

  // Wait for the PDF file to be written
  await new Promise((resolve) => writeStream.on('finish', resolve));

  // Upload the PDF file
  const fileInput = page.locator("button input[type='file']");
  await fileInput.setInputFiles(pdfPath);
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  fs.unlinkSync(pdfPath);
  await page.getByRole('button', { name: 'Next' }).click();

  // Agree to GoodParty.org Terms
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByRole("button", { name: "I Accept" }).click();
  await page.getByPlaceholder('Jane Doe').fill(userData.firstName + ' ' + userData.lastName);
  await page.getByRole('button', { name: 'Finish' }).click();

  // Pay for pro through Stripe
  await page.getByLabel('Email').fill(userData.email);
  await page.getByTestId('product-summary-product-image', { timeout: 10000 }).isVisible();
  await page.getByTestId('card-accordion-item').click();
  await page.getByPlaceholder('1234 1234 1234').fill(testCardNumber);
  await page.getByPlaceholder('MM / YY').fill('12/28');
  await page.getByPlaceholder('CVC').fill('123');
  await page.getByPlaceholder('Full name on card').fill(userData.firstName + ' ' + userData.lastName);
  await page.getByPlaceholder('ZIP').fill('90210');
  await page.getByPlaceholder('(800) 555-').fill(phoneNumber);
  await page.getByTestId('hosted-payment-submit-button').click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('heading', { name: 'You are now subscribed to GoodParty.org Pro!', timeout: 60000 }).isVisible();
  await page.getByRole('button', { name: 'Go Back to Dashboard' }).click();
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
      storageState: SESSION_FILE  // Use the saved auth.json session
    });
    page = await context.newPage();
  }

  console.log('Navigating to profile page...');
  await page.goto(`${baseURL}/profile`, { waitUntil: "networkidle" });

  // Wait for profile page to load completely
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  console.log('Looking for Delete Account button...');
  // Wait for and click Delete Account button with a longer timeout
  const deleteButton = page.getByRole('button', { name: 'Delete Account' });
  await deleteButton.waitFor({ state: 'visible', timeout: 30000 });
  await deleteButton.click();

  console.log('Looking for Proceed button...');
  // Wait for and click Proceed button
  const proceedButton = page.getByRole('button', { name: 'Proceed' });
  await proceedButton.waitFor({ state: 'visible', timeout: 30000 });
  await proceedButton.click();

  // Verify user is logged out
  console.log('Verifying logout...');
  await expect(page.getByText('Get Campaign Tools')).toBeVisible({ timeout: 30000 });
  await page.context().clearCookies();

  // Only close the browser if we created it in this function
  if (shouldCloseBrowser) {
    await page.context().browser().close();
  } else {
    await page.close();
  }

  console.log('Account deletion completed successfully');
}