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
  console.log(`Saving new test account: ${emailAddress} + ${password}`);
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

  await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded" });

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Log into existing account
  await page.getByTestId("login-email-input").nth(1).fill(emailAddress);
  await page.getByTestId("login-password-input").nth(1).fill(password);
  await page.getByTestId("login-submit-button").click();
  await page.waitForLoadState('domcontentloaded');
}

export async function createAccount(
  page,
  zipCode = "94066",
  role = "South San Francisco City Clerk",
  password = userData.password,
  emailAddress = generateEmail()
) {
  const loginPageHeader = "Join GoodParty.org";
  const firstName = userData.firstName;
  const lastName = testAccountLastName;
  const phoneNumber = generatePhone();
  const baseURL = process.env.BASE_URL || '';
  const electionLevel = 'Local/Township/City';

  await page.goto(`${baseURL}/sign-up`, { waitUntil: "domcontentloaded" });

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Verify user is on login page
  await page.waitForLoadState('domcontentloaded');
  expect(page.getByText(loginPageHeader)).toBeVisible();

  // Fill in sign up page
  await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
  await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
  await page.getByRole("textbox", { name: "email" }).fill(emailAddress);
  await page.getByRole("textbox", { name: "phone" }).fill(phoneNumber);
  await page.getByRole("textbox", { name: "Zip Code" }).fill(zipCode);
  await page.getByRole("textbox", { name: "password" }).fill(password + "1");
  await page.getByRole("button", { name: "Join" }).click();

  await page.getByText('To pull accurate results,').isVisible({ timeout: 60000 });
  await page.getByRole('combobox').selectOption(electionLevel);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText("What office are you interested in?").isVisible();
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

export async function upgradeToPro(page, campaignCommittee = "Test Campaign") {
  const testCardNumber = "4242424242424242";
  const phoneNumber = generatePhone();

  await page.goto("/dashboard/upgrade-to-pro", { waitUntil: "commit" });

  // Waits for page to load completely
  await page.waitForLoadState('domcontentloaded');

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
  await page.waitForLoadState('domcontentloaded');
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
  await page.goto(`${baseURL}/profile`, { waitUntil: "domcontentloaded" });

  console.log('Looking for Delete Account button...');
  // Wait for and click Delete Account button with a longer timeout
  const deleteButton = await page.getByRole('button', { name: 'Delete Account' });
  await deleteButton.waitFor({ state: 'visible', timeout: 30000 });
  await deleteButton.click();

  console.log('Looking for Proceed button...');
  // Wait for and click Proceed button
  const proceedButton = await page.getByRole('button', { name: 'Proceed' });
  await proceedButton.waitFor({ state: 'visible', timeout: 30000 });
  await proceedButton.click();

  await page.waitForLoadState('domcontentloaded');
  await page.context().clearCookies();

  // Only close the browser if we created it in this function
  if (shouldCloseBrowser) {
    await page.context().browser().close();
  } else {
    await page.close();
  }

  console.log('Account deletion completed successfully');
}