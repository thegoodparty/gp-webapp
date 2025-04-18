import { expect } from '@playwright/test';

export async function acceptCookieTerms(page) {
    // Accept cookie terms (if visible)
    try {
        console.log('Cookie terms displayed and accepted');
        await page.getByRole('button', { name: 'Close' }).click();
    } catch(error) {
        console.log('Cookie terms not displayed');
    }
}

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

export async function getNavatticPlayerFrame(page, popUp = false) {
    const outerFrame = await page.locator('iframe').first().contentFrame();
    if (!outerFrame) throw new Error("Outer iframe not found.");
    if(popUp == false) {
        const innerFrame = await outerFrame.locator('#navattic-player').contentFrame();
        return innerFrame;
    } else {
        return outerFrame;
    }
}

export async function documentReady(page) {
    await page.waitForLoadState('domcontentloaded');
}
