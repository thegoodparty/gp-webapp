import 'dotenv/config';
import { expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { userData, generateEmail, generatePhone } from 'helpers/dataHelpers';
import { acceptCookieTerms } from 'helpers/domHelpers';

export async function createAccount(page) {
    const loginPageHeader = 'Join GoodParty.org';
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const emailAddress = generateEmail();
    const phoneNumber = generatePhone();
    const zipCode = userData.zipCode;
    const password = userData.password;

    await page.goto('/');
    await coreNav(page, 'nav-sign-up');

    // Verify user is on login page
    await expect(page.getByText(loginPageHeader)).toBeVisible();

    // Fill in sign up page
    await page.getByRole('textbox', { name: 'First Name'}).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name'}).fill(lastName);
    await page.getByRole('textbox', { name: 'email'}).fill(emailAddress);
    await page.getByRole('textbox', { name: 'phone'}).fill(phoneNumber);
    await page.getByRole('textbox', { name: 'Zip Code'}).fill(zipCode);
    await page.getByRole('textbox', { name: 'password'}).fill(password);
    await page.getByRole('button', { name: 'Join'}).click();

    // Verify user is in onboarding flow
    await page.getByRole('link', { name: 'Finish Later' }).isVisible({ timeout: 5000 });
    await page.waitForURL('**/onboarding/account-type', {
        timeout: 10000,
    });
}

export async function deleteAccount(page) {
    await page.goto('/profile');

    // Accept cookie terms (if visible)
    await acceptCookieTerms(page);

    await page.getByRole('button', { name: 'Delete Account'}).click();
    await page.getByRole('button', { name: 'Proceed'}).click();
    await expect(page.getByTestId('nav-login')).toBeVisible({ timeout: 10000 });
}