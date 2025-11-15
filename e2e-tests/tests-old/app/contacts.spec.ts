import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page, browser }) => {
    await prepareTest('user', '/dashboard/contacts', 'Contacts', page, browser);
    // After loading the page, check for lock icon and retry reload up to 3 times
    const lockIcon = page.locator('button:has-text("Create a Segment"):has(svg.MuiSvgIcon-root)');

    for (let attempt = 0; attempt < 3; attempt++) {
        // Wait 15 seconds before checking
        await page.waitForTimeout(15000);

        if (!(await lockIcon.isVisible())) {
            break; // No lock icon, continue tests
        }

        // If visible, reload and wait for it to disappear (up to 15s)
        await page.reload();
        try {
            await lockIcon.waitFor({ state: 'hidden', timeout: 15000 });
            break;
        } catch {
            if (attempt === 2) {
                throw new Error('Lock icon still visible after 3 reload attempts');
            }
        }
    }
});

setupMultiTestReporting(test, {
    'Create segment on Contacts page': TEST_IDS.GENERATE_SEGMENT,
    'Contacts page statistics': TEST_IDS.CONTACTS_PAGE_STATISTICS
});

test('Contacts page statistics', async ({ page }) => {
    await documentReady(page);
    // Total Constituents card should contain some text
    const totalConstituentsCard = page.getByTestId('totalConstituents-value');
    await expect(totalConstituentsCard).toBeVisible({ timeout: 30000 });
    // Wait for the card to have actual text content (not empty or just whitespace)
    await page.waitForFunction(
        (testId) => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            return element && element.textContent && element.textContent.trim().length > 0;
        },
        'totalConstituents-value',
        { timeout: 30000 }
    );
    await expect(totalConstituentsCard).not.toHaveText('', { timeout: 30000 });

    // Political Makeup card should contain some text
    const politicalMakeupCard = page.getByTestId('politicalMakeup-value');
    await expect(politicalMakeupCard).toBeVisible({ timeout: 30000 });
    // Wait for the card to have actual text content (not empty or just whitespace)
    await page.waitForFunction(
        (testId) => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            return element && element.textContent && element.textContent.trim().length > 0;
        },
        'politicalMakeup-value',
        { timeout: 30000 }
    );
    await expect(politicalMakeupCard).not.toHaveText('', { timeout: 30000 });
});
test('Create segment on Contacts page', async ({ page }) => {
    await documentReady(page);
    const totalConstituentsCard = page.getByTestId('totalConstituents-value');
    await expect(totalConstituentsCard).toBeVisible({ timeout: 30000 });
    // Wait for the card to have actual text content (not empty or just whitespace)
    await page.waitForFunction(
        (testId) => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            return element && element.textContent && element.textContent.trim().length > 0;
        },
        'totalConstituents-value',
        { timeout: 30000 }
    );
    await expect(totalConstituentsCard).not.toHaveText('', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Create a Segment' })).toBeVisible();
    await page.getByRole('button', { name: 'Create a Segment' }).click();
    await expect(page.getByRole('heading', { name: 'General Information' })).toBeVisible();
    await page.getByRole('checkbox').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Create Segment' }).click();
    await expect(page.locator('button').filter({ hasText: 'Custom Segment' })).toBeVisible({ timeout: 30000 });
});