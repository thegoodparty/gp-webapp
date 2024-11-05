import { test, expect } from '@playwright/test';
const { addTestResult } = require('../../../testrailHelper');
const fs = require('fs');
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Navigation Bar', async ({ page }) => {
  const caseId = 2;

  try {
    await page.goto('/');

    // Verify navbar presence
    expect(page.getByTestId('navbar')).toBeVisible();

    // Verify logo presence
    await expect(page.locator('#nav-logo')).toBeVisible();

    // Verify navbar links presence
    await expect(page.locator('#nav-login')).toBeVisible();
    await expect(page.locator('#nav-sign-up')).toBeVisible();
    await expect(page.locator('#nav-get-tools')).toBeVisible();
    await expect(page.locator('#nav-candidates')).toBeVisible();
    await expect(page.locator('#nav-voters')).toBeVisible();
    await expect(page.locator('#nav-resources')).toBeVisible();

    // Verify expandable nav links are not initially visible
    expect(page.locator('#nav-nav-campaign-tools')).not.toBeVisible();
    expect(page.locator('#nav-nav-volunteer')).not.toBeVisible();
    expect(page.locator('#nav-nav-blog')).not.toBeVisible();

    // Verify expandable nav links are visible after clicking to expand
    await page.locator('#nav-candidates').click();
    expect(page.locator('#nav-nav-campaign-tools')).toBeVisible();
    expect(page.locator('#nav-nav-good-party-pro')).toBeVisible();
    expect(page.locator('#nav-nav-get-demo')).toBeVisible();
    expect(page.locator('#nav-nav-voter-data')).toBeVisible();
    expect(page.locator('#nav-nav-template-library')).toBeVisible();
    expect(page.locator('#nav-nav-tour')).toBeVisible();
    expect(page.locator('#nav-nav-explore-offices')).toBeVisible();

    await page.locator('#nav-voters').click()
    expect(page.locator('#nav-nav-volunteer')).toBeVisible();
    expect(page.locator('#nav-nav-find-candidates')).toBeVisible();
    expect(page.locator('#nav-nav-info-session')).toBeVisible();
    expect(page.locator('#nav-nav-get-stickers')).toBeVisible();
    expect(page.locator('#nav-nav-discord')).toBeVisible();

    await page.locator('#nav-resources').click();
    expect(page.locator('#nav-nav-blog')).toBeVisible();
    expect(page.locator('#nav-nav-glossary')).toBeVisible();

    await addTestResult(runId, caseId, 1, 'Test passed');
  } catch (error) {
    await addTestResult(runId, caseId, 5, `Test failed: ${error.message}`);
  }
});