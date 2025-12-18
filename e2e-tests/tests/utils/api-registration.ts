import { randomUUID } from "node:crypto";
import { type Page, test } from "@playwright/test";
import axios, { type AxiosInstance } from "axios";
import { uniqBy } from "es-toolkit";
import { TestDataHelper } from "src/helpers/data.helper";
import type { TestUser } from "src/helpers/onboarded-user.helper";

const baseURL = process.env.BASE_URL || "http://localhost:4000";
const apiURL = `${baseURL}/api`;

export type TestUserOptions = {
	/**
	 * If true, a dedicated user will be created for the test.
	 * Otherwise, the user will be shared with other tests.
	 */
	isolated?: boolean;
	user?: Partial<Omit<TestUser, "password" | "id" | "zip">>;
	race?: {
		zip: string;
		office: string | ((offices: string) => boolean);
	};
};

export type AuthenticatedUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	name: string;
	zip: string;
	phone: string;
};

type Race = {
	id: string;
	filingPeriods: { startOn: string; endOn: string }[];
	election: {
		id: string;
		electionDay: string;
		name: string;
		state: string;
	};
	position: {
		id: string;
		hasPrimary: boolean;
		partisanType: string;
		level: string;
		name: string;
		state: string;
	};
};

type BootstrappedUser = {
	user: AuthenticatedUser;
	token: string;
	client: AxiosInstance;
};

// Global cache for shared users per worker
let cachedUser: BootstrappedUser | null = null;

const bootstrapTestUser = async (
	options?: TestUserOptions,
): Promise<BootstrappedUser> => {
	// If isolated is false/undefined and we have a cached user, return it
	if (!options?.isolated && cachedUser) {
		return cachedUser;
	}

	const client = axios.create({ baseURL: apiURL });

	const generated = TestDataHelper.generateTestUser();

	const zip = options?.race?.zip || generated.zipCode;

	const registerResponse = await client.post<{
		user: AuthenticatedUser;
		token: string;
	}>("/v1/authentication/register", {
		...TestDataHelper.generateTestUser(),
		signUpMode: "candidate",
		...generated,
		zipCode: zip,
		password: randomUUID(),
	});

	client.defaults.headers.common.Authorization = `Bearer ${registerResponse.data.token}`;

	const { data: races } = await client.get<Race[]>(
		"/v1/elections/races-by-year",
		{
			params: {
				zipcode: zip,
			},
		},
	);

	const desiredRace =
		options?.race?.office ?? "Flat Rock Village Council - District 1";
	const race = races.find((race) => {
		if (typeof desiredRace === "function") {
			return desiredRace(race.position.name);
		} else {
			return race.position.name === desiredRace;
		}
	});

	if (!race) {
		throw new Error("No race found for the specific office selector");
	}

	await client.put("/v1/campaigns/mine", {
		details: {
			positionId: race.position.id,
			electionId: race.election.id,
			raceId: race.id,
			state: race.election.state,
			office: "Other",
			otherOffice: race.position.name,
			ballotLevel: race.position.level,
			electionDate: race.election.electionDay,
			partisanType: race.position.partisanType,
			hasPrimary: race.position.hasPrimary,
			filingPeriodsStart: race.filingPeriods[0]?.startOn,
			filingPeriodsEnd: race.filingPeriods[0]?.endOn,
		},
		pathToVictory: {},
		data: { currentStep: "onboarding-1" },
	});
	await client.put("/v1/campaigns/mine/race-target-details", {});
	await client.put("/v1/campaigns/mine", {
		data: { currentStep: "onboarding-2" },
		details: { otherParty: "Independent" },
	});
	await client.put("/v1/campaigns/mine", {
		data: { currentStep: "onboarding-3" },
		details: { pledged: true },
	});
	await client.put("/v1/campaigns/mine", {
		data: { currentStep: "onboarding-complete" },
	});
	await client.post("/v1/campaigns/launch", {});

	const user = registerResponse.data.user;

	const result: BootstrappedUser = {
		user,
		client,
		token: registerResponse.data.token,
	};

	// Cache the user if not isolated
	if (!options?.isolated) {
		cachedUser = result;
	}

	return result;
};

const createdUsers: {
	user: AuthenticatedUser;
	cleanup: () => Promise<void>;
}[] = [];

// biome-ignore lint/correctness/noEmptyPattern: Playwright forces us to use destructuring here.
test.afterAll(async ({}) => {
	const users = uniqBy(createdUsers, ({ user }) => user.id);
	for (const { cleanup } of users) {
		await cleanup();
	}
});

export const authenticateTestUser = async (
	page: Page,
	options?: TestUserOptions,
) => {
	const start = Date.now();
	const { user, token, client } = await bootstrapTestUser(options);

	const { title } = test.info();

	createdUsers.push({
		user,
		cleanup: async () => {
			await client.delete("/logout");
			console.log(`[${title}] Deleted user ${user.email} (id: ${user.id})`);
		},
	});

	const userCreated = Date.now();
	if (options?.isolated) {
		console.log(
			`[${title}] Created new user ${user.email} (id: ${user.id}) in ${
				userCreated - start
			}ms`,
		);
	} else {
		console.log(`[${title}] Using cached user ${user.email} (id: ${user.id})`);
	}

	const domain = baseURL.replace("http://", "").replace("https://", "");
	await page.context().addCookies([
		{
			name: "token",
			value: token,
			domain,
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
		},
		{
			name: "user",
			value: JSON.stringify(user),
			domain,
			path: "/",
			sameSite: "Lax",
		},
	]);

	const loginTime = Date.now();
	console.log(
		`[${title}] Logged in user ${user.email} (id: ${user.id}) in ${
			loginTime - userCreated
		}ms`,
	);

	return { user, client };
};
