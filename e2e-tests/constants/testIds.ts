export const TEST_IDS = {
    // Core tests
    NAVIGATION_BAR: 1,
    FOOTER: 2,
    EXTERNAL_LINKS: 3,
    
    // Profile Settings Tests
    PERSONAL_INFORMATION: 33,
    NOTIFICATION_SETTINGS: 34,
    CHANGE_ACCOUNT_PASSWORD: 35,

    // Resource Pages Tests
    HOMEPAGE: 1,
    FOR_CANDIDATES_CAMPAIGN_TOOLS: 4,
    FOR_CANDIDATES_GET_A_DEMO: 5,
    FOR_VOTERS_VOLUNTEER: 8,
    FOR_VOTERS_CANDIDATES: 9,
    FOR_VOTERS_INFO_SESSION: 10,
    FOR_VOTERS_GET_STICKERS: 11,
    RESOURCES_GLOSSARY: 13,
    ABOUT_PAGE: 14,

    // Elections Page Tests
    FOR_CANDIDATES_EXPLORE_OFFICES: 7,
    STATE_ELECTION_PAGE: 92,
    COUNTY_ELECTION_PAGE: 93,
    MUNICIPAL_ELECTION_PAGE: 94,

    // Blog Page Tests
    RESOURCES_BLOG: 12,
    BLOG_CATEGORIES_FILTERS: 16,
    BLOG_ARTICLE: 17,

    // Sitemap Tests
    SITEMAP_ACCESSIBILITY: 86,
    STATE_SITEMAP_URLS: 87,
    URL_LASTMODE_DATES: 89,

    // Login / Registration Tests
    LOGIN_FLOW: 19,
    INVALID_LOGIN_ERROR_MESSAGE: 22,
    REGISTRATION_FLOW: 18,

    // App Tests
    MOBILE_VIEW: 75,

    // Dashboard Tests
    DASHBOARD_PAGE: 90,
    LOG_VOTER_CONTACT_DATA: 91,

    // Campaign Assistant Tests
    CREATE_CONVERSATION: 36,

    // Campaign Details Tests
    UPDATE_CAMPAIGN_DETAILS: 46,
    UPDATE_OFFICE_DETAILS: 47,
    UPDATE_WHY_STATEMENT: 48,
    UPDATE_FUN_FACTS: 49,
    UPDATE_OPPONENT_INFO: 50,

    // Content Builder Tests
    GENERATE_CAMPAIGN_ASSETS: 40,

    // Contacts Tests
    GENERATE_SEGMENT: 103,
    CONTACTS_PAGE_STATISTICS: 104,

    // Voter Data Tests
    UPGRADE_TO_PRO_PROMPT: 41,
    UPGRADE_TO_PRO_FLOW: 42,
    CUSTOM_VOTER_FILES: 43,
    DEFAULT_VOTER_FILES: 95,

    // Feedback Button Tests
    FEEDBACK_BUTTON: 52,

    // Voter Outreach tests
    VOTER_OUTREACH: 96,
    SCHEDULE_CAMPAIGN: 97,

    // Website Builder tests
    GENERATE_NEW_WEBSITE: 98,
    WEBSITE_DASHBOARD_PAGE: 99,
    DOMAIN_PURCHASE_FLOW: 101,

    // Admin Tests
    ADMIN_DASHBOARD: 24,
    TOP_ISSUES: 27,
    BUST_CACHE: 28,
    AI_CONTENT: 29,
    P2V_STATS: 30,
    PRO_USERS_WITHOUT_L2_DATA: 31,
    PUBLIC_CANDIDATES: 32,

    // Admin - Users Tests
    USERS: 26,
    IMPERSONATE_USER: 73,
    INVITE_CANDIDATE_USER: 53,
    INVITE_SALES_USER: 54,

    // Admin - Campaigns Tests
    CAMPAIGNS: 25,
    ADD_CAMPAIGN_AS_ADMIN: 74,
    DELETE_CAMPAIGN: 82,
    VERIFY_NEW_CANDIDATE_HUBSPOT_FIELDS_ADMIN: 83,

    // Admin - Sales Tests
    ADD_CAMPAIGN_AS_SALES_USER: 84,
    VERIFY_NEW_CANDIDATE_HUBSPOT_FIELDS_SALES: 85,

    // API Tests
    MAIN_API_HEALTH_CHECK: 71,
    BALLOT_DATA_RACES_API_HEALTH_CHECK: 72,
    
} as const;

// Helper function to create test mapping object
export const createTestMapping = (mapping: Record<string, number>) => mapping; 