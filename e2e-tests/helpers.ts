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
    const navCandidates = ['nav-campaign-tools', 'nav-good-party-pro', 'nav-get-demo', 'nav-voter-data', 'nav-template-library', 'nav-tour', 'nav-explore-offices'];
    const navVoters = ['nav-volunteer', 'nav-find-candidates', 'nav-info-session', 'nav-get-stickers', 'nav-discord'];
    const navResources = ['nav-blog', 'nav-glossary'];
    if(navCandidates.includes(navSelect)) {
        await page.getByTestId('nav-candidates').click();
        await page.getByTestId(navSelect).click();
    } else if(navVoters.includes(navSelect)) {
        await page.getByTestId('nav-voters').click();
        await page.getByTestId(navSelect).click();
    } else if(navResources.includes(navSelect)) {
        await page.getByTestId('nav-resources').click();
        await page.getByTestId(navSelect).click();
    } else {
        await page.getByTestId(navSelect).click();
    }
}

export async function checkButtons(page, buttonsArray) {
        for (const buttonText of buttonsArray) {
        const buttonLocators = page.locator('button', { hasText: buttonText});
        const count = await buttonLocators.count();

        if (count > 0) {
            await expect(buttonLocators.first()).toBeVisible({ timeout: 5000 });
        } else {
            throw new Error(`No button found with text: ${buttonText}`);
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