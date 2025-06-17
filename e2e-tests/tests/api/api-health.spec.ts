import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';

const apiURL = 'https://gp-api.goodparty.org/v1/health';
const apiDevURL = 'https://gp-api-dev.goodparty.org/v1/health';
const apiQaURL = 'https://gp-api-qa.goodparty.org/v1/health';
test.describe('API Health Checks', () => {
  const apiEndpoints = [
    { name: 'main', url: apiURL },
    { name: 'dev', url: apiDevURL },
    { name: 'qa', url: apiQaURL },
  ];
  const caseId = 71;
  setupTestReporting(test, caseId);

  test('should verify main API is running', async ({ request }) => {
    for (const endpoint of apiEndpoints) {
      const response = await request.get(endpoint.url);
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
});