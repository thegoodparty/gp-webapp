import { expect, type Page, type Locator } from '@playwright/test'
import { WaitHelper } from './wait.helper'

const VISUAL_TESTS_ENABLED = process.env.VISUAL_TESTS === 'true'

type SnapshotOptions = Parameters<ReturnType<typeof expect<Page>>['toHaveScreenshot']>[0]

/**
 * Takes a full-page screenshot and compares against the committed baseline.
 * No-op when VISUAL_TESTS env var is not set — safe to add to any existing test.
 *
 * Baselines are stored in __visual_snapshots__ next to each spec file.
 * To generate/update baselines: VISUAL_TESTS=true npx playwright test --project=visual --update-snapshots
 */
export async function visualSnapshot(
  page: Page,
  name: string,
  options?: SnapshotOptions,
): Promise<void> {
  if (!VISUAL_TESTS_ENABLED) return

  await WaitHelper.waitForPageReady(page)

  await expect(page).toHaveScreenshot(name, {
    animations: 'disabled',
    fullPage: false,
    ...(options ?? {}),
  })
}

/**
 * Takes a screenshot of a specific element/component.
 * No-op when VISUAL_TESTS env var is not set.
 */
export async function visualSnapshotElement(
  locator: Locator,
  name: string,
  options?: Parameters<ReturnType<typeof expect<Locator>>['toHaveScreenshot']>[0],
): Promise<void> {
  if (!VISUAL_TESTS_ENABLED) return

  await expect(locator).toHaveScreenshot(name, {
    animations: 'disabled',
    ...(options ?? {}),
  })
}
