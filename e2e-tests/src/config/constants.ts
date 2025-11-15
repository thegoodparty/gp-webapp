export const TIMEOUTS = {
  DEFAULT: 30000,
  EXPECT: 10000,
  ACTION: 10000,
  NAVIGATION: 30000,
} as const;

export const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-dev-shm-usage", 
  "--disable-web-security"
] as const;

export const TEST_DATA = {
  DEFAULT_PASSWORD: "TestPassword123!",
  TEST_ZIP_CODE: "82901",
  DEFAULT_ROLE: "Green River City Council - Ward 1",
} as const;
