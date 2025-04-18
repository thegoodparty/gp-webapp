import "dotenv/config";
import { test } from "@playwright/test";
import { addTestResult, handleTestFailure } from "helpers/testrailHelper";
import { getStorybookFrame, styleGuideURL, validateElements } from "helpers/styleHelpers";
import * as fs from "fs";
import { documentReady } from "helpers/domHelpers";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

test("Style Guide - Black Button", async ({ page }) => {
  const caseId = 55;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-blackbutton--default', {waitUntil: "commit"});

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const blackButtons = [
      {
        locator: frame.getByRole('button', { name: 'Black Button', exact: true }),
        text: 'Black Button',
        cssProperty: 'color',
        cssValue: 'rgb(255, 255, 255)',
      },
      {
        locator: frame.getByRole('button', { name: 'Black Button Client' }),
        text: 'Black Button Client',
        cssProperty: 'color',
        cssValue: 'rgb(255, 255, 255)',
      },
    ];
    await validateElements(blackButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Black Outlined Button", async ({ page }) => {
  const caseId = 56;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-blackoutlinedbutton--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const blackOutlineButtons = [
      {
        locator: frame.getByRole('button', { name: 'Black Button', exact: true }),
        text: 'Black Button',
        cssProperty: 'color',
        cssValue: 'rgb(0, 0, 0)',
      },
      {
        locator: frame.getByRole('button', { name: 'Black Button Client' }),
        text: 'Black Button Client',
        cssProperty: 'color',
        cssValue: 'rgb(0, 0, 0)',
      },
    ];

    await validateElements(blackOutlineButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Button", async ({ page }) => {
  const caseId = 57;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-button--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);

    const categories = [
      { id: "primary", classPrefix: ["primary"] },
      { id: "secondary", classPrefix: ["secondary", "lime"] },
      { id: "tertiary", classPrefix: ["tertiary"] },
      { id: "error", classPrefix: ["error"] },
      { id: "warning", classPrefix: ["warning", "orange"] },
      { id: "info", classPrefix: ["info"] },
      { id: "success", classPrefix: ["success"] },
      { id: "neutral", classPrefix: ["neutral"] },
      {
        id: "white",
        classPrefix: ["white"],
        additionalClasses: ["bg-white", "text-black", "text-primary-dark"],
      },
    ];

    const buttonTypes = [
      { role: "button", name: "Contained", classSuffix: ["main"] },
      { role: "button", name: "Outlined", classSuffix: ["dark", "700", "900"] },
      { role: "button", name: "Text", classSuffix: ["dark", "700", "900"] },
      { role: "link", name: "Contained Link", classSuffix: ["main"] },
      { role: "link", name: "Outlined Link", classSuffix: ["dark", "700", "900"] },
      { role: "link", name: "Text Link", classSuffix: ["dark", "700", "900"] },
    ];

    const buttonsToValidate = [];

    for (const category of categories) {
      for (const button of buttonTypes) {
        const locator = frame
          .locator(`#story--buttons-button--${category.id}-inner`)
          .getByRole(button.role, { name: button.name });

        const classRegexParts = [];

        if (category.additionalClasses) {
          classRegexParts.push(...category.additionalClasses);
        } else {
          for (const classPrefix of category.classPrefix) {
            for (const classSuffix of button.classSuffix) {
              const classPattern =
                classSuffix === "main"
                  ? `bg-${classPrefix}-${classSuffix}`
                  : `text-${classPrefix}-${classSuffix}`;
              classRegexParts.push(classPattern);
            }
          }
        }

        const combinedClassRegex = new RegExp(classRegexParts.join("|"));

        buttonsToValidate.push({
          locator,
          text: button.name,
          classRegex: combinedClassRegex,
        });
      }
    }

    await validateElements(buttonsToValidate);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);
  }
});

test("Style Guide - Error Button", async ({ page }) => {
  const caseId = 58;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-errorbutton--docs');

    await documentReady(page);
    const frame = await getStorybookFrame(page);

        const errorButtons = [
      {
        locator: frame.locator('#story--buttons-errorbutton--primary-inner').getByRole('button', { name: 'Button text' }),
        text: 'Button text',
        classRegex: /bg-red-500/,
      },
      {
        locator: frame.locator('#story--buttons-errorbutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        text: 'Button text',
        classRegex: /hover:bg-red-500/,
      },
      {
        locator: frame.locator('#story--buttons-errorbutton--text-inner').getByRole('button', { name: 'Button text' }),
        text: 'Button text',
        classRegex: /active:bg-red-50/,
      },
    ];

    await validateElements(errorButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Icon Button", async ({ page }) => {
  const caseId = 59;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-iconbutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const iconButtons = [
      {
        locator: frame.locator('#story--buttons-iconbutton--primary-inner').getByRole('button'),
        classRegex: /active:bg-indigo-700/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--secondary-inner').getByRole('button'),
        classRegex: /active:bg-lime-700/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--tertiary-inner').getByRole('button'),
        classRegex: /active:bg-purple-500/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--error-inner').getByRole('button'),
        classRegex: /active:bg-red-500/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--warning-inner').getByRole('button'),
        classRegex: /active:bg-orange-500/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--info-inner').getByRole('button'),
        classRegex: /active:bg-blue-500/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--success-inner').getByRole('button'),
        classRegex: /active:bg-green-500/,
      },
      {
        locator: frame.locator('#story--buttons-iconbutton--neutral-inner').getByRole('button'),
        classRegex: /active:bg-indigo-300/,
      },
    ];

    await validateElements(iconButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});


test("Style Guide - Info Button", async ({ page }) => {
  const caseId = 60;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-infobutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const infoButtons = [
      {
        locator: frame.locator('#story--buttons-infobutton--primary-inner').getByRole('button', { name: 'Button text' }),
        classRegex: /bg-indigo-50/,
        expectedText: 'Button text',
      },
      {
        locator: frame.locator('#story--buttons-infobutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        classRegex: /hover:bg-primary-dark/,
        expectedText: 'Button text',
      },
      {
        locator: frame.locator('#story--buttons-infobutton--text-inner').getByRole('button', { name: 'Button text' }),
        classRegex: /active:bg-indigo-50/,
        expectedText: 'Button text',
      },
    ];

    await validateElements(infoButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Pill Button", async ({ page }) => {
  const caseId = 61;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-pill--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const pillButtons = [
      {
        locator: frame.getByRole('button', { name: 'Pill', exact: true }),
        classRegex: /bg-black/,
        expectedText: 'Pill',
      },
      {
        locator: frame.getByRole('button', { name: 'Outlined Pill' }),
        classRegex: /bg-white/,
        expectedText: 'Outlined Pill',
      },
    ];

    await validateElements(pillButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Pink Button Client", async ({ page }) => {
  const caseId = 62;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-pinkbuttonclient--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const pinkButtonClient = [
      {
        locator: frame.getByRole('button', { name: 'Pink Button Client' }),
        css: { "background-color": "rgb(202, 44, 205)" },
        expectedText: "Pink Button Client",
      },
    ];

    await validateElements(pinkButtonClient);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});


test("Style Guide - Primary Button", async ({ page }) => {
  const caseId = 63;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-primarybutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const primaryButtons = [
      {
        locator: frame.locator('#story--buttons-primarybutton--primary-inner').getByRole('button', { name: 'Button text' }),
        expectedText: "Button text",
        css: { "class": /bg-primary-dark/ },
      },
      {
        locator: frame.locator('#story--buttons-primarybutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        expectedText: "Button text",
        css: { "class": /hover:bg-primary-dark/ },
      },
      {
        locator: frame.locator('#story--buttons-primarybutton--text-inner').getByRole('button', { name: 'Button text' }),
        expectedText: "Button text",
        css: { "class": /active:bg-primary-dark/ },
      },
    ];

    await validateElements(primaryButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Purple Button", async ({ page }) => {
  const caseId = 64;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-purplebutton--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const purpleButton = [
      {
        locator: frame.getByRole('button', { name: 'Purple Button' }),
        expectedText: "Purple Button",
        css: { "background-color": "rgb(70, 0, 46)" },
      },
    ];

    await validateElements(purpleButton);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Question Button", async ({ page }) => {
  const caseId = 65;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-questionbutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const questionButton = [
      {
        locator: frame.locator('#story--buttons-questionbutton--default--primary-inner').getByRole('img'),
        visibility: true,
      },
    ];

    await validateElements(questionButton);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Secondary Button", async ({ page }) => {
  const caseId = 66;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-secondarybutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const secondaryButtons = [
      {
        locator: frame.locator('#story--buttons-secondarybutton--primary-inner').getByRole('button', { name: 'Button text' }),
        visibility: true,
        text: 'Button text',
        classes: /bg-slate-300/,
      },
      {
        locator: frame.locator('#story--buttons-secondarybutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        visibility: true,
        text: 'Button text',
        classes: /active:bg-lime-400/,
      },
      {
        locator: frame.locator('#story--buttons-secondarybutton--text-inner').getByRole('button', { name: 'Button text' }),
        visibility: true,
        text: 'Button text',
        classes: /active:bg-lime-400/,
      },
    ];

    await validateElements(secondaryButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Severity Button", async ({ page }) => {
  const caseId = 67;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-severitybutton--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const severityButtons = [
      {
        locator: frame.getByRole('button', { name: 'Info Severity Button' }),
        visibility: true,
        text: 'Info Severity Button',
        classes: /bg-indigo-50/,
      },
      {
        locator: frame.getByRole('button', { name: 'Warning Severity Button' }),
        visibility: true,
        text: 'Warning Severity Button',
        classes: /bg-warning/,
      },
      {
        locator: frame.getByRole('button', { name: 'Error Severity Button' }),
        visibility: true,
        text: 'Error Severity Button',
        classes: /bg-red-500/,
      },
      {
        locator: frame.getByRole('button', { name: 'Success Severity Button' }),
        visibility: true,
        text: 'Success Severity Button',
        classes: /bg-success-main/,
      },
    ];

    await validateElements(severityButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Success Button", async ({ page }) => {
  const caseId = 68;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-successbutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);

    const successButtons = [
      {
        locator: frame.locator('#story--buttons-successbutton--primary-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /bg-success-main/,
      },
      {
        locator: frame.locator('#story--buttons-successbutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /hover:bg-green-400/,
      },
      {
        locator: frame.locator('#story--buttons-successbutton--text-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /active:bg-green-300/,
      },
    ];

    await validateElements(successButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Warning Button", async ({ page }) => {
  const caseId = 69;

  try {
    await page.goto(styleGuideURL + '/?path=/docs/buttons-warningbutton--docs');

    await documentReady(page);

    const frame = await getStorybookFrame(page);

    const warningButtons = [
      {
        locator: frame.locator('#story--buttons-warningbutton--primary-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /bg-lime-400/,
      },
      {
        locator: frame.locator('#story--buttons-warningbutton--outlined-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /hover:bg-yellow-600/,
      },
      {
        locator: frame.locator('#story--buttons-warningbutton--text-inner').getByRole('button', { name: 'Button text' }),
        text: "Button text",
        classRegex: /active:bg-lime-400/,
      },
    ];

    await validateElements(warningButtons);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});

test("Style Guide - Yellow Button", async ({ page }) => {
  const caseId = 70;

  try {
    await page.goto(styleGuideURL + '/?path=/story/buttons-yellowbutton--default');

    await documentReady(page);

    const frame = await getStorybookFrame(page);
    const yellowButton = [
      {
        locator: frame.getByRole('button', { name: 'Yellow Button', exact: true }),
        visibility: true,
        text: 'Yellow Button',
        css: { 'background-color': 'rgb(255, 230, 0)' },
      },
      {
        locator: frame.getByRole('button', { name: 'Yellow Button Client' }),
        visibility: true,
        text: 'Yellow Button Client',
        css: { 'background-color': 'rgb(255, 230, 0)' },
      },
    ];

    await validateElements(yellowButton);

    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});