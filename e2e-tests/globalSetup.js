import { createTestRun } from "./helpers/testrailHelper";
import { ensureSession, ensureAdminSession } from "./helpers/accountHelpers";
import { generateTimeStamp } from "./helpers/dataHelpers";
import * as fs from "fs";
import "dotenv/config";
import { TEST_IDS } from "./constants/testIds";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Localized Test Run (Debugging)";
  let testCaseIds = [
    // Core resource pages
    TEST_IDS.HOMEPAGE, TEST_IDS.FOOTER, TEST_IDS.FOR_CANDIDATES_CAMPAIGN_TOOLS, 
    TEST_IDS.FOR_CANDIDATES_GET_A_DEMO, TEST_IDS.FOR_CANDIDATES_EXPLORE_OFFICES, 
    TEST_IDS.FOR_VOTERS_VOLUNTEER, TEST_IDS.STATE_ELECTION_PAGE, TEST_IDS.COUNTY_ELECTION_PAGE, 
    TEST_IDS.MUNICIPAL_ELECTION_PAGE,
    // Blog pages
    TEST_IDS.RESOURCES_BLOG,
    TEST_IDS.BLOG_CATEGORIES_FILTERS, 
    TEST_IDS.BLOG_ARTICLE,
    // Core functionality
    TEST_IDS.DASHBOARD_PAGE, TEST_IDS.REGISTRATION_FLOW, TEST_IDS.LOGIN_FLOW, TEST_IDS.INVALID_LOGIN_ERROR_MESSAGE, 
    TEST_IDS.PERSONAL_INFORMATION, TEST_IDS.NOTIFICATION_SETTINGS, TEST_IDS.CHANGE_ACCOUNT_PASSWORD,
    // Admin pages
    TEST_IDS.ADMIN_DASHBOARD, TEST_IDS.CAMPAIGNS, TEST_IDS.USERS, TEST_IDS.TOP_ISSUES, 
    TEST_IDS.AI_CONTENT, TEST_IDS.P2V_STATS, TEST_IDS.PRO_USERS_WITHOUT_L2_DATA, 
    TEST_IDS.PUBLIC_CANDIDATES, TEST_IDS.INVITE_CANDIDATE_USER, TEST_IDS.INVITE_SALES_USER, 
    TEST_IDS.IMPERSONATE_USER, TEST_IDS.ADD_CAMPAIGN_AS_ADMIN,
    // App pages
    TEST_IDS.CREATE_CONVERSATION, TEST_IDS.GENERATE_CAMPAIGN_ASSETS, TEST_IDS.CUSTOM_VOTER_FILES, 
    TEST_IDS.UPDATE_CAMPAIGN_DETAILS, TEST_IDS.UPDATE_OFFICE_DETAILS, TEST_IDS.UPDATE_WHY_STATEMENT, 
    TEST_IDS.UPDATE_FUN_FACTS, TEST_IDS.UPDATE_OPPONENT_INFO, TEST_IDS.DEFAULT_VOTER_FILES,
    TEST_IDS.UPGRADE_TO_PRO_PROMPT, TEST_IDS.UPGRADE_TO_PRO_FLOW, 
    TEST_IDS.GENERATE_NEW_WEBSITE, TEST_IDS.WEBSITE_DASHBOARD_PAGE, TEST_IDS.DOMAIN_PURCHASE_FLOW,  
    TEST_IDS.VOTER_OUTREACH, TEST_IDS.SCHEDULE_CAMPAIGN, TEST_IDS.GENERATE_SEGMENT,
    TEST_IDS.CONTACTS_PAGE_STATISTICS,
    // Sitemaps
    TEST_IDS.SITEMAP_ACCESSIBILITY, TEST_IDS.STATE_SITEMAP_URLS, TEST_IDS.URL_LASTMODE_DATES
  ];
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const testRunId = await createTestRun(testRunName, testCaseIds, baseUrl);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);

  const testAccountFirstName = generateTimeStamp();
  const testAccountLastName = 'test';

  try {
    console.log('Creating test user session...');
    await ensureSession(testAccountFirstName, testAccountLastName);
    console.log('Test user session created successfully');
    console.log('Creating admin session...');
    await ensureAdminSession(testAccountFirstName, testAccountLastName);
    console.log('Admin session created successfully');
  } catch (error) {
    console.error('Error during session setup:', error);
    throw error;
  }
};
