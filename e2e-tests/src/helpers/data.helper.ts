import { TestDataManager } from "../utils/test-data-manager";

export class TestDataHelper {
	/**
	 * Generate test user data (does NOT create actual user)
	 * Use this for form validation tests that don't submit
	 */
	static generateTestUser() {
		return TestDataManager.generateTestUserData();
	}

	/**
	 * Generate safe test email that won't conflict
	 */
	static generateTestEmail(): string {
		const timestamp = Date.now();
		const env = process.env.NODE_ENV || "local";
		return `test-${timestamp}@${env}.example.com`;
	}

	/**
	 * Generate test phone number
	 */
	static generateTestPhone(): string {
		const timestamp = Date.now().toString().slice(-6);
		return `5105${timestamp}`;
	}

	/**
	 * Generate timestamp string
	 */
	static generateTimestamp(): string {
		const now = new Date();
		const month = `${now.getMonth() + 1}`.padStart(2, "0");
		const day = `${now.getDate()}`.padStart(2, "0");
		const hours = `${now.getHours()}`.padStart(2, "0");
		const minutes = `${now.getMinutes()}`.padStart(2, "0");
		const seconds = `${now.getSeconds()}`.padStart(2, "0");
		return `${month}${day}${hours}${minutes}${seconds}`;
	}

	/**
	 * Generate website URL for testing
	 */
	static generateWebsiteUrl(): string {
		const timestamp = TestDataHelper.generateTimestamp();
		return `test-website-${timestamp}`;
	}
}
