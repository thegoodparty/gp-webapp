import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { appNav } from '@helpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.describe('Mobile viewport tests - App pages', () => {
    test.use({
        storageState: 'auth.json',
        viewport: { width: 375, height: 667 }
    });
    test.describe.configure({ retries: 2 });
    
    test.skip('Verify app pages in mobile view', async ({ page }) => {
        const caseId = 75;
        try {
            await page.goto("/dashboard", { 
                waitUntil: "networkidle",
                timeout: 30000 
            });
            
            const verifyPage = async (navItem: string, expectedHeading: string) => {
                await appNav(page, navItem, true);
                await page.waitForLoadState('networkidle');
                await expect(page.getByRole('heading', { name: expectedHeading }))
                    .toBeVisible({ timeout: 10000 });
            };
            
            await verifyPage('AI Assistant', 'AI Assistant');
            await expect(page.getByPlaceholder('Ask me anything about your campaign...')).toBeVisible({ timeout: 10000 });
            await verifyPage('Content Builder', 'Content Builder');
            await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible({ timeout: 10000 });
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
            await appNav(page, 'Voter Data', true);
            await page.getByRole('heading', { name: 'Upgrade to Pro for just $10 a month!' }).isVisible()
            await page.getByRole('button', { name: 'Join Pro Today' }).isVisible();

            await addTestResult(runId, caseId, 1, 'Test passed');
        } catch (error) {
            await handleTestFailure(page, runId, caseId, error);
        }
    })
});