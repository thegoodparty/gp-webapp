import { type Page, expect } from '@playwright/test'
import type { AxiosInstance } from 'axios'
import {
  authenticateTestUser,
  type AuthenticatedUser,
  type TestUserOptions,
} from 'tests/utils/api-registration'
import { wait } from 'tests/utils/eventually'

type SetupResult = {
  user: AuthenticatedUser
  client: AxiosInstance
}

export const setupElectedOfficeUser = async (
  page: Page,
  raceOptions?: TestUserOptions['race'],
): Promise<SetupResult> => {
  const race = raceOptions ?? {
    zip: '82001',
    office: 'Cheyenne City Council - Ward 2',
  }

  const { user, client } = await authenticateTestUser(page, {
    isolated: true,
    race,
  })

  await page.goto('/dashboard/election-result')
  await wait(250)
  await page
    .getByRole('button', { name: 'I won my race' })
    .click({ timeout: 10000 })
  await page.waitForURL('**/polls/welcome', { timeout: 15000 })

  return { user, client }
}

export const switchOrganization = async (
  page: Page,
  orgNameSubstring: string,
) => {
  const trigger = page
    .locator('[data-sidebar="header"]')
    .getByRole('button')
    .first()
  await trigger.click()

  const item = page.getByRole('menuitem', { name: orgNameSubstring })
  await item.click()

  await page.waitForLoadState('domcontentloaded')
}

export const getSelectedOrgName = async (page: Page): Promise<string> => {
  const name = page
    .locator('[data-sidebar="header"]')
    .locator('.font-semibold')
    .first()
  return ((await name.textContent()) ?? '').trim()
}

export const getOrgPickerOptions = async (page: Page): Promise<string[]> => {
  const trigger = page
    .locator('[data-sidebar="header"]')
    .getByRole('button')
    .first()
  await trigger.click()

  const items = page.getByRole('menuitem')
  await expect(items.first()).toBeVisible()
  const texts: string[] = []
  const count = await items.count()
  for (let i = 0; i < count; i++) {
    const text = await items.nth(i).textContent()
    texts.push((text ?? '').trim())
  }

  await page.keyboard.press('Escape')

  return texts
}
