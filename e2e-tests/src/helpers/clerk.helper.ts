import type { Locator, Page } from '@playwright/test'
import { TestDataHelper } from './data.helper'

export const getClerkContinueButton = (page: Page): Locator =>
  page.getByRole('button', { name: /^continue$/i })

export const fillClerkSignUpForm = async (page: Page) => {
  const testUser = TestDataHelper.generateTestUserData()

  await page.locator('input[name=firstName]').fill(testUser.firstName)
  await page.locator('input[name=lastName]').fill(testUser.lastName)
  await page.locator('input[name=emailAddress]').fill(testUser.email)
  await page.locator('input[name=password]').fill(testUser.password)
  await getClerkContinueButton(page).click()

  return testUser
}
