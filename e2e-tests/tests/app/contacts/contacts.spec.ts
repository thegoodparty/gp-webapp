import { expect, test } from "@playwright/test";
import { NavigationHelper } from "src/helpers/navigation.helper";
import { authenticateTestUser } from "tests/utils/api-registration";

/**
 * E2E: Contacts page.
 */
test.describe("Contacts Page", () => {
	test("contacts page functionality", async ({ page }) => {
		test.setTimeout(60 * 1000);
		// Test started

		// --- Auth & setup: register/login test user ---
		await authenticateTestUser(page, { isolated: true });
		// Authenticated user

		// --- Get elected office ---
		await page.goto("/dashboard/election-result");
		await page
			.getByRole("button", { name: "I won my race" })
			.click({ timeout: 10000 });

		await page.waitForTimeout(3000);

		// --- Navigation: go to contacts, dismiss cookie/overlays, wait for ready ---
		// Navigating to /dashboard/contacts
		await page.goto("/dashboard/contacts");
		await NavigationHelper.dismissOverlays(page);
		// Dismissed overlays, page ready

		//
		//
		//
		// --- Page identity: URL contains /dashboard/contacts and "Contacts" heading is visible ---
		await expect(page).toHaveURL(/\/dashboard\/contacts/);
		await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
		// URL and Contacts heading verified

		//
		//
		//
		// --- Table load: contacts table is visible and has at least one row ---
		const table = page.locator("table").first();
		await expect(table).toBeVisible({ timeout: 20000 });
		// Contacts table is visible
		const firstRow = table.locator("tbody tr").first();
		await expect(firstRow).toBeVisible({ timeout: 25000 });
		// First table row visible
		const tableRows = table.locator("tbody tr");
		const initialRowCount = await tableRows.count();
		expect(initialRowCount).toBeGreaterThan(0);
		// Table loaded with N rows
		const firstCell = firstRow.locator("td").first();
		await expect(firstCell).toHaveText(/.+/, { timeout: 25000 });
		const page1FirstPersonName = (await firstCell.textContent())?.trim();
		expect(page1FirstPersonName).toBeTruthy();
		// Page 1 first person name captured

		//
		//
		//
		const pagination = page.locator('[data-slot="pagination-content"]');

		// --- Pagination: next works and page 2 has rows ---
		const nextLink = page
			.getByRole("link", { name: /go to next page|next/i })
			.first();
		await expect(nextLink).toBeVisible({ timeout: 5000 });
		// Clicking pagination next link
		await nextLink.click();
		await expect(
			pagination.getByRole("link", { name: "2" }).first(),
		).toHaveAttribute("data-active", "true", { timeout: 5000 });
		// Confirmed current page is 2
		const newTableRows = table.locator("tbody tr");
		const newRowCount = await newTableRows.count();
		expect(newRowCount).toBeGreaterThan(0);
		// Pagination next: N rows on page 2
		const currentFirstRow = table.locator("tbody tr").first();
		await expect(currentFirstRow).toBeVisible();
		const firstPersonName = (
			await currentFirstRow.locator("td").first().textContent()
		)?.trim();
		expect(firstPersonName).toBeTruthy();
		expect(firstPersonName).not.toEqual(page1FirstPersonName);
		// Page 2 first person different from page 1

		//
		//
		//
		// --- Person overlay: click first row opens side panel with that person's data ---
		// Clicking first row to open person overlay
		await currentFirstRow.click({ force: true });
		const personSheet = page
			.getByRole("dialog")
			.filter({ has: page.getByText("Contact Information") })
			.first();
		await expect(personSheet).toBeVisible({ timeout: 15000 });
		// Person overlay is visible
		await expect(
			personSheet.getByText(firstPersonName!, { exact: false }),
		).toBeVisible({ timeout: 5000 });
		// Side panel loaded with person data
		const closeButton = personSheet.getByRole("button", { name: /close/i });
		await closeButton.click();
		// Clicked Close button to close overlay
		await expect(personSheet).toBeHidden({ timeout: 10000 });
		// Person overlay closed, page ready

		//
		//
		//
		// --- Search: search by first name narrows results; clearing search restores table ---
		// Search section
		const searchInput = page.getByPlaceholder("Search contacts").first();
		await expect(searchInput).toBeVisible();
		// Search input visible
		const searchTerm = firstPersonName?.split(" ")[0] || "Test";
		// Searching for searchTerm
		await searchInput.fill(searchTerm);
		await searchInput.press("Enter");

		const searchResults = table.locator("tbody tr");
		await expect(searchResults).toHaveCount(1, { timeout: 20000 });
		// Search results: 1 row for searchTerm
		await expect(
			pagination.getByRole("link", { name: "1" }).first(),
		).toHaveAttribute("data-active", "true", { timeout: 5000 });
		// Confirmed page 1 after search
		const searchFirstRow = table.locator("tbody tr").first();
		await expect(searchFirstRow).toContainText(searchTerm, {
			ignoreCase: true,
		});
		// First row matches search term
		// Clearing search
		await searchInput.clear();
		await searchInput.press("Enter");
		await expect(
			pagination.getByRole("link", { name: "1" }).first(),
		).toHaveAttribute("data-active", "true", { timeout: 5000 });
		// Confirmed page 1 after clearing search

		const afterClearFirstRow = table.locator("tbody tr").first();
		await expect(
			afterClearFirstRow.locator("td").filter({ hasText: /.+/ }),
		).not.toHaveCount(0, { timeout: 20000 });
		// Table loaded after clearing search

		//
		//
		//
		// --- Create list: "Create list" opens Filters sheet ---
		// Create list / Filters sheet section
		const createListButton = page.getByRole("button", {
			name: /create list/i,
		});
		await createListButton.scrollIntoViewIfNeeded();
		await expect(createListButton).toBeVisible({ timeout: 10000 });
		// Clicking Create list button
		await createListButton.click({ force: true });
		// Waiting for filters sheet to open
		const sheet = page
			.getByRole("dialog")
			.filter({
				has: page.getByRole("button", { name: /create segment/i }),
			})
			.first();
		await expect(sheet).toBeVisible({ timeout: 10000 });
		// Filters sheet is visible
		const age18_25Label = sheet.getByText("18-25", { exact: true });
		const age18_25Checkbox = age18_25Label
			.locator("xpath=..")
			.getByRole("checkbox");
		await age18_25Checkbox.click({ timeout: 10000 });
		// Selected 18-25 age filter
		const createSegmentButton = sheet.getByRole("button", {
			name: /create segment/i,
		});
		await expect(createSegmentButton).toBeEnabled({ timeout: 5000 });
		await createSegmentButton.click({ force: true });
		// Clicked Create Segment
		await expect(sheet).toBeHidden({ timeout: 10000 });
		// Filters sheet closed, page ready
		const segmentFirstRow = table.locator("tbody tr").first();
		await expect(
			segmentFirstRow.locator("td").filter({ hasText: /.+/ }),
		).not.toHaveCount(0, { timeout: 35000 });
		// Table data loaded
		const segmentRows = await table.locator("tbody tr").all();
		const ageColumnIndex = 2;
		const age18to25Regex = /^\s*(18|19|20|21|22|23|24|25)\s*$/;
		for (const row of segmentRows) {
			await expect(row.locator("td").nth(ageColumnIndex)).toHaveText(
				age18to25Regex,
			);
		}
		// All rows have age in 18-25 range

		const segmentSelectTrigger = page.getByRole("combobox").first();
		await segmentSelectTrigger.click({ timeout: 5000 });
		await expect(page.getByText("Custom Segments")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText(/Custom Segment 1/i).first()).toBeVisible({
			timeout: 5000,
		});
		await page.keyboard.press("Escape");
		// Custom segment is in dropdown

		//
		//
		//
		// --- Edit segment: change age filter to 25-35, update, table reloads ---
		await page.getByTestId("edit-list-button").first().click({ timeout: 5000 });
		const editSheet = page
			.getByRole("dialog")
			.filter({
				has: page.getByRole("button", { name: /update segment/i }),
			})
			.first();
		await expect(editSheet).toBeVisible({ timeout: 10000 });
		// check 25-35
		const age25_35Label = editSheet.getByText("25-35", { exact: true });
		const age25_35Checkbox = age25_35Label
			.locator("xpath=..")
			.getByRole("checkbox");
		await age25_35Checkbox.click({ timeout: 10000 });
		// uncheck 18-25
		const age18_25LabelEdit = editSheet.getByText("18-25", { exact: true });
		const age18_25CheckboxEdit = age18_25LabelEdit
			.locator("xpath=..")
			.getByRole("checkbox");
		await age18_25CheckboxEdit.click({ timeout: 10000 });
		// update segment
		await editSheet
			.getByRole("button", { name: /update segment/i })
			.click({ force: true });
		await expect(editSheet).toBeHidden({ timeout: 10000 });
		// check table
		const afterEditFirstRow = table.locator("tbody tr").first();
		await expect(
			afterEditFirstRow.locator("td").filter({ hasText: /.+/ }),
		).not.toHaveCount(0, { timeout: 20000 });

		const afterEditSegmentRows = await table.locator("tbody tr").all();
		const age25to35Regex = /^\s*(25|26|27|28|29|30|31|32|33|34|35)\s*$/;
		for (const row of afterEditSegmentRows) {
			await expect(row.locator("td").nth(ageColumnIndex)).toHaveText(
				age25to35Regex,
			);
		}
		// Edited segment to 25-35 age range, table data loaded
	});
});
