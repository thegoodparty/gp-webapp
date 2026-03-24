import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { WaitHelper } from 'src/helpers/wait.helper'
import { NavigationHelper } from 'src/helpers/navigation.helper'
import {
  setupProUserWithTcr,
  setupProUserWithTcrAndFreeTexts,
  makeCampaignPro,
  navigateToOutreach,
  clickTextMessageCard,
  completeInstructionsStep,
  completeAudienceStep,
  completeScriptStep,
  completeImageStep,
  completeScheduleStep,
  completeFreePurchaseStep,
  completePaidPurchaseStep,
  verifyOutreachInTable,
  snapshotOutreachPage,
  snapshotModal,
} from 'src/helpers/outreach.helper'

test.describe('Peerly P2P Text Campaign @experimental', () => {
  // ─── Test 1: Paid P2P Text Campaign ──────────────────────────────
  test('paid text campaign — full flow through Stripe', async ({ page }) => {
    const { client } = await authenticateTestUser(page, { isolated: true })
    await setupProUserWithTcr(client)

    await navigateToOutreach(page)

    // Verify outreach page loaded
    await expect(
      page.getByText('Text message', { exact: true }).first(),
    ).toBeVisible()

    await clickTextMessageCard(page)

    // Complete all flow steps
    await completeInstructionsStep(page)
    await completeAudienceStep(page)

    await completeScriptStep(page)
    await completeImageStep(page)
    await completeScheduleStep(page)
    await completePaidPurchaseStep(page)

    // Verify campaign appears in outreach table
    await verifyOutreachInTable(page, 'Text message')
  })

  // ─── Test 2: Free 5,000 SMS Promo ───────────────────────────────
  test('free text campaign — 5,000 SMS promo with $0 payment', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, { isolated: true })
    await setupProUserWithTcrAndFreeTexts(client)

    await navigateToOutreach(page)

    // Verify the free texts banner is visible
    await expect(
      page.getByText('Send up to 5,000 texts for free'),
    ).toBeVisible()

    // Verify "Text message" card shows "5,000 Free"
    await expect(page.getByText('5,000 Free')).toBeVisible()

    await clickTextMessageCard(page)
    await completeInstructionsStep(page)

    // Verify the free texts banner in the audience step
    await expect(
      page.getByText('Your first text gets up to 5,000 Free messages'),
    ).toBeVisible()

    await completeAudienceStep(page)
    await completeScriptStep(page)
    await completeImageStep(page)
    await completeScheduleStep(page)

    // Free flow: $0.00 total, "Schedule text" button instead of Stripe
    await completeFreePurchaseStep(page)

    await verifyOutreachInTable(page, 'Text message')
  })

  // ─── Test 3: Free Texts Via Banner "Send" Link ──────────────────
  test('free texts via banner "Send" link opens text flow', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, { isolated: true })
    await setupProUserWithTcrAndFreeTexts(client)

    await navigateToOutreach(page)

    // Click "Send" link in the free texts banner
    await expect(
      page.getByText('Send up to 5,000 texts for free'),
    ).toBeVisible()
    await page.getByText('Send', { exact: true }).click()

    // Verify the TaskFlow modal opens at the instructions step
    await expect(
      page.getByRole('heading', { name: 'How this works' }),
    ).toBeVisible()

    // Complete rest of flow
    await completeInstructionsStep(page)
    await completeAudienceStep(page)
    await completeScriptStep(page)
    await completeImageStep(page)
    await completeScheduleStep(page)
    await completeFreePurchaseStep(page)

    await verifyOutreachInTable(page, 'Text message')
  })

  // ─── Test 4: Non-Pro User → P2P Upgrade Modal ──────────────────
  test('non-Pro user clicking Text message shows P2P upgrade modal', async ({
    page,
  }) => {
    await authenticateTestUser(page)

    await NavigationHelper.navigateToPage(page, '/dashboard/outreach')
    await NavigationHelper.dismissOverlays(page)
    await WaitHelper.waitForPageReady(page)

    // Click "Text message" create card
    await clickTextMessageCard(page)

    // Verify P2PUpgradeModal appears
    await expect(
      page.getByText('Level the playing field for less'),
    ).toBeVisible()
    await expect(
      page.getByText('Send 5,000 free texts to voters'),
    ).toBeVisible()

    // Verify CTA links to upgrade page
    const upgradeLink = page.getByRole('link', { name: 'Upgrade now' })
    await expect(upgradeLink).toBeVisible()
    await expect(upgradeLink).toHaveAttribute('href', /upgrade-to-pro/)

    // Visual snapshot of the modal
    await snapshotModal(page, 'outreach-p2p-upgrade-modal.png')

    // Close modal
    await page.locator('.modal-close').click()
    await expect(
      page.getByText('Level the playing field for less'),
    ).not.toBeVisible()
  })

  // ─── Test 5: Pro User Without TCR → Compliance Modal ────────────
  test('Pro user without TCR compliance shows compliance modal', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, { isolated: true })

    // Make campaign Pro but do NOT seed TCR compliance
    const { data: campaign } = await client.get<{ id: number }>(
      '/v1/campaigns/mine',
    )
    await makeCampaignPro(client, campaign.id)

    await navigateToOutreach(page)

    await clickTextMessageCard(page)

    // Verify ComplianceModal appears (not P2PUpgradeModal)
    await expect(
      page.getByText('Action required: register for texting compliance'),
    ).toBeVisible()

    // Verify CTA links to compliance registration
    const registerLink = page.getByRole('link', {
      name: 'Start Registration',
    })
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toHaveAttribute('href', /texting-compliance/)

    // Visual snapshot of the modal
    await snapshotModal(page, 'outreach-compliance-modal.png')

    // Close modal via Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(
      page.getByText('Action required: register for texting compliance'),
    ).not.toBeVisible()
  })

  // ─── Test 6: Visual Snapshots ───────────────────────────────────
  test('visual snapshots of outreach page and modals', async ({ page }) => {
    await authenticateTestUser(page)

    await NavigationHelper.navigateToPage(page, '/dashboard/outreach')
    await NavigationHelper.dismissOverlays(page)
    await WaitHelper.waitForPageReady(page)

    // Snapshot: Outreach page with create cards
    await snapshotOutreachPage(page)

    // Snapshot: P2PUpgradeModal (non-Pro user clicking Text)
    await clickTextMessageCard(page)
    await expect(
      page.getByText('Level the playing field for less'),
    ).toBeVisible()
    await snapshotModal(page, 'outreach-p2p-upgrade-modal-visual.png')

    // Close modal
    await page.locator('.modal-close').click()
    await expect(
      page.getByText('Level the playing field for less'),
    ).not.toBeVisible()
  })
})
