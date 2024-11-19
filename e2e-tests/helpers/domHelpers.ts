import { expect } from '@playwright/test';

export async function checkButtons(page, buttonsArray) {
    for (const buttonText of buttonsArray) {
        const buttonLocators = page.locator(`a:has-text("${buttonText}"), button:has-text("${buttonText}")`);
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