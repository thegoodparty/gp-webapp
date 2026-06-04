import { expect, type Page, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { fillClerkSignUpForm } from '../../../src/helpers/clerk.helper'
import { wait } from 'tests/utils/eventually'

test.beforeEach(async ({ page }) => {
  await blockSlowScripts(page)
})

test('authenticate with onboarded user', async ({ page }) => {
  console.log('Setting up authenticated user...')

  await setupClerkTestingToken({ page })

  await page.goto('/sign-up')
  await NavigationHelper.dismissOverlays(page)

  const testUser = await fillClerkSignUpForm(page)

  await page.waitForURL((url) => url.pathname.startsWith('/onboarding/'), {
    timeout: 15000,
  })
  console.log('User created, now completing onboarding...')

  await NavigationHelper.dismissOverlays(page)

  await completeOnboardingFlow(page)

  if (!page.url().includes('/dashboard')) {
    throw new Error(`Onboarding failed - ended at: ${page.url()}`)
  }

  console.log(`Fully onboarded user created: ${testUser.email}`)
  console.log(`Final URL: ${page.url()}`)
})

async function completeOnboardingFlow(page: Page): Promise<void> {
  await completeWelcomeStep(page)
  await completeBallotStatusStep(page)
  await completePartyAffiliationStep(page)
  await completeOfficeSelectionStep(page)
  await completePathToVictoryStep(page)
  await completeVoterDemographicsStep(page)
  await completeOutreachPlanStep(page)
  await completePledgeStep(page)
}

const continueButton = (page: Page) =>
  page.getByRole('button', { name: /continue/i }).first()

async function clickContinue(page: Page): Promise<void> {
  const button = continueButton(page)
  await expect(button).toBeVisible()
  await expect(button).toBeEnabled()
  await button.click()
}

async function completeWelcomeStep(page: Page): Promise<void> {
  console.log('Step: Welcome')
  await expect(
    page.getByRole('heading', { level: 1, name: /winning campaign plan/i }),
  ).toBeVisible({ timeout: 15000 })
  await clickContinue(page)
}

async function completeBallotStatusStep(page: Page): Promise<void> {
  console.log('Step: Ballot status')
  await expect(
    page.getByRole('heading', { level: 1, name: /already on the ballot/i }),
  ).toBeVisible()
  await page.getByRole('radio').first().click({ force: true })
  await clickContinue(page)
}

async function completePartyAffiliationStep(page: Page): Promise<void> {
  console.log('Step: Party affiliation')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /party designation/i,
    }),
  ).toBeVisible()
  await page.getByRole('radio').first().click({ force: true })
  await clickContinue(page)
}

async function completeOfficeSelectionStep(page: Page): Promise<void> {
  console.log('Step: Office selection')
  await expect(
    page.getByRole('heading', { level: 1, name: /what office/i }),
  ).toBeVisible()

  await page.getByLabel(/zip code/i).fill('82001')
  await page.getByRole('button', { name: /search/i }).click()

  const officeGroup = page.getByRole('radiogroup', {
    name: /available offices/i,
  })
  await officeGroup
    .getByRole('radio')
    .first()
    .waitFor({ state: 'visible', timeout: 30000 })
  await officeGroup.getByRole('radio').first().click()

  await wait(1000)

  await clickContinue(page)
}

async function completePathToVictoryStep(page: Page): Promise<void> {
  console.log('Step: Path to victory')
  await expect(
    page.getByRole('heading', { level: 1, name: /votes needed to win/i }),
  ).toBeVisible({ timeout: 30000 })
  // Wait for the metrics card to render before continuing.
  await expect(page.getByText(/votes needed to win/i).first()).toBeVisible({
    timeout: 30000,
  })
  await clickContinue(page)
}

async function completeVoterDemographicsStep(page: Page): Promise<void> {
  console.log('Step: Voter demographics')
  await expect(
    page.getByRole('heading', { level: 1, name: /voter insights/i }),
  ).toBeVisible({ timeout: 15000 })
  await clickContinue(page)
}

async function completeOutreachPlanStep(page: Page): Promise<void> {
  console.log('Step: Outreach plan')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /minimum resources needed/i,
    }),
  ).toBeVisible({ timeout: 30000 })
  await clickContinue(page)
}

async function completePledgeStep(page: Page): Promise<void> {
  console.log('Step: Pledge')
  await expect(
    page.getByRole('heading', { level: 1, name: /almost there/i }),
  ).toBeVisible()
  const submit = page
    .getByRole('button', { name: /agree.*create my plan/i })
    .first()
  await expect(submit).toBeVisible({ timeout: 15000 })
  await expect(submit).toBeEnabled()
  await submit.click()
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
}
