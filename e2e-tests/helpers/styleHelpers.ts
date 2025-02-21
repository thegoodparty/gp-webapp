import { expect } from "@playwright/test";

export const styleGuideURL = 'https://style.goodparty.org';

export async function getStorybookFrame(page){
    return await page.locator('iframe[title="storybook-preview-iframe"]').contentFrame();
}

export async function validateElements(elements) {
  for (const element of elements) {
    const { locator, text, classRegex, cssProperty, cssValue, cssProperties } = element;

    // Verify visibility
    if (locator) {
      await expect(locator).toBeVisible();
    }

    // Verify text if provided
    if (text) {
      await expect(locator).toHaveText(text);
    }

    // Verify class contains expected class
    if (classRegex) {
      const className = await locator.evaluate((el) => el.className);
      expect(className).toMatch(classRegex);
    }

    // Validate CSS property if provided
    if (cssProperties) {
      // New format: array of property-value pairs
      for (const { property, value } of cssProperties) {
        const actualCSSValue = await locator.evaluate((el, prop) => {
          return window.getComputedStyle(el)[prop];
        }, property);
        expect(actualCSSValue).toBe(value);
      }
    } else if (cssProperty && cssValue) {
      const actualCSSValue = await locator.evaluate((el, prop) => {
        return window.getComputedStyle(el)[prop];
      }, cssProperty);
      expect(actualCSSValue).toBe(cssValue);
    }
  }
}