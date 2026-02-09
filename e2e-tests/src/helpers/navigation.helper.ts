import type { Page } from "@playwright/test";
import { WaitHelper } from "./wait.helper";

export class NavigationHelper {
	static async navigateToPage(page: Page, path: string): Promise<void> {
		await page.goto(path);
		await WaitHelper.waitForPageReady(page);
	}

	static async dismissCookieBanner(page: Page): Promise<void> {
		try {
			// Try multiple common cookie banner patterns
			const cookieSelectors = [
				page.getByRole("button", { name: "Close" }),
				page.getByRole("button", { name: /accept/i }),
				page.getByRole("button", { name: /agree/i }),
				page.getByRole("button", { name: /ok/i }),
				page.getByRole("button", { name: /dismiss/i }),
				page.locator(
					'[data-testid*="cookie"] button, [class*="cookie"] button, [id*="cookie"] button',
				),
				page.locator('button:has-text("×"), button:has-text("✕")'),
			];

			for (const selector of cookieSelectors) {
				try {
					if (await selector.first().isVisible({ timeout: 2000 })) {
						console.log("🍪 Dismissing cookie banner");
						await selector.first().click();
						await selector.first().waitFor({ state: "hidden", timeout: 5000 });
						return;
					}
				} catch {
					// Try next selector
				}
			}
		} catch {
			// Cookie banner not present - continue silently
		}
	}

	static async dismissOverlays(page: Page): Promise<void> {
		try {
			// Dismiss cookie banner
			await NavigationHelper.dismissCookieBanner(page);

			// Dismiss promotional overlays
			const promoOverlay = page.getByRole("heading", {
				name: "Win with GoodParty.org Pro!",
			});
			if (await promoOverlay.isVisible({ timeout: 2000 })) {
				await page.getByRole("img").first().click(); // Close button
			}
		} catch {
			// Overlays not present - continue
		}
	}

	static async navigateToNavItem(
		page: Page,
		navItem: string,
		isMobile: boolean = false,
	): Promise<void> {
		if (isMobile) {
			// Open mobile menu
			await page.getByTestId("tilt").nth(1).click();
			await page.getByRole("link", { name: navItem }).click();
			await page.getByTestId("tilt").nth(1).click(); // Close menu
		} else {
			await page.getByRole("link", { name: navItem }).click();
		}

		await WaitHelper.waitForPageReady(page);
	}
}
