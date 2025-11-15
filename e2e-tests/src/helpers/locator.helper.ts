import { Page, Locator } from "@playwright/test";

export class LocatorHelper {
  /**
   * Get the first visible element when multiple elements match
   */
  static async getFirstVisible(page: Page, locatorFn: () => Locator): Promise<Locator> {
    const locator = locatorFn();
    const count = await locator.count();
    
    if (count === 1) {
      return locator;
    }
    
    // Find the first visible element
    for (let i = 0; i < count; i++) {
      const element = locator.nth(i);
      if (await element.isVisible({ timeout: 1000 })) {
        return element;
      }
    }
    
    // Fallback to first element
    return locator.first();
  }

  /**
   * Get element by role with fallback for duplicates
   */
  static getByRoleSafe(page: Page, role: string, options?: { name?: string | RegExp }): Locator {
    const locator = page.getByRole(role as any, options);
    return locator.first(); // Always use first for safety
  }

  /**
   * Get element by test ID with fallback for duplicates
   */
  static getByTestIdSafe(page: Page, testId: string): Locator {
    return page.getByTestId(testId).first();
  }

  /**
   * Get element by text with fallback for duplicates
   */
  static getByTextSafe(page: Page, text: string | RegExp): Locator {
    return page.getByText(text).first();
  }

  /**
   * Get element by alt text with fallback for duplicates
   */
  static getByAltTextSafe(page: Page, altText: string): Locator {
    return page.getByAltText(altText).first();
  }
}
