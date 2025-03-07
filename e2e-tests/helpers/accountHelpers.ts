import "dotenv/config";
import { expect, chromium } from "@playwright/test";
import { userData, generateEmail, generatePhone } from "helpers/dataHelpers";
import { acceptCookieTerms } from "helpers/domHelpers";
import * as path from 'path';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';

const SESSION_FILE = path.resolve(__dirname, '../auth.json');

export const testAccountLastName = 'test';

export async function ensureSession() {
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
  const password = userData.password;
  const emailAddress = generateEmail();

  await createAccount(page, undefined, undefined, password, emailAddress);

  // Save the storage state (session)
  console.log(`Saving new test account: ${emailAddress} + ${password}1`);
  await page.context().storageState({ path: SESSION_FILE });
  await browser.close();

  // Save account details for cleanup
  fs.writeFileSync(
    path.resolve(__dirname, '../testAccount.json'),
    JSON.stringify({ emailAddress, password: password + '1' })
  );

  console.log('New session created and saved.');
}


export async function cleanupSession() {
  const testAccountPath = path.resolve(__dirname, '../testAccount.json');

  if (!fs.existsSync(testAccountPath)) {
    console.log('No test account to clean up.');
    return;
  }

  const { emailAddress, password } = JSON.parse(
    fs.readFileSync(testAccountPath, 'utf-8')
  );

  console.log(`Cleaning up test account: ${emailAddress} + ${password}`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await loginAccount(page, emailAddress, password);
  await deleteAccount(page);

  console.log('Test account deleted.');
  fs.unlinkSync(SESSION_FILE);
  fs.unlinkSync(testAccountPath);
  await browser.close();
}

export async function loginAccount(
  page,
  emailAddress,
  password
) {
    const baseURL = process.env.BASE_URL;

  await page.goto(`${baseURL}/login`);

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
  const electionDate = '2028-11-10';

  await page.goto(`${baseURL}/sign-up`);

  // Verify user is on login page
  await expect(page.getByText(loginPageHeader)).toBeVisible();

  // Fill in sign up page
  await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
  await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
  await page.getByRole("textbox", { name: "email" }).fill(emailAddress);
  await page.getByRole("textbox", { name: "phone" }).fill(phoneNumber);
  await page.getByRole("textbox", { name: "Zip Code" }).fill(zipCode);
  await page.getByRole("textbox", { name: "password" }).fill(password + "1");
  await page.getByRole("button", { name: "Join" }).click();

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  await page.getByText('To pull accurate results,').isVisible();
  await page.getByLabel('General Election Date (').fill(electionDate);
  await page.getByLabel('General Election Date (').press('Enter');
  await page.getByRole('combobox').selectOption(electionLevel);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByText("What office are you interested in?").isVisible();
  await page
    .getByRole("progressbar")
    .waitFor({ state: "hidden", timeout: 20000 });
  await page.getByRole("button", { name: role }).first().click();
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .getByText("How will your campaign appear on the ballot?")
    .isVisible();
  await page.getByLabel("Other").fill("Test");
  await page.getByRole("button", { name: "Next" }).click();
  // Agree to GoodParty.org Terms
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole("button", { name: "I Agree" }).click();
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByText("View Dashboard").click();
  await page.waitForLoadState('networkidle');
}

export async function upgradeToPro(page, campaignCommittee = "Test Campaign") {
  const testCardNumber = "4242424242424242";
  const phoneNumber = generatePhone();

  await page.goto("/dashboard/upgrade-to-pro");

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
  await page.getByTestId('product-summary-product-image', {timeout: 10000}).isVisible();
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

export async function deleteAccount(page) {
  try {
    const baseURL = process.env.BASE_URL;
    await page.goto(`${baseURL}/profile`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await page.getByRole('button', { name: 'Proceed' }).click();
    await page.waitForLoadState('networkidle');

    // Verify user is logged out
    await expect(page.getByTestId('nav-login')).toBeVisible({ timeout: 10000 });
    await page.context().clearCookies();
    await page.close();
  } catch (error) {
    console.error('Error during deleteAccount:', error);
    throw error;
  }
}