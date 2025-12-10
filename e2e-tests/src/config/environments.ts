export const environments = {
	local: {
		baseURL: "http://localhost:4000",
		timeout: 30000,
		navigationTimeout: 30000,
		actionTimeout: 10000,
	},
	qa: {
		baseURL: "https://qa.goodparty.org",
		timeout: 45000,
		navigationTimeout: 45000,
		actionTimeout: 15000,
	},
	prod: {
		baseURL: "https://goodparty.org",
		timeout: 60000,
		navigationTimeout: 60000,
		actionTimeout: 20000,
	},
};

export const getCurrentEnvironment = () => {
	const env = process.env.NODE_ENV || "local";
	return environments[env as keyof typeof environments] || environments.local;
};

export const getConfig = () => getCurrentEnvironment();
