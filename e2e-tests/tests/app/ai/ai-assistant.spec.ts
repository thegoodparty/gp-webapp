import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('AI Assistant', () => {
  test('should access AI Assistant with authenticated user', async ({
    page,
  }) => {
    console.log(`🧪 Testing AI Assistant with authenticated user`)
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)

    await page.goto('/dashboard/campaign-assistant')
    await WaitHelper.waitForPageReady(page)

    await expect(
      page.getByRole('heading', { name: 'AI Assistant' }),
    ).toBeVisible()

    const topicButtons = page
      .getByRole('button')
      .filter({ hasText: /Campaign|Strategy/ })
    const buttonCount = await topicButtons.count()

    if (buttonCount > 0) {
      console.log(`✅ AI Assistant working - ${buttonCount} topics available`)
    }

    await visualSnapshot(page, 'ai-assistant.png')
  })
})
