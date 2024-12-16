import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { acceptCookieTerms, getNavatticPlayerFrame } from 'helpers/domHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Product Tour flow', async ({ page }) => {
    await skipNonQA(test);

    const caseId = 23;

    const pageTitle = "AI Campaign Manager Product Tour | GoodParty.org";
    const alertHeader = "Talk to a Political Expert!";
    const alertButtonText = "Schedule Call Today";
    const campaignTrackerSection1 = "Path to Victory";
    const campaignTrackerSection2 = "Voter Contact Methods";
    const campaignTrackerSection3 = "Campaign Action History";
    const onboardingSurveySection = "What are the top 3 issues you care about?";
    const templateTitle = "Select a Template";
    const templateSection1 = "Social Media Content";
    const templateSection2 = "Outreach & Community Engagement";
    const templateSection3 = "Media & PR";
    const templateSection4 = "Campaign Milestones";
    const templateSection5 = "Endorsements & Partnerships";
    const templateSection6 = "Speeches & Scripts";
    const templateSection7 = "Email Blasts";
    const pressReleaseSection = "FOR IMMEDIATE RELEASE";
    const campaignTrackerSection4 = "Campaign Tracker";
    const campaignTrackerSection5 = "Campaign Progress";
    const campaignTrackerSection6 = "Update history";
    const voterRecordsSection = "Select Your Filters";
    const voterFileSection = "Voter File";
    const yardSignsSection = "EXPAND YOUR REACH FOR FREE";
    const proDemoSection = "Learn more about GoodParty.org Pro";
    const loginPageTitle = "Login to GoodParty.org";

    const tourButton = /Next/;
    const tourButtonStart = /Get Started/;
    const tourButtonDemo = /Get a Demo/;
    const tourStep1 = /Welcome to GoodParty.org! /;
    const tourStep2 = /GoodParty.org has access to hundreds of millions of voting history records and contact information for voters nationwide. /;
    const tourStep3 = /When you start with GoodParty.org, we'll ask you a few questions about your policy priorities, background, and opponent./;
    const tourStep4 = /Click "Press Release" to see this in action./;
    const tourStep5 = /Within 10 seconds, you will receive a formatted first draft of your content./;
    const tourStep6 = /Next up, GoodParty.org Pro./;
    const tourStep7 = /First, voter records. GoodParty.org's voter data covers the entire United States. /;
    const tourStep8 = /Text messages are provided at cost, and your first 5,000 messages are free./;
    const tourStep9 = /Yard signs are a fantastic way to build momentum for your campaign and energize your supporters./;
    const tourStep10 = /Political Associates provide campaign advice, strategic support, and help you maximize your usage of GoodParty.org Pro./;
    const tourStep11 = /Now, let's get started!/;

    const navatticFrame = await getNavatticPlayerFrame(page);
    const navatticFramePopUp = await getNavatticPlayerFrame(page, true);

    const testZip = '94066';
    const role = 'California Attorney General';
    try {
        // Create account
        await createAccount(page, 'live', true, testZip, role);

        // Confirm live account dashboard
        await page.getByText('Learn how to use your personalized campaign plan').isVisible();
        
        await page.goto('/');
        await coreNav(page, 'nav-tour');

        // Waits for page to load completely
        await page.waitForLoadState('networkidle');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

        // Campaign Tracker page contents (pt.1)

        // Alert notice
        await navatticFrame.locator(`role=heading[name="${alertHeader}"]`).waitFor();
        await navatticFrame.locator(`role=button[name="${alertButtonText}"]`).click();

        // Page Modules
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection1}"]`).waitFor();
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection2}"]`).waitFor();
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection3}"]`).waitFor();

        // Accept cookie terms (if visible)
        await acceptCookieTerms(page);

        // Navattic dialog pop-up (Steps 1 & 2)
        await navatticFramePopUp.getByText(tourStep1);
        await navatticFramePopUp.getByLabel(tourButton).click();
        await navatticFramePopUp.getByText(tourStep2);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Onboard Survey page contents
        await navatticFrame.locator(`role=heading[name="${onboardingSurveySection}"]`).waitFor();
        
        // Navattic dialog pop-up (Step 3)
        await navatticFramePopUp.locator(`text=${tourStep3}`).waitFor();
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Template page contents
        await navatticFrame.locator(`role=heading[name="${templateTitle}"`);
        await navatticFrame.locator(`role=heading[name="${templateSection1}`);
        await navatticFrame.locator(`role=heading[name="${templateSection2}`);
        await navatticFrame.locator(`role=heading[name="${templateSection3}`);
        await navatticFrame.locator(`role=heading[name="${templateSection4}`);
        await navatticFrame.locator(`role=heading[name="${templateSection5}`);
        await navatticFrame.locator(`role=heading[name="${templateSection6}`);
        await navatticFrame.locator(`role=heading[name="${templateSection7}`);

        // Navattic dialog pop-up (Step 4)
        await navatticFramePopUp.getByText(tourStep4);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Press Release page contents
        await navatticFrame.locator(`role=heading[name="${pressReleaseSection}`);

        // Navattic dialog pop-up (Step 5)
        await navatticFramePopUp.getByText(tourStep5);
        await navatticFramePopUp.getByLabel(tourButton).click();

        // Campaign Tracker page contents (pt.2)
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection4}"]`).waitFor();
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection5}"]`).waitFor();
        await navatticFrame.locator(`role=heading[name="${campaignTrackerSection6}"]`).waitFor();

        // Navattic dialog pop-up (Step 6)
        await navatticFramePopUp.getByText(tourStep6);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Voter Records page contents
        await navatticFrame.locator(`role=heading[name="${voterRecordsSection}"]`).waitFor();

        // Navattic dialog pop-up (Step 7)
        await navatticFramePopUp.getByText(tourStep7);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Voter File page contents
        await navatticFrame.locator(`role=heading[name="${voterFileSection}"]`).waitFor();

        // Navattic dialog pop-up (Step 8)
        await navatticFramePopUp.getByText(tourStep8);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Yard Signs page contents
        await navatticFrame.locator(`role=heading[name="${yardSignsSection}"]`).waitFor();

        // Navattic dialog pop-up (Step 9)
        await navatticFramePopUp.getByText(tourStep9);
        await navatticFramePopUp.getByLabel(tourButton, { exact: true }).first().click();

        // Pro demo page contents
        await navatticFrame.locator(`role=heading[name="${proDemoSection}"]`).waitFor();

        // Navattic dialog pop-up (Step 10)
        await navatticFramePopUp.getByText(tourStep10);
        await navatticFramePopUp.getByLabel(tourButton).click();

        // Navattic dialog pop-up (Step 11)
        await navatticFramePopUp.getByText(tourStep11);
        await navatticFramePopUp.getByLabel(tourButtonDemo).waitFor();
        await navatticFramePopUp.getByLabel(tourButtonStart).click();

        // Login page contents
        await navatticFramePopUp.getByText(loginPageTitle).waitFor();

        // Delete account after test
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-product-tour-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});