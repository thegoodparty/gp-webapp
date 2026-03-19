import { expect, test } from '@playwright/test'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'

interface RegistrationUser {
  firstName: string
  lastName: string
  email: string
  zip: string
  phone: string
}

interface RegistrationResponseBody {
  user?: RegistrationUser
  data?: {
    user?: RegistrationUser
  }
}

const jsonAs = <T>(response: { json(): Promise<T> }): Promise<T> =>
  response.json()

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Sign Up Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should display sign up form elements', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)
    await expect(
      page.getByRole('heading', { name: 'Join GoodParty.org' }),
    ).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'First Name' }),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'email' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'phone' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Zip Code' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()
  })

  test('should validate and process form data correctly', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)

    const testZip = '94066'
    const unique = TestDataHelper.generateTimestamp()
    const { email: testEmail, phone: testPhone } =
      TestDataHelper.generateTestUser()
    await page
      .getByRole('textbox', { name: 'First Name' })
      .fill(` firstName-${unique}`)
    await page
      .getByRole('textbox', { name: 'Last Name' })
      .fill(` lastName-${unique}`)
    await page.getByRole('textbox', { name: 'email' }).fill(testEmail)
    await page.getByRole('textbox', { name: 'phone' }).fill(testPhone)
    await page.getByRole('textbox', { name: 'Zip Code' }).fill(testZip)
    await page
      .getByRole('textbox', { name: 'password' })
      .fill('TestPassword123!')
    await page.getByRole('button', { name: 'Join' }).click()
    const registerResponse = await page.waitForResponse((resp) => {
      return (
        resp.url().includes('/register') &&
        resp.request().method() === 'POST' &&
        !!resp.headers()['content-type']?.includes('application/json')
      )
    })

    const body = await jsonAs<RegistrationResponseBody>(registerResponse)
    // Handle possible response shapes: { user: {...} } or { data: { user: {...} } }
    const user = body.user ?? body.data?.user
    expect(
      user,
      `Unexpected registration response shape: ${JSON.stringify(body)}`,
    ).toBeTruthy()
    if (!user) {
      throw new Error(
        `Unexpected registration response shape: ${JSON.stringify(body)}`,
      )
    }
    const { firstName, lastName, email, zip, phone } = user
    expect(firstName).toBe(firstName.trim())
    expect(lastName).toBe(lastName.trim())
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(email.trim()).toBe(email)
    expect(emailRegex.test(email)).toBeTruthy()
    const zipRegex = /^\d{5}(?:-\d{4})?$/
    expect(zip.trim()).toBe(zip)
    expect(zipRegex.test(zip)).toBeTruthy()
    const phoneRegex = /^\d{10}$/
    expect(phone.trim()).toBe(phone)
    expect(phoneRegex.test(phone)).toBeTruthy()
    await expect(page).toHaveURL(/\/onboarding/)

    await page.waitForFunction(
      () => {
        const text = document.body.textContent || ''
        return text.includes('offices found') || text.includes('office found')
      },
      { timeout: 15000 },
    )
  })
})
