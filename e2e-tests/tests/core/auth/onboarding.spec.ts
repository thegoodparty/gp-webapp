import { expect, type Page, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { fillClerkSignUpForm } from '../../../src/helpers/clerk.helper'

test.beforeEach(async ({ page }) => {
  await blockSlowScripts(page)
})

test('authenticate with onboarded user', async ({ page }) => {
  console.log('Setting up authenticated user...')

  await setupClerkTestingToken({ page })

  await page.goto('/sign-up')
  await NavigationHelper.dismissOverlays(page)

  const testUser = await fillClerkSignUpForm(page)

  await page.waitForURL((url) => url.toString().includes('/onboarding/'), {
    timeout: 3000,
  })
  console.log('User created, now completing onboarding...')

  await fillZipCode(page)
  await waitForOfficesLoad(page)

  await completeOnboardingFlow(page)

  if (!page.url().includes('/dashboard')) {
    throw new Error(`Onboarding failed - ended at: ${page.url()}`)
  }

  console.log(`Fully onboarded user created: ${testUser.email}`)
  console.log(`Final URL: ${page.url()}`)
})

async function completeOnboardingFlow(page: Page): Promise<void> {
  await completeStep1OfficeSelection(page)
  await completeStep2PartySelection(page)
  await completeStep3PledgeAgreement(page)
  await completeStep4FinishOnboarding(page)
}

async function completeStep1OfficeSelection(page: Page): Promise<void> {
  console.log('Completing Step 1: Office Selection')

  await fillZipCode(page)
  await selectOfficeLevel(page)
  await waitForOfficesLoad(page)
  await selectOffice(page)
  await proceedToStep2(page)

  console.log('Completed Step 1 - moved to step 2')
}

async function fillZipCode(page: Page): Promise<void> {
  const zipField = page.getByLabel('Zip Code')
  await zipField.fill('82001')
}

async function selectOfficeLevel(page: Page): Promise<void> {
  let levelSelected = false

  const levelSelect = page.getByLabel('Office Level')
  if (await levelSelect.isVisible({ timeout: 3000 })) {
    try {
      await levelSelect.selectOption('Local/Township/City')
      levelSelected = true
    } catch {
      await levelSelect.selectOption({ index: 1 })
      levelSelected = true
    }
  }

  if (!levelSelected) {
    const anySelect = page.locator('select').first()
    if (await anySelect.isVisible({ timeout: 3000 })) {
      await anySelect.selectOption({ index: 1 })
    }
  }
}

async function waitForOfficesLoad(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const text = document.body.textContent || ''
      return text.includes('offices found') || text.includes('office found')
    },
    { timeout: 30000 },
  )
}

async function selectOffice(page: Page): Promise<void> {
  let officeSelected = false

  const officeRadios = page.locator('input[type="radio"]')
  const radioCount = await officeRadios.count()

  if (radioCount > 0) {
    await officeRadios.first().click()
    officeSelected = true
    console.log('Selected office via radio button')
  } else {
    const officeButtons = page.getByRole('button').filter({
      hasText:
        /Council|Mayor|Board|Commission|Village|County|Flat Rock|Henderson/,
    })
    const buttonCount = await officeButtons.count()

    if (buttonCount > 0) {
      await officeButtons.first().click()
      officeSelected = true
      console.log('Selected office via button')
    }
  }

  if (!officeSelected) {
    throw new Error('Could not select an office')
  }

  await page.waitForFunction(
    () => {
      const buttons = Array.from(document.querySelectorAll('button'))
      for (const button of buttons) {
        if (button.textContent?.includes('Next') || button.type === 'submit') {
          return !(button as HTMLButtonElement).disabled
        }
      }
      return false
    },
    { timeout: 10000 },
  )
}

async function proceedToStep2(page: Page): Promise<void> {
  const nextButton = page.getByRole('button', { name: 'Next' }).first()
  await expect(nextButton).toBeVisible()
  await expect(nextButton).toBeEnabled()
  await nextButton.click()

  await page.waitForURL(
    (url) => /\/onboarding\/[^/]+\/2/.test(url.toString()),
    {
      timeout: 10000,
    },
  )
}

async function completeStep2PartySelection(page: Page): Promise<void> {
  console.log('Completing Step 2: Party Selection')

  await page.getByText('How will your campaign appear on the ballot?').waitFor({
    state: 'visible',
    timeout: 3000,
  })

  await selectPartyAffiliation(page)
  await proceedToStep3(page)

  console.log('Completed Step 2 - moved to step 3')
}

async function selectPartyAffiliation(page: Page): Promise<void> {
  let partySelected = false

  const otherLabel = page.getByLabel('Other')
  if (await otherLabel.isVisible({ timeout: 3000 })) {
    await otherLabel.fill('Independent')
    partySelected = true
    console.log("Filled 'Other' party field")
  } else {
    const textInputs = page.locator('input[type="text"]')
    const inputCount = await textInputs.count()

    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        try {
          const input = textInputs.nth(i)
          await input.fill('Independent')

          const value = await input.inputValue()
          if (value === 'Independent') {
            partySelected = true
            console.log(`Filled party input field ${i}`)
            break
          }
        } catch {}
      }
    }
  }

  if (!partySelected) {
    const partyRadios = page.locator('input[type="radio"]')
    const radioCount = await partyRadios.count()

    if (radioCount > 0) {
      await partyRadios.first().click()
      partySelected = true
      console.log('Selected party via radio button')
    }
  }

  if (!partySelected) {
    throw new Error('Could not select party affiliation')
  }

  await page.waitForFunction(
    () => {
      const buttons = Array.from(document.querySelectorAll('button'))
      for (const button of buttons) {
        if (button.textContent?.includes('Next') || button.type === 'submit') {
          return !(button as HTMLButtonElement).disabled
        }
      }
      return false
    },
    { timeout: 10000 },
  )
}

async function proceedToStep3(page: Page): Promise<void> {
  const nextButton = page.getByRole('button', { name: 'Next' }).first()
  await expect(nextButton).toBeVisible()

  const isEnabled = await nextButton.isEnabled()
  if (!isEnabled) {
    console.warn('Next button not enabled, checking form state...')
    const buttonAttrs = await nextButton.evaluate((el) => ({
      disabled: (el as HTMLButtonElement).disabled,
      'data-step': el.getAttribute('data-step'),
      'data-party': el.getAttribute('data-party'),
      'data-other-party': el.getAttribute('data-other-party'),
    }))
    console.log('Button attributes:', buttonAttrs)
  }

  await nextButton.click()

  await page.waitForURL(
    (url) => /\/onboarding\/[^/]+\/3/.test(url.toString()),
    {
      timeout: 5000,
    },
  )
}

async function completeStep3PledgeAgreement(page: Page): Promise<void> {
  console.log('Completing Step 3: Pledge Agreement')

  await acceptPledge(page)
  await proceedToStep4(page)

  console.log('Completed Step 3 - moved to step 4')
}

async function acceptPledge(page: Page): Promise<void> {
  const agreeButton = page.getByRole('button', { name: 'I Agree' })
  await agreeButton.waitFor({ state: 'visible' })
  await agreeButton.click()
}

async function proceedToStep4(page: Page): Promise<void> {
  await page.waitForURL(
    (url) => /\/onboarding\/[^/]+\/4/.test(url.toString()),
    {
      timeout: 5000,
    },
  )
}

async function completeStep4FinishOnboarding(page: Page): Promise<void> {
  console.log('Completing Step 4: Finish Onboarding')

  await navigateToDashboard(page)
  await verifyDashboardAccess(page)

  console.log('Reached dashboard - onboarding complete!')
}

async function navigateToDashboard(page: Page): Promise<void> {
  const viewDashboardButton = page.getByRole('button', {
    name: 'View Dashboard',
  })
  await viewDashboardButton.waitFor({ state: 'visible' })
  await viewDashboardButton.click()
}

async function verifyDashboardAccess(page: Page): Promise<void> {
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
}
