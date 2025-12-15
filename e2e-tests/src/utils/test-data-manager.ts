export interface TestUser {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	zipCode: string;
}

export interface TestCardInfo {
	cardNumber: string;
	expirationDate: string;
	zipCode: string;
	cvc: string;
}

export class TestDataManager {
	/**
	 * Return canonical test credit card details for use in tests.
	 */
	static getTestCardInfo(): TestCardInfo {
		return {
			cardNumber: "4242424242424242",
			expirationDate: "12/28",
			zipCode: "90210",
			cvc: "123",
		};
	}

	/**
	 * Generate test user data without creating the account
	 */
	static generateTestUserData(): TestUser {
		const timestamp = Date.now();
		const env = process.env.NODE_ENV || "local";

		return {
			firstName: `Test${timestamp}`,
			lastName: "User",
			email: `test-${timestamp}@${env}.example.com`,
			phone: `5105${timestamp.toString().slice(-6)}`,
			password: process.env.TEST_DEFAULT_PASSWORD || "TestPassword123!",
			zipCode: "28739",
		};
	}
}
