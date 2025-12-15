export const IS_PROD = process.env.BASE_URL === "https://goodparty.org/";
export const IS_QA = process.env.BASE_URL === "https://qa.goodparty.org/";
export const IS_DEV = !IS_PROD && !IS_QA;

// Helper function to get the current environment
export const getCurrentEnvironment = () => {
	if (IS_PROD) return "production";
	if (IS_DEV) return "development";
	if (IS_QA) return "qa";
	return "unknown";
};
