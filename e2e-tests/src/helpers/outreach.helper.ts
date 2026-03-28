import { expect, type Page } from '@playwright/test'
import type { AxiosInstance } from 'axios'
import { WaitHelper } from './wait.helper'
import { NavigationHelper } from './navigation.helper'
import { visualSnapshot, visualSnapshotElement } from './visual.helper'

// ─── Test Seed API Helpers ──────────────────────────────────────
// These call POST /v1/test/seed/campaign which only exists in non-production
// environments and only mutates the authenticated user's own campaign.

/**
 * Sets `isPro: true` (and `isVerified: true`) on the campaign
 * via the test seed endpoint.
 */
export async function makeCampaignPro(
  client: AxiosInstance,
  campaignId: number,
): Promise<void> {
  await client.post('/v1/test/seed/campaign', { campaignId, isPro: true })
}

/**
 * Full setup for a Pro user with approved TCR compliance.
 * Call after authenticateTestUser() with the returned client.
 */
export async function setupProUserWithTcr(
  client: AxiosInstance,
): Promise<{ campaignId: number }> {
  const { data: campaign } = await client.get<{ id: number }>(
    '/v1/campaigns/mine',
  )
  await client.post('/v1/test/seed/campaign', {
    campaignId: campaign.id,
    isPro: true,
    tcrComplianceStatus: 'approved',
  })
  return { campaignId: campaign.id }
}

export async function setupProUserWithTcrAndFreeTexts(
  client: AxiosInstance,
): Promise<{ campaignId: number }> {
  const { data: campaign } = await client.get<{ id: number }>(
    '/v1/campaigns/mine',
  )
  await client.post('/v1/test/seed/campaign', {
    campaignId: campaign.id,
    isPro: true,
    hasFreeTextsOffer: true,
    tcrComplianceStatus: 'approved',
  })
  return { campaignId: campaign.id }
}

/**
 * Sets up route interception to override campaign fields in the
 * `GET /v1/campaigns/mine` response. This works because CampaignProvider
 * uses React Query which refetches on mount (staleTime defaults to 0).
 *
 * MUST be called BEFORE navigating to the page.
 */
export async function setupCampaignOverrides(
  page: Page,
  overrides: Record<string, unknown>,
): Promise<void> {
  await page.route('**/api/v1/campaigns/mine', async (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback()
    }
    const response = await route.fetch()
    const json = (await response.json()) as Record<string, unknown>
    await route.fulfill({
      response,
      json: { ...json, ...overrides },
    })
  })
}

/**
 * Navigates to the outreach page and waits for it to be ready.
 * If campaign overrides were set up via `setupCampaignOverrides`,
 * this also waits for the React Query refetch to complete.
 */
export async function navigateToOutreach(
  page: Page,
  options?: { waitForCampaignRefetch?: boolean },
): Promise<void> {
  const responsePromise = options?.waitForCampaignRefetch
    ? page.waitForResponse(
        (resp) =>
          resp.url().includes('/v1/campaigns/mine') &&
          resp.request().method() === 'GET' &&
          resp.status() === 200,
      )
    : undefined

  await NavigationHelper.navigateToPage(page, '/dashboard/outreach')
  await NavigationHelper.dismissOverlays(page)

  if (responsePromise) {
    await responsePromise
    // Allow React to re-render with the updated campaign data
    await page.waitForTimeout(500)
  }
}

export async function clickTextMessageCard(page: Page): Promise<void> {
  await page.getByText('Text message', { exact: true }).first().click()
}

export async function completeInstructionsStep(page: Page): Promise<void> {
  await expect(
    page.getByRole('heading', { name: 'How this works' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Next' }).click()
}

export async function completeAudienceStep(page: Page): Promise<void> {
  await expect(
    page.getByRole('heading', { name: 'Select target audience' }),
  ).toBeVisible()

  // Select "Unknown" gender and "35-50" age for fast-loading criteria
  await page.getByText('Unknown', { exact: true }).click()
  await page.getByText('35-50', { exact: true }).click()

  // Wait for voter count to update (non-zero)
  await expect(page.getByText('Voters selected:')).toBeVisible()

  await page.getByRole('button', { name: 'Next' }).click()
  await WaitHelper.waitForPageReady(page)
}

export async function completeScriptStep(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Add a script' })).toBeVisible(
    { timeout: 30_000 },
  )
  await page.getByText('Create a new script').click()
  await page.getByRole('button', { name: 'Next' }).click()

  // Type script in the text area
  await expect(
    page.getByRole('heading', { name: 'Add your script' }),
  ).toBeVisible()
  await page
    .getByPlaceholder('Add your script here...')
    .fill(
      'Hello! This is a test campaign message from GoodParty.org. Please support independent candidates in your local elections.',
    )
  await page.getByRole('button', { name: 'Next' }).click()
}

export async function completeImageStep(page: Page): Promise<void> {
  await expect(
    page.getByRole('heading', { name: 'Attach image' }),
  ).toBeVisible()
  await page
    .locator('input[type="file"]')
    .setInputFiles('src/fixtures/heart.png')
  await WaitHelper.waitForPageReady(page)
  await page.getByRole('button', { name: 'Next' }).click()
}

export async function completeScheduleStep(page: Page): Promise<void> {
  // Wait for schedule heading (text-specific)
  await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible()

  // Set date to 4 days from now (must be >= 3 days)
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 4)
  const dateStr = futureDate.toISOString().split('T')[0]!
  await page.locator('input[type="date"]').fill(dateStr)

  // Click the submit/send/schedule button
  await page.getByRole('button', { name: /schedule|send|next/i }).click()
}

/**
 * Complete the free purchase step ($0.00, no Stripe form).
 */
export async function completeFreePurchaseStep(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible({
    timeout: 30_000,
  })

  await expect(page.getByText('$0.00')).toBeVisible()
  await page.getByRole('button', { name: 'Schedule text' }).click()
  await WaitHelper.waitForPageReady(page)
}

/**
 * Complete the paid purchase step using Stripe test card.
 * Stripe Custom Checkout renders a PaymentElement inside an iframe.
 */
export async function completePaidPurchaseStep(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible({
    timeout: 30_000,
  })

  // Wait for Stripe iframe to load
  const stripeFrame = page
    .frameLocator('iframe[name*="__privateStripeFrame"]')
    .first()

  await stripeFrame.getByPlaceholder('1234 1234 1234').fill('4242424242424242')
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/28')
  await stripeFrame.getByPlaceholder('CVC').fill('123')

  await page.getByRole('button', { name: /pay/i }).click()
  await WaitHelper.waitForPageReady(page)
}

/**
 * Verify an outreach campaign exists in the outreach table.
 */
export async function verifyOutreachInTable(
  page: Page,
  expectedType?: string,
): Promise<void> {
  await NavigationHelper.navigateToPage(page, '/dashboard/outreach')

  await expect(
    page.getByRole('heading', { name: 'Your campaigns' }),
  ).toBeVisible({ timeout: 20_000 })

  const table = page.locator('table').first()
  await expect(table).toBeVisible()
  const firstRow = table.locator('tbody tr').first()
  await expect(firstRow).toBeVisible()

  if (expectedType) {
    await expect(firstRow).toContainText(expectedType)
  }
}

// ─── Visual Snapshot Helpers ────────────────────────────────────

const DYNAMIC_MASKS = (page: Page) => ({
  voterCount: page
    .locator('text=Voters selected:')
    .locator('..')
    .locator('.font-bold'),
  dateInputs: page.locator('input[type="date"]'),
  userName: page.getByText(/Test\d+/),
})

export async function snapshotOutreachPage(page: Page): Promise<void> {
  const masks = DYNAMIC_MASKS(page)
  await visualSnapshot(page, 'outreach-page.png', {
    mask: [masks.userName],
  })
}

export async function snapshotModal(page: Page, name: string): Promise<void> {
  // MUI Modal renders as a portal with MuiModal-root class
  const modal = page.locator('.MuiModal-root .MuiBox-root').first()
  await expect(modal).toBeVisible()
  await visualSnapshotElement(modal, name)
}
