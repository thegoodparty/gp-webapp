import "dotenv/config";
import { test } from "@playwright/test";
import { appNav } from "helpers/navHelpers";
import { addTestResult, skipNonQA } from "helpers/testrailHelper";
import * as fs from "fs";
import {
  createAccount,
  deleteAccount,
  loginAccount,
} from "helpers/accountHelpers";
import { userData } from "helpers/dataHelpers";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

  const testAdmin = process.env.TEST_USER_ADMIN;
  const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

test("Add Campaign Manager", async ({ browser }) => {
  const caseId1 = 51;
  const caseId2 = 44;
  await skipNonQA(test);

  try {
    // Create a new browser context for the campaign manager
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();

    // Create a new browser context for the admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    // Sign up as campaign manager to existing campaign
    const managerPassword = userData.password + "1";
    const managerEmail = await createAccount(
      managerPage,
      "manager",
      undefined,
      undefined,
      undefined,
      undefined,
      testAdmin
    );

    // Admin: Log in to approve campaign manager
    await loginAccount(
      adminPage,
      true,
      testAdmin,
      testAdminPassword
    );
    await appNav(adminPage, "Campaign Team");
    await adminPage.waitForFunction(
      () => {
        return Array.from(document.querySelectorAll("button")).some((button) =>
          button.textContent.includes("Accept")
        );
      },
      { timeout: 10000 }
    );

    let acceptButtons = adminPage.locator("button", { hasText: "Accept" });
    let buttonCount = await acceptButtons.count();

    while (buttonCount > 0) {
      await acceptButtons.first().click();
      await adminPage
        .getByRole("heading", { name: "Accept Request" })
        .isVisible();
      await adminPage.getByRole("button", { name: "Accept" }).click();
      await adminPage.waitForTimeout(500);

      acceptButtons = adminPage.locator("button", { hasText: "Accept" });
      buttonCount = await acceptButtons.count();
    }

    // Manager: Confirm campaign manager's access
    await managerPage.goto("/dashboard/campaign-details");
    await managerPage
      .getByRole("heading", { name: "Campaign Details" })
      .isVisible();

    // Manager: Delete campaign manager's account
    await deleteAccount(managerPage);

    // Close contexts
    await managerContext.close();
    await adminContext.close();

    // Report test results
    await addTestResult(runId, caseId1, 1, "Test passed");
    await addTestResult(runId, caseId2, 1, "Test passed");
  } catch (error) {
    // Report test results
    await addTestResult(runId, caseId1, 5);
    await addTestResult(runId, caseId2, 5);
  }
});
