import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { blockSlowScripts } from '../../../src/helpers/navigation.helper'

const LONG_NO_SPACE = 'asdfasdfadsf'.repeat(20)

test.describe('Policy priority overflow (ENG-10268)', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('long no-space title does not push the modal off screen', async ({
    page,
  }) => {
    test.setTimeout(120000)
    await authenticateTestUser(page)

    await page.goto('/dashboard/profile/texting-compliance/candidate-profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Add a policy priority' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const titleInput = dialog.locator('#policy-title')
    await titleInput.fill(LONG_NO_SPACE)

    // The rich-text "Policy focus" editor is the field that pushed the modal
    // wide in the original report; type a long no-space string into it too.
    const editor = dialog.locator('.ql-editor')
    await editor.click()
    await editor.pressSequentially(LONG_NO_SPACE)

    // The reported bug: a long no-space string pushes content off screen,
    // producing a horizontal scrollbar on the document.
    const pageOverflowX = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )
    expect(pageOverflowX, 'document should not scroll horizontally').toBe(false)

    // The dialog itself must not be wider than its content box can show.
    const dialogOverflowX = await dialog.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    )
    expect(dialogOverflowX, 'dialog should not overflow horizontally').toBe(
      false,
    )
  })
})
