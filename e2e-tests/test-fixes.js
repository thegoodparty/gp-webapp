#!/usr/bin/env node

/**
 * Simple script to test the most problematic tests individually
 * Now using global test user with completed onboarding
 * Run with: node test-fixes.js
 */

const { execSync } = require("child_process");

const problematicTests = [
  "tests/app/ai/ai-assistant.spec.ts",
  "tests/app/profile/profile.spec.ts",
  "tests/app/content/content-builder.spec.ts",
];

console.log("🧪 Testing fixes with global user approach...\n");

for (const testFile of problematicTests) {
  console.log(`\n📋 Running: ${testFile}`);
  console.log("=".repeat(50));

  try {
    const result = execSync(`npx playwright test ${testFile} --reporter=list`, {
      encoding: "utf8",
      stdio: "inherit",
      timeout: 120000, // 2 minutes per test
    });

    console.log(`✅ ${testFile} - PASSED`);
  } catch (error) {
    console.log(`❌ ${testFile} - FAILED`);
    console.log(`Exit code: ${error.status}`);
  }
}

console.log("\n🏁 Test fixes validation complete!");
