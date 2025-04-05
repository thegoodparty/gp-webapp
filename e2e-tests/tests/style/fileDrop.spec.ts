import "dotenv/config";
import { expect, test } from "@playwright/test";
import { addTestResult } from "helpers/testrailHelper";
import { getStorybookFrame, styleGuideURL, validateElements } from "helpers/styleHelpers";
import * as fs from "fs";
import { readFileSync } from "fs";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

test("Style Guide - File Drop Styling Test", async ({ page }) => {
    const caseId = 80;
  
    try {
      await page.goto(styleGuideURL + '/?path=/story/inputs-filedropzone--default', {waitUntil: "commit"});
  
      await page.waitForLoadState("networkidle");
  
      const frame = await getStorybookFrame(page);
      const fileDropZoneElements = [
        {
          locator: frame.getByText('Add a Photo'),
          text: 'Add a Photo',
          cssProperty: 'color',
          cssValue: 'rgb(0, 0, 0)',
        }
      ];
      await validateElements(fileDropZoneElements);
  
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

test("Style Guide - File Drop File Test", async ({ page }) => {
    const caseId = 81;
  
    try {
      await page.goto(styleGuideURL + '/?path=/story/inputs-filedropzone--default', {waitUntil: "commit"});
      await page.waitForLoadState("networkidle");
  
      const frame = await getStorybookFrame(page);
      
      // Get the file input element
      const fileDropZone = frame.getByRole('button', { name: 'Add a Photo' });
      const dropZoneHandle = await fileDropZone.elementHandle();
      
      // Setup the file to upload
      const filePath = 'tests/fixtures/gp-logo.png';
      const fileBuffer = readFileSync(filePath);

      // Perform the drag and drop operation
      await page.evaluate(async ([element, fileBuffer]) => {
        const dt = new DataTransfer();
        const file = new File([fileBuffer], 'gp-logo.png', { type: 'image/png' });
        dt.items.add(file);

        const dragenterEvent = new DragEvent('dragenter', { bubbles: true, dataTransfer: dt });
        const dragoverEvent = new DragEvent('dragover', { bubbles: true, dataTransfer: dt });
        const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer: dt });

        element.dispatchEvent(dragenterEvent);
        element.dispatchEvent(dragoverEvent);
        element.dispatchEvent(dropEvent);
      }, [dropZoneHandle, fileBuffer]);

      // Confirm image is displayed
      await expect(frame.getByRole('img', { name: 'img' })).toBeVisible();
  
      await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
      await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});