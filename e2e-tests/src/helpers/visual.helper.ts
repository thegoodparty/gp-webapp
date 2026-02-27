import { expect, type Page, type Locator } from '@playwright/test'
import { WaitHelper } from './wait.helper'

type SnapshotOptions = Parameters<
  ReturnType<typeof expect<Page>>['toHaveScreenshot']
>[0]

/**
 * Takes a full-page screenshot and compares against the committed baseline.
 *
 * Baselines are stored alongside each spec file.
 * To update baselines: npx playwright test --project=stable --update-snapshots
 */
export async function visualSnapshot(
  page: Page,
  name: string,
  options?: SnapshotOptions,
): Promise<void> {
  await WaitHelper.waitForPageReady(page)

  await expect(page).toHaveScreenshot(name, {
    fullPage: false,
    ...(options ?? {}),
  })
}

/**
 * Takes a screenshot of a specific element/component.
 */
export async function visualSnapshotElement(
  locator: Locator,
  name: string,
  options?: Parameters<
    ReturnType<typeof expect<Locator>>['toHaveScreenshot']
  >[0],
): Promise<void> {
  await expect(locator).toHaveScreenshot(name, {
    ...(options ?? {}),
  })
}
