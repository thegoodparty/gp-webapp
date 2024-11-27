import 'dotenv/config';
import { expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { userData, generateEmail, generatePhone } from 'helpers/dataHelpers';
import { acceptCookieTerms } from 'helpers/domHelpers';

export async function createAccount(
        page, 
        accountType = null, 
        isLocal = true, 
        zipCode = userData.zipCode, 
        role = null
    ) {
    const loginPageHeader = 'Join GoodParty.org';
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const emailAddress = generateEmail();
    const phoneNumber = generatePhone();
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
    await page.getByRole('textbox', { name: 'password'}).fill(password + '1');
    await page.getByRole('button', { name: 'Join'}).click();

    // Verify user is in onboarding flow
    await page.getByRole('link', { name: 'Finish Later' }).isVisible({ timeout: 5000 });
    await page.waitForURL('**/onboarding/account-type', {
        timeout: 10000,
    });

    // Proceed based on account type
    if (accountType == 'live') {
        await onboardingLive(page, role)
    } else if (accountType == 'manager') {
        await page.getByRole('radio', { name: 'Managing a campaign'}).click();
        await page.getByRole('button', { name: 'Next'}).click();
    } else if (accountType == 'demo') {
        await onboardingDemo(page, isLocal);
    } else {
        return;
    }
}

export async function deleteAccount(page) {
    await page.goto('/profile');

    // Accept cookie terms (if visible)
    await acceptCookieTerms(page);

    await page.getByRole('button', { name: 'Delete Account'}).click();
    await page.getByRole('button', { name: 'Proceed'}).click();
    await expect(page.getByTestId('nav-login')).toBeVisible({ timeout: 10000 });
}

export async function onboardingDemo(page, isLocal = true) {
    // Accept cookie terms (if visible)
    await acceptCookieTerms(page);

    await page.getByRole('radio', { name: 'Just Browsing'}).click();
    await page.getByRole('button', { name: 'Next'}).click();
    await page.getByText("We're excited to have you exploring GoodParty.org!").isVisible();
    await page.getByText("I'm not running, but am actively considering to run in the future").click();
    await page.getByRole('button', { name: 'Next'}).click();
    if(isLocal) {
        await page.getByRole('radio', { name: 'Demo a Local Office'}).click();
        await page.getByText('Next').click();
        await page.getByText('View Dashboard').click();
    } else {
        await page.getByRole('radio', { name: 'Demo a Federal Office'}).click();
        await page.getByText('Next').click();
        await page.getByText('View Dashboard').click();
    }
}

export async function onboardingLive(page, role) {
    // Accept cookie terms (if visible)
    await acceptCookieTerms(page);

    await page.getByRole('radio', { name: 'Currently running for office'}).click();
    await page.getByRole('button', { name: 'Next'}).click();
    await page.getByText("What office are you interested in?").isVisible();
    await page.getByRole('progressbar').waitFor({ state: 'hidden', timeout: 20000 });
    await page.getByRole('button', { name: role }).click();
    await page.getByRole('button', { name: 'Next'}).click();
    await page.getByText("How will your campaign appear on the ballot?").isVisible();
    await page.getByLabel('Other').fill('Test')
    await page.getByRole('button', { name: 'Next'}).click();
    // Agree to GoodParty.org Terms
    await page.getByRole('button', { name: 'I Agree'}).click();
    await page.getByRole('button', { name: 'I Agree'}).click();
    await page.getByRole('button', { name: 'I Agree'}).click();
    await page.getByRole('button', { name: 'I Agree'}).click();
    await page.getByRole('button', { name: 'Submit'}).click();

    await page.getByText('View Dashboard').click();
}