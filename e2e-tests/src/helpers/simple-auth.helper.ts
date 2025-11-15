import { Page, expect } from "@playwright/test";

/**
 * Simple authentication helper that uses existing admin session
 * This avoids the complexity of account creation/deletion for now
 */
export class SimpleAuthHelper {
  /**
   * Use existing admin session if available
   */
  static async useExistingAdminSession(page: Page): Promise<boolean> {
    try {
      // Try to use existing admin session
      const adminSessionFile = "/Users/tomeralmog/Documents/gp/dev/test-automation/admin-auth.json";
      const fs = await import("fs");
      
      if (fs.existsSync(adminSessionFile)) {
        console.log("🔑 Using existing admin session...");
        
        // Load the session
        await page.context().addCookies(JSON.parse(fs.readFileSync(adminSessionFile, 'utf-8')).cookies || []);
        
        // Navigate to dashboard
        await page.goto("/dashboard");
        await page.waitForLoadState("domcontentloaded");
        
        // Check if we're logged in
        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard') || currentUrl.includes('/admin')) {
          console.log("✅ Admin session is valid");
          return true;
        }
      }
    } catch (error) {
      console.log("⚠️ Admin session not available:", error.message);
    }
    
    return false;
  }

  /**
   * Use admin credentials if available
   */
  static async loginAsAdmin(page: Page): Promise<boolean> {
    const adminEmail = process.env.TEST_USER_ADMIN;
    const adminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return false;
    }

    try {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");
      
      await page.getByLabel("Email").fill(adminEmail);
      await page.getByPlaceholder("Please don't use your dog's").fill(adminPassword);
      
      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.waitFor({ state: "visible", timeout: 10000 });
      await loginButton.click();
      
      // Wait for successful login
      await page.waitForURL(url => url.toString().includes('/dashboard'), { timeout: 30000 });
      
      console.log("✅ Admin login successful");
      return true;
    } catch (error) {
      console.warn("⚠️ Admin login failed:", error.message);
      return false;
    }
  }
}
