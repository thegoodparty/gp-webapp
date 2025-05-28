import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';

const runId = fs.readFileSync('testRunId.txt', 'utf-8');
const apiURL = 'https://gp-api.goodparty.org/v1/health';
const apiDevURL = 'https://gp-api-dev.goodparty.org/v1/health';
const apiQaURL = 'https://gp-api-qa.goodparty.org/v1/health';
test.describe('API Health Checks', () => {
  const apiEndpoints = [
    { name: 'main', url: apiURL },
    { name: 'dev', url: apiDevURL },
    { name: 'qa', url: apiQaURL },
  ];

  test('should verify main API is running', async ({ request }) => {
    const caseId = 71;
    try {
      for (const endpoint of apiEndpoints) {
        const response = await request.get(endpoint.url);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
      }
      await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
      await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
  });
});