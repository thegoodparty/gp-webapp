import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';

// Setup reporting for navbar test
const navbarCaseId = 2;
setupTestReporting(test, navbarCaseId);

test.skip('Verify Navigation Bar', async ({ page }) => {
  await page.goto('/', { waitUntil: "commit" });

  // Verify navbar presence
  expect(page.getByTestId('navbar')).toBeVisible();

  // Verify logo presence
  await expect(page.locator('[data-testid="navbar"] [data-cy="logo"]')).toBeVisible();

  // Verify navbar links presence
  await expect(page.getByTestId('nav-candidates')).toBeVisible();
  await expect(page.getByTestId('nav-voters')).toBeVisible();
  await expect(page.getByTestId('nav-resources')).toBeVisible();
  await expect(page.getByTestId('nav-our-mission')).toBeVisible();

  // Verify expandable nav links are not initially visible
  expect(page.getByTestId('nav-campaign-tools')).not.toBeVisible();
  expect(page.getByTestId('nav-volunteer')).not.toBeVisible();
  expect(page.getByTestId('nav-blog')).not.toBeVisible();

  // Verify expandable nav links are visible after clicking to expand
  await page.getByTestId('nav-candidates').click();
  expect(page.getByTestId('nav-campaign-tools')).toBeVisible();
  expect(page.getByTestId('nav-good-party-pro')).toBeVisible();
  expect(page.getByTestId('nav-get-demo')).toBeVisible();
  expect(page.getByTestId('nav-voter-data')).toBeVisible();
  expect(page.getByTestId('nav-template-library')).toBeVisible();
  expect(page.getByTestId('nav-tour')).toBeVisible();
  expect(page.getByTestId('nav-explore-offices')).toBeVisible();

  await page.getByTestId('nav-voters').click()
  expect(page.getByTestId('nav-volunteer')).toBeVisible();
  expect(page.getByTestId('nav-find-candidates')).toBeVisible();
  expect(page.getByTestId('nav-info-session')).toBeVisible();
  expect(page.getByTestId('nav-get-stickers')).toBeVisible();
  expect(page.getByTestId('nav-discord')).toBeVisible();

  await page.getByTestId('nav-resources').click();
  expect(page.getByTestId('nav-blog')).toBeVisible();
  expect(page.getByTestId('nav-glossary')).toBeVisible();
});