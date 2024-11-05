import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export const userData = {
    firstName: faker.person.firstName().toString(),
    middleName: faker.person.middleName().toString(),
    lastName: faker.person.lastName().toString(),
    phoneNumber: faker.phone.number({style: 'national'}).toString(),
    email: faker.internet.email().toString()
};

export async function coreNav(page, navSelect) {
    const navCandidates = ['#nav-nav-campaign-tools', '#nav-nav-good-party-pro', '#nav-nav-get-demo', '#nav-nav-voter-data', '#nav-nav-template-library', '#nav-nav-tour', '#nav-nav-explore-offices'];
    const navVoters = ['#nav-nav-volunteer', '#nav-nav-find-candidates', '#nav-nav-info-session', '#nav-nav-get-stickers', '#nav-nav-discord'];
    const navResources = ['#nav-nav-blog', '#nav-nav-glossary'];
    if(navCandidates.includes(navSelect)) {
        await page.locator('#nav-candidates').click();
        await page.locator(navSelect).click();
    } else if(navVoters.includes(navSelect)) {
        await page.locator('#nav-voters').click();
        await page.locator(navSelect).click();
    } else if(navResources.includes(navSelect)) {
        await page.locator('#nav-resources').click();
        await page.locator(navSelect).click();
    } else {
        await page.locator(navSelect).click();
    }
}

export async function checkButtons(page, buttonsArray) {
        for (const selector of buttonsArray) {
        const buttonLocators = page.locator(selector);
        const count = await buttonLocators.count();

        if (count > 0) {
            await expect(buttonLocators.first()).toBeVisible({ timeout: 5000 });
        } else {
            throw new Error(`No button found for selector: ${selector}`);
        }
    }
}

export async function checkImgAltText(page, imgAltTextArray) {
    for (const altText of imgAltTextArray) {
        const imgLocators = page.locator(`img[alt="${altText}"]`);
        const count = await imgLocators.count();

        expect(count).toBeGreaterThan(0);
        if (count > 0) {
            await expect(imgLocators.first()).toBeVisible({ timeout: 5000 });
        }
    }
}