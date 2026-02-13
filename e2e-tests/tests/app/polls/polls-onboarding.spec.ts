import { SQS } from '@aws-sdk/client-sqs'
import { expect, type Page, test } from '@playwright/test'
import type { MessageElement } from '@slack/web-api/dist/types/response/ConversationsHistoryResponse'
import { parse as parseCSV } from 'csv-parse/sync'
import { addBusinessDays, format, subDays } from 'date-fns'
import { NavigationHelper } from 'src/helpers/navigation.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { eventually } from 'tests/utils/eventually'
import { downloadSlackFile, waitForSlackMessage } from 'tests/utils/slack'

const district = {
  zip: '82001',
  office: 'Cheyenne City Council - Ward 2',
  constituents: 13000,
}

const expectToBeWithin = (
  value: number,
  expected: number,
  plusOrMinus: number,
) => {
  expect(value).toBeGreaterThanOrEqual(expected - plusOrMinus)
  expect(value).toBeLessThanOrEqual(expected + plusOrMinus)
}

const getQueueNameFromSlackMessage = (text: string) => {
  const environment = text.match(/serve-analyze-data-([a-z]+)/)?.[1]
  if (!environment) {
    throw new Error('No environment found in slack message')
  }

  const queues: Record<string, string> = {
    dev: 'develop-Queue.fifo',
    qa: 'qa-Queue.fifo',
    prod: 'master-Queue.fifo',
  }

  const queueName = queues[environment]

  if (!queueName) {
    throw new Error(`Could not find queue for environment`)
  }

  return queueName
}

const waitForPollSlackData = async (
  matching: (message: MessageElement) => boolean,
) => {
  const slackMessage = await waitForSlackMessage({
    // #tevyn-api-test
    channel: 'C09KUHEUY95',
    matching,
  })

  const pollId = slackMessage.text?.match(/\*Poll ID:\* `([a-z0-9-]+)`/)?.[1]
  if (!pollId) {
    throw new Error('No poll ID found in slack message')
  }

  const fileId = slackMessage.files?.at(0)?.id
  if (!fileId) {
    throw new Error('No file id found in slack message')
  }

  const csv = await downloadSlackFile(fileId)

  const csvRows = parseCSV(csv.toString('utf8'), { columns: true })

  const queueName = getQueueNameFromSlackMessage(slackMessage.text || '')

  return { pollId, csvRows, queueName }
}

const pickDateOnCalendar = async (page: Page, date: Date) => {
  const dateLocator = page.locator(`[data-day="${format(date, 'yyyy-MM-dd')}"]`)

  // If the date is not visible (e.g., it's in the next month), navigate forward
  if (!(await dateLocator.isVisible())) {
    await page.getByRole('button', { name: 'Go to the Next Month' }).click()
  }

  await dateLocator.click()
}

const completePoll = async (params: {
  queueName: string
  pollId: string
  totalResponses: number
  issues: {
    rank: number
    theme: string
    summary: string
    analysis: string
    responseCount: number
    quotes: { quote: string; phone_number: string }[]
  }[]
}) => {
  const sqs = new SQS({ region: 'us-west-2' })

  const { QueueUrl } = await sqs.getQueueUrl({
    QueueName: params.queueName,
  })

  const queueEvent = {
    type: 'pollAnalysisComplete',
    data: {
      pollId: params.pollId,
      totalResponses: params.totalResponses,
      issues: params.issues.map((issue) => ({
        pollId: params.pollId,
        ...issue,
      })),
    },
  }

  await sqs.sendMessage({
    QueueUrl: QueueUrl!,
    MessageGroupId: `polls-${params.pollId}`,
    MessageDeduplicationId: crypto.randomUUID(),
    MessageBody: JSON.stringify(queueEvent),
  })

  return queueEvent
}

const with11AmLocalTime = (date: Date) => {
  const copy = new Date(date)
  copy.setHours(11, 0, 0, 0)
  return copy
}

test('poll onboarding and expansion', async ({ page }) => {
  // Set this test's timeout to 10 minutes
  test.setTimeout(10 * 60 * 1000)
  const { user, client } = await authenticateTestUser(page, {
    isolated: true,
    race: { zip: district.zip, office: district.office },
  })
  await page.goto('/polls/welcome')
  await NavigationHelper.dismissOverlays(page)

  await page.getByRole('button', { name: "Let's get started" }).click()

  // Confirm constituent count.
  const constituentCount = await page
    .getByTestId('total-constituents')
    .textContent({ timeout: 25_000 })

  expect(constituentCount).toBeTruthy()

  expectToBeWithin(
    parseInt(constituentCount!.replace(/,/g, ''), 10),
    district.constituents,
    500,
  )

  // Move through onboarding flow.
  await page.getByRole('button', { name: 'Next', exact: true }).click()

  // Set sworn in date to yesterday
  const yesterday = subDays(new Date(), 1)
  await page.locator(`[data-day="${format(yesterday, 'yyyy-MM-dd')}"]`).click()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await page.getByRole('button', { name: 'Create poll' }).click()
  await page.getByRole('button', { name: 'Pick Send Date' }).click()

  // Find next available send date
  const sendDate = addBusinessDays(new Date(), 6)
  await pickDateOnCalendar(page, sendDate)

  await page.getByRole('button', { name: 'Add Image' }).click()

  // TODO: actually add an image
  await page.getByRole('button', { name: 'See Preview' }).click()

  // Create poll.
  await page.getByRole('button', { name: 'Send SMS poll' }).click()

  // Confirm the correct data shows up in the UI
  await expect(page.getByText('Top Community Issues')).toBeVisible()

  const scheduledDate = `${format(sendDate, 'MMM d, yyyy')} at 11:00 AM`
  await expect(page.getByText(`Scheduled Date: ${scheduledDate}`)).toBeVisible()
  const estimatedCompletionDate = addBusinessDays(sendDate, 3)
  await expect(
    page.getByText(
      `Estimated Completion Date: ${format(
        estimatedCompletionDate,
        'MMM d, yyyy',
      )} at 11:00 AM`,
    ),
  ).toBeVisible()

  await expect(
    page.getByText(`This poll is scheduled to send on ${scheduledDate}.`),
  ).toBeVisible()

  console.log(`Poll created at ${new Date().toTimeString()}`)

  const { pollId, csvRows, queueName } = await waitForPollSlackData(
    (message) => !!message.text?.includes(user.email),
  )

  console.log(`Found Poll ID: ${pollId}`)

  expect(csvRows).toHaveLength(500)

  // Verify the poll exists in the API, and has the expected fields
  const apiPoll = await client.get(`/v1/polls/${pollId}`)
  expect(apiPoll.status).toBe(200)
  expect(apiPoll.data).toMatchObject({
    id: pollId,
    scheduledDate: with11AmLocalTime(sendDate).toISOString(),
    estimatedCompletionDate: with11AmLocalTime(
      estimatedCompletionDate,
    ).toISOString(),
    audienceSize: 500,
  })

  const queuedEvent = await completePoll({
    queueName,
    pollId,
    totalResponses: 45,
    issues: [
      {
        rank: 1,
        responseCount: 25,
        theme: 'Traffic Congestion',
        summary:
          'Traffic congestion is a major problem in the city. It is causing delays and frustration for residents.',
        analysis:
          'Traffic congestion is a major problem in the city. It is causing delays and frustration for residents. We need to do something about it.',
        quotes: [
          {
            quote: "I hate traffic. It's so frustrating.",
            phone_number: '+15555555555',
          },
          {
            quote: "I'm always late for work because of traffic.",
            phone_number: '+15555555556',
          },
        ],
      },
      {
        rank: 2,
        responseCount: 7,
        theme: 'Crime',
        summary:
          'Crime is a major problem in the city. It is causing fear and frustration for residents.',
        analysis:
          'Crime is a major problem in the city. It is causing fear and frustration for residents. We need to do something about it.',
        quotes: [
          {
            quote: "I'm scared to walk the streets at night.",
            phone_number: '+15555555556',
          },
        ],
      },
    ],
  })

  console.log('Send SQS event to complete poll')

  // Wait for results to come in.
  await eventually(
    {
      that: 'the poll is updated with results',
      minTimeout: 500,
      maxTimeout: 5000,
    },
    async () => {
      const res = await client.get(`/v1/polls/${pollId}`)

      expect(res.status).toBe(200)

      expect(res.data).toMatchObject({
        status: 'completed',
        name: 'Top Community Issues',
        completedDate: expect.any(String),
        audienceSize: 500,
        responseCount: 45,
        lowConfidence: true,
      })
    },
  )

  // Confirm the UI is updated according to results.
  await page.reload()
  await expect(page.getByText('Poll Confidence: Low')).toBeVisible()
  await expect(page.getByText('Top Themes')).toBeVisible()

  for (const issue of queuedEvent.data.issues) {
    await expect(page.getByText(issue.theme, { exact: true })).toBeVisible()
    await expect(page.getByText(issue.summary)).toBeVisible()
    await expect(
      page.getByText(`${issue.responseCount} Mentions`),
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'View Details' })
      .nth(issue.rank - 1)
      .click()
    await expect(page.getByText(issue.analysis)).toBeVisible()

    for (const quote of issue.quotes) {
      await expect(page.getByText(quote.quote)).toBeVisible()
    }
    await page.goBack()
  }

  // Expand the poll.
  await page.goto(`/dashboard/polls/${pollId}`)
  await page.getByText('Gather More Feedback').click()

  // Confirm recommendation.
  await page.getByText('Recommended').click()
  await page
    .getByRole('button', { name: 'Pick Send Date' })
    .click({ force: true })

  // Pick the expansion send date
  const expansionSendDate = addBusinessDays(new Date(), 7)
  await pickDateOnCalendar(page, expansionSendDate)
  await page.getByRole('button', { name: 'Review' }).click({ force: true })

  const expansionCompletionDate = addBusinessDays(expansionSendDate, 3)
  await expect(
    page.getByText(`Send Date: ${expansionSendDate.toDateString()} at 11:00am`),
  ).toBeVisible()
  await expect(
    page.getByText(
      `Estimated Completion: ${expansionCompletionDate.toDateString()} at 11:00am`,
    ),
  ).toBeVisible()

  await page
    .getByRole('button', { name: 'Go to payment' })
    .click({ force: true })

  // Capture browser console messages and failing network requests
  const consoleLogs: string[] = []
  const failedRequests: string[] = []
  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => {
    consoleLogs.push(`[PAGE_ERROR] ${err.message}`)
  })
  page.on('response', (response) => {
    const status = response.status()
    if (status >= 400) {
      failedRequests.push(`[${status}] ${response.url()}`)
    }
  })

  const stripeIframe = page
    .locator('iframe[title="Secure payment input frame"]')
    .first()
  await expect(stripeIframe).toBeVisible({ timeout: 30_000 })

  const stripeFrame = page
    .frameLocator('iframe[title="Secure payment input frame"]')
    .first()

  // Log all input labels inside the Stripe iframe for debugging
  const allLabels = await stripeFrame
    .locator('label')
    .allTextContents()
    .catch(() => ['(could not read labels)'])
  console.log(`[DEBUG] Stripe iframe labels: ${JSON.stringify(allLabels)}`)

  const allInputs = await stripeFrame
    .locator('input')
    .evaluateAll((els) =>
      els.map((el) => ({
        name: el.getAttribute('name'),
        'aria-label': el.getAttribute('aria-label'),
        placeholder: el.getAttribute('placeholder'),
        id: el.id,
      })),
    )
    .catch(() => [{ error: 'could not read inputs' }])
  console.log(`[DEBUG] Stripe iframe inputs: ${JSON.stringify(allInputs)}`)

  const cardNumber = stripeFrame.getByLabel('Card number')
  await expect(cardNumber).toBeVisible({ timeout: 30_000 })
  await expect(cardNumber).toBeEditable({ timeout: 30_000 })
  await page.waitForTimeout(2_000)

  await cardNumber.click()
  await cardNumber.pressSequentially('4242424242424242', { delay: 35 })
  await page.waitForTimeout(500)

  // Try multiple selectors for expiry field
  let expiry = stripeFrame.getByLabel('Expiration date')
  let expiryVisible = await expiry.isVisible().catch(() => false)
  console.log(`[DEBUG] "Expiration date" label visible: ${expiryVisible}`)

  if (!expiryVisible) {
    expiry = stripeFrame.getByLabel('Expiration')
    expiryVisible = await expiry.isVisible().catch(() => false)
    console.log(`[DEBUG] "Expiration" label visible: ${expiryVisible}`)
  }
  if (!expiryVisible) {
    expiry = stripeFrame.getByLabel('Expiry')
    expiryVisible = await expiry.isVisible().catch(() => false)
    console.log(`[DEBUG] "Expiry" label visible: ${expiryVisible}`)
  }
  if (!expiryVisible) {
    expiry = stripeFrame.getByPlaceholder('MM / YY')
    expiryVisible = await expiry.isVisible().catch(() => false)
    console.log(`[DEBUG] "MM / YY" placeholder visible: ${expiryVisible}`)
  }

  await expect(expiry).toBeVisible({ timeout: 10_000 })
  await expect(expiry).toBeEditable({ timeout: 10_000 })
  await expiry.click()
  await expiry.pressSequentially('0135', { delay: 50 })
  await page.waitForTimeout(500)

  // Verify expiry field actually has content
  const expiryCheck = await expiry.inputValue().catch(() => 'N/A')
  console.log(`[DEBUG] Expiry value after fill: "${expiryCheck}"`)
  if (expiryCheck === 'N/A' || expiryCheck === '') {
    console.log('[DEBUG] Expiry field empty, trying fill() with 01/35')
    await expiry.click()
    await expiry.fill('01/35')
    await page.waitForTimeout(500)
    const retryVal = await expiry.inputValue().catch(() => 'N/A')
    console.log(`[DEBUG] Expiry value after fill() retry: "${retryVal}"`)
  }

  const cvc = stripeFrame.getByLabel('Security code')
  await expect(cvc).toBeVisible({ timeout: 30_000 })
  await cvc.click()
  await cvc.pressSequentially('123', { delay: 35 })
  await page.waitForTimeout(500)

  // Try multiple selectors for ZIP
  let zip = stripeFrame.getByLabel('ZIP code')
  let zipVisible = await zip.isVisible().catch(() => false)
  if (!zipVisible) {
    zip = stripeFrame.getByLabel('ZIP')
    zipVisible = await zip.isVisible().catch(() => false)
    console.log(`[DEBUG] "ZIP" label visible: ${zipVisible}`)
  }
  if (!zipVisible) {
    zip = stripeFrame.getByLabel('Postal code')
    zipVisible = await zip.isVisible().catch(() => false)
    console.log(`[DEBUG] "Postal code" label visible: ${zipVisible}`)
  }
  await expect(zip).toBeVisible({ timeout: 10_000 })
  await zip.click()
  await zip.pressSequentially('82001', { delay: 35 })

  await page.waitForTimeout(2_000)
  await page.screenshot({
    path: 'test-results/stripe-after-fill.png',
    fullPage: true,
  })
  console.log('[DEBUG] Screenshot taken after filling Stripe fields')

  const cardValue = await cardNumber.inputValue().catch(() => 'N/A')
  const expiryValue = await expiry.inputValue().catch(() => 'N/A')
  const cvcValue = await cvc.inputValue().catch(() => 'N/A')
  const zipValue = await zip.inputValue().catch(() => 'N/A')
  console.log(
    `[DEBUG] Stripe field values - Card: ${cardValue}, Expiry: ${expiryValue}, CVC: ${cvcValue}, ZIP: ${zipValue}`,
  )

  // Log failed requests
  console.log(`[DEBUG] Failed requests (${failedRequests.length}):`)
  const uniqueFailedDomains = [
    ...new Set(
      failedRequests.map((r) => {
        try {
          return new URL(r.split('] ')[1] ?? r).hostname
        } catch {
          return r
        }
      }),
    ),
  ]
  console.log(
    `[DEBUG] Failed request domains: ${JSON.stringify(uniqueFailedDomains)}`,
  )
  failedRequests
    .filter((r) => r.includes('stripe') || r.includes('checkout'))
    .forEach((r) => console.log(`  ${r}`))

  const purchaseButton = page.getByRole('button', {
    name: 'Complete Purchase',
  })

  const isDisabled = await purchaseButton.isDisabled()
  console.log(`[DEBUG] Purchase button disabled: ${isDisabled}`)

  const pollInterval = setInterval(async () => {
    try {
      const disabled = await purchaseButton.isDisabled()
      console.log(`[DEBUG] Button state - disabled: ${disabled}`)
    } catch {
      /* page may have navigated */
    }
  }, 3_000)

  const completeCheckoutResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/payments/purchase/complete-checkout-session') &&
      response.request().method() === 'POST',
    { timeout: 45_000 },
  )

  try {
    await expect(purchaseButton).toBeEnabled({ timeout: 30_000 })
  } catch (err) {
    clearInterval(pollInterval)
    await page.screenshot({
      path: 'test-results/stripe-button-timeout.png',
      fullPage: true,
    })
    console.log('[DEBUG] Console logs captured:')
    consoleLogs.slice(-20).forEach((log) => console.log(`  ${log}`))
    console.log(
      `[DEBUG] Button HTML: ${await purchaseButton
        .evaluate((el) => el.outerHTML)
        .catch(() => 'N/A')}`,
    )
    throw err
  }
  clearInterval(pollInterval)
  await purchaseButton.click()

  const completeCheckoutResponse = await completeCheckoutResponsePromise
  expect(completeCheckoutResponse.ok()).toBeTruthy()

  await page.waitForURL(
    (url) => new URL(url).pathname.includes('/expand-payment-success'),
    {
      timeout: 45_000,
    },
  )

  // Confirm API resource updates.
  const { newAudienceSize } = await eventually(
    {
      that: 'the poll is marked as expanding',
      minTimeout: 500,
      maxTimeout: 15_000,
    },
    async () => {
      const res = await client.get(`/v1/polls/${pollId}`)

      expect(res.status).toBe(200)

      expect(res.data).toMatchObject({
        status: 'scheduled',
        name: 'Top Community Issues',
        completedDate: expect.any(String),
        audienceSize: expect.any(Number),
        responseCount: 45,
        lowConfidence: true,
        scheduledDate: with11AmLocalTime(expansionSendDate).toISOString(),
        estimatedCompletionDate: with11AmLocalTime(
          expansionCompletionDate,
        ).toISOString(),
      })

      expect(res.data.audienceSize).toBeGreaterThan(500)

      return { newAudienceSize: res.data.audienceSize as number }
    },
  )

  // Confirm expansion Slack message is sent
  const { csvRows: expansionCsvRows } = await waitForPollSlackData(
    (message) =>
      !!message.text?.includes(user.email) &&
      message.text.includes('This is a poll _expansion_'),
  )

  expect(expansionCsvRows.length).toEqual(newAudienceSize - 500)

  // Ensure the CSV does not contain duplicates
  for (const row of expansionCsvRows) {
    expect(
      csvRows,
      `Duplicate row found: ${JSON.stringify(row)}`,
    ).not.toContainEqual(row)
  }

  // Simulate high-confidence results.
  const expansionIssues = await completePoll({
    queueName,
    pollId,
    totalResponses: 100,
    issues: [
      {
        rank: 1,
        responseCount: 50,
        theme: 'Traffic Congestion',
        summary:
          'Traffic congestion is a major problem in the city. It is causing delays and frustration for residents.',
        analysis:
          'Traffic congestion is a major problem in the city. It is causing delays and frustration for residents. We need to do something about it.',
        quotes: [
          {
            quote: "I hate traffic. It's so frustrating.",
            phone_number: '+15555555555',
          },
          {
            quote: "I'm always late for work because of traffic.",
            phone_number: '+15555555556',
          },
        ],
      },
    ],
  })

  await eventually(
    {
      that: 'the poll goes from expanding -> completed',
      minTimeout: 500,
      maxTimeout: 5000,
    },
    async () => {
      const res = await client.get(`/v1/polls/${pollId}`)

      expect(res.status).toBe(200)
      expect(res.data).toMatchObject({
        status: 'completed',
        name: 'Top Community Issues',
        completedDate: expect.any(String),
        audienceSize: expect.any(Number),
        responseCount: 100,
        lowConfidence: false,
        scheduledDate: with11AmLocalTime(expansionSendDate).toISOString(),
        estimatedCompletionDate: with11AmLocalTime(
          expansionCompletionDate,
        ).toISOString(),
      })
      expect(res.data.audienceSize).toBeGreaterThan(500)
    },
  )

  // Confirm the UI is updated according to the results.
  await page.reload()
  await expect(page.getByText('Poll Confidence: High')).toBeVisible()
  await expect(page.getByText('Top Themes')).toBeVisible()

  for (const issue of expansionIssues.data.issues) {
    await expect(page.getByText(issue.theme, { exact: true })).toBeVisible()
    await expect(page.getByText(issue.summary)).toBeVisible()
  }

  // Confirm that the removed issue is no longer visible.
  await expect(page.getByText('Crime')).toHaveCount(0)
})
