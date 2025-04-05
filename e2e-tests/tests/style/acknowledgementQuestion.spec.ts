import "dotenv/config";
import { test } from "@playwright/test";
import { addTestResult } from "helpers/testrailHelper";
import { getStorybookFrame, styleGuideURL, validateElements } from "helpers/styleHelpers";
import * as fs from "fs";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

test("Style Guide - Acknowledgement Question", async ({ page }) => {
    const caseId = 76;
  
    try {
      await page.goto(styleGuideURL + '?path=/story/acknowledgements-acknowledgementquestion--default', {waitUntil: "commit"});
  
      await page.waitForLoadState("networkidle");
  
      const frame = await getStorybookFrame(page);
      const acknowledgementQuestionElements = [
        {
            locator: frame.locator('div').filter({ hasText: 'Independent' }).nth(1),
            text: 'Independent',
            cssProperties: [
                { property: 'color', value: 'rgb(0, 0, 0)' },
                { property: 'background-color', value: 'rgb(232, 232, 232)' },
                { property: 'font-weight', value: '700' }
            ]
        },
        {
            locator: frame.getByTestId('CMS-contentWrapper'),
            text: 'I am an independent, non-partisan, or third-party candidate. ' +
            'I am committed to the interests of the people above myself and partisan politics. ' +
            'I am NOT running as a Republican or Democrat in a partisan election. ' +
            'I am committed to running and serving independent of the two-major parties. ' +
            'I will represent people from across the political spectrum and be dedicated to advancing the priorities of my constituents. ' +
            'I pledge I will NOT pay membership dues to or otherwise engage in fundraising for either of the two major political party committees while in office,' +
            ' and will remain open to working with all sides to the benefit of my constituents.',
            cssProperties: [
                { property: 'color', value: 'rgb(0, 0, 0)' },
                { property: 'font-size', value: '16px' },
                { property: 'line-height', value: '24px' }
            ]
        },
        {
            locator: frame.getByRole('button', { name: 'I Agree' }),
            text: 'I Agree',
            cssProperties: [
                { property: 'color', value: 'rgb(255, 255, 255)' },
            ]
        },
      ];
      await validateElements(acknowledgementQuestionElements);
  
      await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
      await addTestResult(
        runId,
        caseId,
        5,
        `Test failed: ${error.stack}`
      );
    }
  });