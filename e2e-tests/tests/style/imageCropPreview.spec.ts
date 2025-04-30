import "dotenv/config";
import { expect, test } from "@playwright/test";
import { addTestResult, handleTestFailure } from "helpers/testrailHelper";
import { getStorybookFrame, styleGuideURL, validateElements } from "helpers/styleHelpers";
import * as fs from "fs";
import { documentReady } from "helpers/domHelpers";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

test.skip("Style Guide - ImageCropPreview Styling", async ({ page }) => {
  const caseId = 77;

  try {
    await page.goto(styleGuideURL + '/?path=/story/inputs-imagecroppreview--default', {waitUntil: "commit"});

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const imageCropElements = [
      {
        locator: frame.getByText('Select image to crop'),
        text: 'Select image to crop',
        cssProperty: 'color',
        cssValue: 'rgb(0, 0, 0)',
      },
      {
        locator: frame.getByRole('textbox'),
        cssProperty: 'color',
        cssValue: 'rgb(0, 0, 0)',
      },
    ];
    await validateElements(imageCropElements);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test.skip("Style Guide - ImageCropPreview Valid File Test", async ({ page }) => {
    const caseId = 78;
  
    try {
      await page.goto(styleGuideURL + '/?path=/story/inputs-imagecroppreview--default', {waitUntil: "commit"});
  
      await documentReady(page);
  
      const frame = await getStorybookFrame(page);
      
      // Upload valid image file
      const fileInput = frame.getByRole('textbox');
      await fileInput.setInputFiles('tests/fixtures/gp-logo.png');

      // Confirm image is displayed
      await expect(frame.getByAltText('Image Preview')).toBeVisible();
  
      await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
      await handleTestFailure(page, runId, caseId, error);    
    }
  });

  test.skip("Style Guide - ImageCropPreview Invalid File Test", async ({ page }) => {
    const caseId = 79;
  
    try {
        await page.goto(styleGuideURL + '/?path=/story/inputs-imagecroppreview--default', {waitUntil: "commit"});
    
        await documentReady(page);
    
        const frame = await getStorybookFrame(page);

        // Upload invalid image file
        const fileInput = frame.getByRole('textbox');
        await fileInput.setInputFiles('tests/fixtures/gp-text.txt');

        // Confirm no image is displayed
        const img = frame.getByAltText('Image Preview');
        await expect(img).toHaveJSProperty('naturalWidth', 0);
    
        await addTestResult(runId, caseId, 1, "Test passed");
    } catch (error) {
      await handleTestFailure(page, runId, caseId, error);    
    }
  });