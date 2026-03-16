import { createClerkClient } from '@clerk/backend'

const TEST_EMAIL_DOMAIN = 'test.goodparty.org'

export default async function globalTeardown() {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    console.warn('[global-teardown] CLERK_SECRET_KEY not set, skipping cleanup')
    return
  }

  const clerk = createClerkClient({ secretKey })

  console.log(
    `[global-teardown] Cleaning up Clerk users with @${TEST_EMAIL_DOMAIN} emails...`,
  )

  let deletedCount = 0
  let offset = 0
  const limit = 100

  while (true) {
    const { data: users } = await clerk.users.getUserList({
      limit,
      offset,
    })

    if (users.length === 0) break

    const testUsers = users.filter((user) =>
      user.emailAddresses.some((e) =>
        e.emailAddress.endsWith(`@${TEST_EMAIL_DOMAIN}`),
      ),
    )

    for (const user of testUsers) {
      const email = user.emailAddresses.find((e) =>
        e.emailAddress.endsWith(`@${TEST_EMAIL_DOMAIN}`),
      )?.emailAddress

      try {
        await clerk.users.deleteUser(user.id)
        deletedCount++
        console.log(
          `[global-teardown] Deleted ${email ?? user.id}`,
        )
      } catch (err) {
        console.error(
          `[global-teardown] Failed to delete ${email ?? user.id}:`,
          err,
        )
      }
    }

    if (users.length < limit) break

    offset += users.length - testUsers.length
  }

  console.log(`[global-teardown] Deleted ${deletedCount} test user(s)`)
}
