import * as fs from "node:fs";
import * as path from "node:path";
import { getCurrentEnvironment } from "./src/config/environments";

export default async function globalSetup() {
	console.log("🚀 Starting test suite setup...");

	// Validate environment configuration
	const config = getCurrentEnvironment();
	console.log(`📍 Environment: ${process.env.NODE_ENV || "local"}`);
	console.log(`🌐 Base URL: ${config.baseURL}`);

	// Validate required environment variables for admin tests
	if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
		console.warn(
			"⚠️  Admin credentials not found - admin tests will be skipped",
		);
	}

	const resultsDir = path.resolve(__dirname, "test-results");
	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir, { recursive: true });
	}
}
