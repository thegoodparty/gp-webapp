import "dotenv/config";
import { expect } from "@playwright/test";
import { coreNav } from "helpers/navHelpers";
import { userData, generateEmail, generatePhone } from "helpers/dataHelpers";
import { acceptCookieTerms } from "helpers/domHelpers";
import * as path from 'path';
import * as fs from 'fs';
import PDFDocument from 'pdfkit';

export async function loginAccount(
  page,
  isOnboarded = true,
  emailAddress,
  password
) {
  await page.goto("/login");

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  // Log into existing account
  await page.getByTestId("login-email-input").nth(1).fill(emailAddress);
  await page.getByTestId("login-password-input").nth(1).fill(password);
  await page.getByTestId("login-submit-button").click();
  if (isOnboarded) {
    // Verify user is on dashboard page
    await page.getByRole("heading", { name: "Path to Victory" }).isVisible();
  } else {
    await page.getByRole("link", { name: "Continue Setup" }).isVisible();
  }
}

export async function createAccount(
  page,
  accountType = null,
  isLocal = true,
  zipCode = "90210",
  role = null,
  password = userData.password,
  campaignEmail = null
) {
  const loginPageHeader = "Join GoodParty.org";
  const firstName = userData.firstName;
  const lastName = userData.lastName;
  const emailAddress = generateEmail();
  const phoneNumber = generatePhone();

  await page.goto("/");
  await coreNav(page, "nav-sign-up");

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

  // Verify user is in onboarding flow
  await page
    .getByRole("link", { name: "Finish Later" })
    .isVisible({ timeout: 5000 });
  await page.waitForURL("**/onboarding/account-type", {
    timeout: 30000,
  });

  // Proceed based on account type
  if (accountType == "live") {
    await onboardingLive(page, role);
  } else if (accountType == "manager") {
    await onboardingMember(page, campaignEmail);
    return emailAddress;
  } else if (accountType == "demo") {
    await onboardingDemo(page, isLocal);
  } else {
    return;
  }
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
  await page.getByRole('heading', { name: 'You are now subscribed to GoodParty.org Pro!', timeout: 60000 }).isVisible();
  await page.getByRole('button', { name: 'Go Back to Dashboard' }).click();
}

export async function deleteAccount(page) {
  await page.goto('/profile');

  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  await page.getByRole("button", { name: "Delete Account" }).click();
  await page.getByRole("button", { name: "Proceed" }).click();
}

export async function onboardingDemo(page, isLocal = true) {
  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  await page.getByRole("radio", { name: "Just Browsing" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .getByText("We're excited to have you exploring GoodParty.org!")
    .isVisible();
  await page
    .getByText(
      "I'm not running, but am actively considering to run in the future"
    )
    .click();
  await page.getByRole("button", { name: "Next" }).click();
  if (isLocal) {
    await page.getByRole("radio", { name: "Demo a Local Office" }).click();
    await page.getByText("Next").click();
    await page.getByText("View Dashboard").click();
  } else {
    await page.getByRole("radio", { name: "Demo a Federal Office" }).click();
    await page.getByText("Next").click();
    await page.getByText("View Dashboard").click();
  }
}

export async function onboardingLive(page, role) {
  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  await page
    .getByRole("radio", { name: "Currently running for office" })
    .click();
  await page.getByRole("button", { name: "Next" }).click();
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
}

export async function onboardingMember(page, campaignEmail) {
  // Accept cookie terms (if visible)
  await acceptCookieTerms(page);

  await page.getByRole("radio", { name: "Managing a campaign" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .locator('input[placeholder="hello@email.com"]')
    .fill(campaignEmail);
  await page.getByRole("button", { name: "Send Request" }).click();
  await page.getByRole("heading", { name: "Request Submitted" }).isVisible();
  await page.getByRole("link", { name: "Return to GoodParty.org" }).click();
}
