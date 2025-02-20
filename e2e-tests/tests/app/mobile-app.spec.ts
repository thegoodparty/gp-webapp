import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { addTestResult, authFileCheck, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { appNav } from '@helpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

authFileCheck(test);
test.describe('Mobile viewport tests - App pages', () => {
    test.use({
        viewport: { width: 375, height: 667 }
    });
    test('Verify app pages in mobile view', async ({ page }) => {
        const caseId = 75;
        await skipNonQA(test);

        try {
            await page.goto("/dashboard")
            // Verify AI assistant page
            await appNav(page, 'AI Assistant', true);
            await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible();
            await expect(page.getByPlaceholder('Ask me anything about your campaign...')).toBeVisible();
            // Verify Content Builder page
            await appNav(page, 'Content Builder', true);
            await expect(page.getByRole('heading', { name: 'Content Builder' })).toBeVisible();
                // Dismiss tutorial (if visible)
                if(page.getByRole('heading', { name: 'Content Creation, Simplified' }).isVisible()) {
                    await page.getByRole('button', { name: '×' }).click();
                }
            await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
            // Verify My Profile page
            await appNav(page, 'My Profile', true);
            await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();
            await expect(page.getByPlaceholder('Campaign Committee')).toBeVisible();
            await expect(page.getByLabel('Occupation *')).toBeVisible();
            await expect(page.getByLabel('Campaign website')).toBeVisible();
            await expect(page.locator('section').filter({ hasText: 'Campaign Details' }).getByRole('button')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Office Details' })).toBeVisible();
            await expect(page.getByRole('heading', { name: "Who you're running against" })).toBeVisible();
            await expect(page.getByRole('heading', { name: "Fun Fact About Yourself" })).toBeVisible();
            await expect(page.getByRole('heading', { name: "Your Top Issues" })).toBeVisible();
            // Verify Voter Data page
            await appNav(page, 'Voter Data', true);
            await expect.soft(async () => {
                const isProUpgradeVisible = await page
                    .getByRole('heading', { name: 'Upgrade to Pro for just $10 a month!' })
                    .isVisible()
                    && await page.getByRole('button', { name: 'Join Pro Today' }).isVisible();

                const isVoterFileVisible = await page
                    .getByRole('heading', { name: 'Voter File' })
                    .isVisible()
                    && await page.getByText('Voter file', { exact: true }).isVisible()
                    && await page.getByText('Door Knocking', { exact: true }).isVisible()
                    && await page.getByText('Texting', { exact: true }).isVisible()
                    && await page.getByText('Direct Mail (Default)', { exact: true }).isVisible()
                    && await page.getByText('Facebook', { exact: true }).isVisible()
                    && await page.getByText('Phone Banking', { exact: true }).isVisible();

                expect(isProUpgradeVisible || isVoterFileVisible).toBeTruthy();
            }).toPass();
            // Verify Campaign Team page
            await appNav(page, 'Campaign Team', true);
            await expect(page.getByRole('heading', { name: 'Campaign Team' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'You do not have any team members yet.' })).toBeVisible();

            // Report test results
            await addTestResult(runId, caseId, 1, 'Test passed');
        } catch (error) {

            // Report test results
            await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
        }
    })
});