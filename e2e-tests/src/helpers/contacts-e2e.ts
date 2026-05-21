import type { Locator, Page } from '@playwright/test'

/** Filters sheet uses Radix Dialog; match by CTA button and sheet slot. */
export function filtersSheet(page: Page, cta: RegExp): Locator {
  const btn = page.getByRole('button', { name: cta })
  return page
    .locator('[data-slot="sheet-content"]')
    .filter({ has: btn })
    .or(page.getByRole('dialog').filter({ has: btn }))
    .first()
}

/** Person overlay: narrow to the panel that shows Contact Information. */
export function personContactPanel(page: Page): Locator {
  const title = page.getByText('Contact Information', { exact: true })
  return page
    .locator('[data-slot="sheet-content"]')
    .filter({ has: title })
    .or(page.getByRole('dialog').filter({ has: title }))
    .first()
}
