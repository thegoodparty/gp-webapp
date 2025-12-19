import { expect, test } from "@playwright/test";
import { parse as parseCSV } from "csv-parse/sync";
import { addBusinessDays, format, subDays } from "date-fns";
import { authenticateTestUser } from "tests/utils/api-registration";
import { downloadSlackFile, waitForSlackMessage } from "tests/utils/slack";

const district = {
	zip: "82001",
	office: "Cheyenne City Council - Ward 2",
	constituents: 13500,
};

export const expectToBeWithin = (
	value: number,
	expected: number,
	plusOrMinus: number,
) => {
	expect(value).toBeGreaterThanOrEqual(expected - plusOrMinus);
	expect(value).toBeLessThanOrEqual(expected + plusOrMinus);
};

test("poll onboarding and expansion", async ({ page }) => {
	const { user } = await authenticateTestUser(page, {
		isolated: true,
		race: { zip: district.zip, office: district.office },
	});
	await page.goto("/polls/welcome");

	await page.getByRole("button", { name: "Let's get started" }).click();

	// Confirm constituent count.
	const constituentCount = await page
		.getByTestId("total-constituents")
		.textContent();

	expect(constituentCount).toBeTruthy();

	expectToBeWithin(
		parseInt(constituentCount!.replace(/,/g, ""), 10),
		district.constituents,
		500,
	);

	// Move through onboarding flow.
	await page.getByRole("button", { name: "Next", exact: true }).click();

	// Set sworn in date to yesterday
	// TODO: test sworn-in date in the future
	const yesterday = subDays(new Date(), 1);
	await page.locator(`[data-day="${format(yesterday, "yyyy-MM-dd")}"]`).click();
	await page.getByRole("button", { name: "Next", exact: true }).click();
	await page.getByRole("button", { name: "Create poll" }).click();
	await page.getByRole("button", { name: "Pick Send Date" }).click();

	// Find next available send date
	const sendDate = addBusinessDays(new Date(), 6);
	await page.locator(`[data-day="${format(sendDate, "yyyy-MM-dd")}"]`).click();

	await page.getByRole("button", { name: "Add Image" }).click();

	// TODO: actually add an image
	await page.getByRole("button", { name: "See Preview" }).click();

	// Create poll.
	await page.getByRole("button", { name: "Send SMS poll" }).click();

	// Confirm the correct data shows up in the UI
	await expect(page.getByText("Top Community Issues")).toBeVisible();

	const scheduledDate = `${format(sendDate, "MMM d, yyyy")} at 11:00 AM`;
	await expect(
		page.getByText(`Scheduled Date: ${scheduledDate}`),
	).toBeVisible();
	await expect(
		page.getByText(
			`Estimated Completion Date: ${format(
				addBusinessDays(sendDate, 3),
				"MMM d, yyyy",
			)} at 11:00 AM`,
		),
	).toBeVisible();

	await expect(
		page.getByText(`This poll is scheduled to send on ${scheduledDate}.`),
	).toBeVisible();

	const slackMessage = await waitForSlackMessage({
		// #tevyn-api-test
		channel: "C09KUHEUY95",
		matching: (message) => !!message.text?.includes(user.email),
	});

	const pollId = slackMessage.text?.match(/\*Poll ID:\* `([a-z0-9-]+)`/)?.[1];
	if (!pollId) {
		throw new Error("No poll ID found in slack message");
	}

	const fileId = slackMessage.files?.at(0)?.id;
	if (!fileId) {
		throw new Error("No file id found in slack message");
	}

	const csv = await downloadSlackFile(fileId);

	const rows = parseCSV(csv.toString("utf8"), { columns: true });

	expect(rows).toHaveLength(500);

	// Upload sample results to S3.

	// Wait for results to come in.

	// Confirm the UI is updated according to results.

	// Expand the poll.

	// Confirm recommendation.

	// Simulate high-confidence results.

	// Confirm the UI is updated according to the results.
});
