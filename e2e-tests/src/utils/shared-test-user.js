const { Page } = require("@playwright/test");
const { TestDataManager } = require("./test-data-manager");
const { NavigationHelper } = require("../helpers/navigation.helper");
const fs = require("fs");
const path = require("path");

class SharedTestUserManager {
  static USER_FILE = path.resolve(__dirname, "../../shared-test-user.json");

  /**
   * Create a shared test user that will be used across all app tests
   */
  static async createSharedTestUser() {
    console.log("🧪 Creating shared test user for app tests...");
    
    const testUser = TestDataManager.generateTestUserData();
    const sharedUser = {
      email: testUser.email,
      password: testUser.password,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    };

    // Save user data for reuse
    fs.writeFileSync(this.USER_FILE, JSON.stringify(sharedUser, null, 2));
    console.log(`📝 Shared test user saved: ${sharedUser.email}`);
    
    return sharedUser;
  }

  /**
   * Get the existing shared test user
   */
  static getSharedTestUser() {
    try {
      if (fs.existsSync(this.USER_FILE)) {
        const userData = JSON.parse(fs.readFileSync(this.USER_FILE, 'utf-8'));
        return userData;
      }
    } catch (error) {
      console.warn("Failed to load shared test user:", error.message);
    }
    return null;
  }

  /**
   * Login with the shared test user
   */
  static async loginWithSharedUser(page) {
    const user = this.getSharedTestUser();
    if (!user) {
      throw new Error("No shared test user available. Run global setup first.");
    }

    console.log(`🔑 Logging in with shared user: ${user.email}`);
    
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await NavigationHelper.dismissOverlays(page);
    
    await page.getByLabel("Email").fill(user.email);
    await page.getByPlaceholder("Please don't use your dog's").fill(user.password);
    
    const loginButton = page.getByRole("button", { name: "Login" });
    await loginButton.waitFor({ state: "visible", timeout: 10000 });
    await loginButton.click();
    
    // Wait for successful login
    await page.waitForURL(url => url.toString().includes('/dashboard'), { timeout: 30000 });
    console.log("✅ Shared user login successful");
  }

  /**
   * Delete the shared test user
   */
  static async deleteSharedTestUser(page) {
    const user = this.getSharedTestUser();
    if (!user) {
      console.log("ℹ️ No shared test user to delete");
      return;
    }

    try {
      console.log(`🗑️ Deleting shared test user: ${user.email}`);
      
      // Login first
      await this.loginWithSharedUser(page);
      
      // Navigate to profile and delete
      await page.goto("/profile");
      await page.waitForLoadState("domcontentloaded");
      
      // Scroll to delete button
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      const deleteButton = page.getByText("Delete Account");
      if (await deleteButton.isVisible({ timeout: 5000 })) {
        await deleteButton.click();
        
        // Handle confirmation modal
        await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
        const proceedButton = page.getByRole("button", { name: "Proceed" });
        await proceedButton.click();
        
        // Wait for redirect
        await page.waitForURL(url => !url.toString().includes('/profile'), { timeout: 10000 });
        console.log("✅ Shared test user deleted successfully");
      }
      
      // Clean up the file
      if (fs.existsSync(this.USER_FILE)) {
        fs.unlinkSync(this.USER_FILE);
      }
      
    } catch (error) {
      console.warn("⚠️ Failed to delete shared test user:", error.message);
    }
  }

  /**
   * Check if shared test user exists and is valid
   */
  static hasValidSharedUser() {
    return fs.existsSync(this.USER_FILE);
  }
}

module.exports = { SharedTestUserManager };
