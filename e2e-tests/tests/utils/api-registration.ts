import { randomUUID } from 'node:crypto'
import { type Page, test } from '@playwright/test'
import axios, { type AxiosInstance } from 'axios'
import { uniqBy } from 'es-toolkit'
import { createClerkClient } from '@clerk/backend'
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright'
import { TestDataHelper } from 'src/helpers/data.helper'
import { clerkThrottle } from './throttle-requests-with-retry'

const baseURL = process.env.BASE_URL

if (!baseURL) {
  throw new Error('BASE_URL is not set')
}

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not set')
}

const clerkBackend = createClerkClient({ secretKey: CLERK_SECRET_KEY })

const apiBaseURL = process.env.API_BASE_URL || baseURL
const apiURL = `${apiBaseURL}/api`

type BaseTestUserOptions = {
  /**
   * If true, a dedicated user will be created for the test.
   * Otherwise, the user will be shared with other tests.
   */
  isolated?: boolean
  user?: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
  }>
  race?: {
    zip: string
    office: string | ((offices: string) => boolean)
  }
}

export type TestUserOptions =
  | (BaseTestUserOptions & { skipCampaignCreation?: false })
  | (BaseTestUserOptions & {
      /**
       * If true, automated campaign onboarding will be skipped.
       * Requires isolated: true to prevent caching an incomplete user.
       */
      skipCampaignCreation: true
      isolated: true
    })

export type AuthenticatedUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  name: string
  zip: string
  phone: string
  password: string
}

type Race = {
  id: string
  filingPeriods: { startOn: string; endOn: string }[]
  election: {
    id: string
    electionDay: string
    name: string
    state: string
  }
  position: {
    id: string
    hasPrimary: boolean
    partisanType: string
    level: string
    name: string
    state: string
  }
}

type BootstrappedUser = {
  user: AuthenticatedUser
  token: string
  client: AxiosInstance
}

type CachedCredentials = {
  email: string
  password: string
  user: AuthenticatedUser
  clerkUserId: string
}

// Global cache for shared users per worker
let cachedCredentials: CachedCredentials | null = null

async function signInAndGetToken(page: Page, email: string): Promise<string> {
  await setupClerkTestingToken({ page })
  await page.goto('/')
  await page.waitForFunction(() => window.Clerk?.loaded, null, {
    timeout: 15000,
  })

  await clerkThrottle(
    () =>
      clerk.signIn({
        page,
        emailAddress: email,
      }),
    5,
  )

  const token = await page.evaluate(() => window.Clerk!.session!.getToken())

  if (!token) {
    throw new Error('Failed to get Clerk session token after sign-in')
  }

  return token
}

const bootstrapTestUser = async (
  page: Page,
  options?: TestUserOptions,
): Promise<BootstrappedUser & { clerkUserId: string }> => {
  if (!options?.isolated && cachedCredentials) {
    const token = await signInAndGetToken(page, cachedCredentials.email)

    return {
      user: { ...cachedCredentials.user, password: cachedCredentials.password },
      token,
      client: axios.create({
        baseURL: apiURL,
        headers: {
          common: { Authorization: `Bearer ${token}` },
        },
      }),
      clerkUserId: cachedCredentials.clerkUserId,
    }
  }

  const generated = TestDataHelper.generateTestUserData()
  const password = `Test${randomUUID()}!`
  const zip = options?.race?.zip || generated.zipCode

  const clerkUser = await clerkThrottle(() =>
    clerkBackend.users.createUser({
      emailAddress: [generated.email],
      password,
      firstName: generated.firstName,
      lastName: generated.lastName,
      skipPasswordChecks: true,
    }),
  )

  const token = await signInAndGetToken(page, generated.email)

  const client = axios.create({
    baseURL: apiURL,
    headers: {
      common: { Authorization: `Bearer ${token}` },
    },
  })

  const { data: apiUser } = await client.get<{
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
  }>('/v1/users/me')

  const user: AuthenticatedUser = {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    zip,
    phone: apiUser.phone || generated.phone,
    password,
  }

  const result = {
    user,
    token,
    client,
    clerkUserId: clerkUser.id,
  }

  if (!options?.isolated) {
    cachedCredentials = {
      email: generated.email,
      password,
      user,
      clerkUserId: clerkUser.id,
    }
  }

  if (options?.skipCampaignCreation) {
    return result
  }

  const { data: races } = await client.get<Race[]>(
    '/v1/elections/races-by-year',
    {
      params: {
        zipcode: zip,
      },
    },
  )

  const desiredRace = options?.race?.office ?? 'Cheyenne City Council - Ward 2'
  const race = races.find((race) => {
    if (typeof desiredRace === 'function') {
      return desiredRace(race.position.name)
    } else {
      return race.position.name === desiredRace
    }
  })

  if (!race) {
    throw new Error('No race found for the specific office selector')
  }

  await client.post('/v1/campaigns', {
    ballotReadyPositionId: race.position.id,
    details: {
      electionId: race.election.id,
      raceId: race.id,
      state: race.election.state,
      ballotLevel: race.position.level,
      electionDate: race.election.electionDay,
      partisanType: race.position.partisanType,
      hasPrimary: race.position.hasPrimary,
      filingPeriodsStart: race.filingPeriods[0]?.startOn,
      filingPeriodsEnd: race.filingPeriods[0]?.endOn,
    },
    data: { currentStep: 'onboarding-1' },
  })
  await client.put('/v1/campaigns/mine/race-target-details', {})
  await client.put('/v1/campaigns/mine', {
    data: { currentStep: 'onboarding-complete' },
    details: { otherParty: 'Independent', pledged: true },
  })
  await client.post('/v1/campaigns/launch', {})
  return result
}

const createdUsers: {
  user: AuthenticatedUser
  cleanup: () => Promise<void>
}[] = []

// biome-ignore lint/correctness/noEmptyPattern: Playwright forces us to use destructuring here.
test.afterAll(async ({}) => {
  const users = uniqBy(createdUsers, ({ user }) => user.id)
  for (const { cleanup } of users) {
    await cleanup()
  }
  cachedCredentials = null
  createdUsers.length = 0
})

export const authenticateTestUser = async (
  page: Page,
  options?: TestUserOptions,
) => {
  const start = Date.now()
  const { user, client, clerkUserId } = await bootstrapTestUser(page, options)

  const { title } = test.info()

  createdUsers.push({
    user,
    cleanup: async () => {
      try {
        await clerkThrottle(() => clerkBackend.users.deleteUser(clerkUserId))
        console.log(
          `[${title}] Deleted Clerk user ${user.email} (clerk: ${clerkUserId}, api: ${user.id})`,
        )
      } catch (err) {
        console.error(`[${title}] Failed to delete user ${user.email}:`, err)
      }
    },
  })

  const userCreated = Date.now()
  if (process.env.DEBUG) {
    if (options?.isolated) {
      console.log(
        `[${title}] Created new user ${user.email} (id: ${user.id}) in ${
          userCreated - start
        }ms`,
      )
    } else {
      console.log(`[${title}] Using cached user ${user.email} (id: ${user.id})`)
    }
  }

  const domain = cookieDomain()

  await page.context().addCookies([
    {
      name: 'token',
      value: token,
      domain,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    },
    {
      name: 'user',
      value: JSON.stringify(user),
      domain,
      path: '/',
      sameSite: 'Lax',
    },
  ])

  if (!options?.skipCampaignCreation) {
    const { data: campaign } = await client.get<{ id: number }>(
      '/v1/campaigns/mine',
    )
    await page.context().addCookies([
      {
        name: 'organization-slug',
        value: `campaign-${campaign.id}`,
        domain,
        path: '/',
        sameSite: 'Lax',
      },
    ])
  }

  const loginTime = Date.now()
  if (process.env.DEBUG) {
    console.log(
      `[${title}] Logged in user ${user.email} (id: ${user.id}) in ${
        loginTime - userCreated
      }ms`,
    )
  }

  return { user, client }
}
