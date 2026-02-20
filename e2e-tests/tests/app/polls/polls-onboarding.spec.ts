import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { SQS } from '@aws-sdk/client-sqs'
import { expect, type Page, test } from '@playwright/test'
import type { MessageElement } from '@slack/web-api/dist/types/response/ConversationsHistoryResponse'
import { parse as parseCSV } from 'csv-parse/sync'
import { addBusinessDays, format, subDays } from 'date-fns'
import { NavigationHelper } from 'src/helpers/navigation.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { eventually } from 'tests/utils/eventually'
import { downloadSlackFile, waitForSlackMessage } from 'tests/utils/slack'

type CsvRow = {
  id: string
  firstName: string
  lastName: string
  cellPhone: string
}

type PollResponseJsonRow = {
  atomicId: string
  phoneNumber: string
  receivedAt: string
  originalMessage: string
  atomicMessage: string
  pollId: string
  clusterId: number | string
  theme: string
  category: string
  summary: string
  sentiment: string
  isOptOut: boolean
}

const normalizePhoneNumber = (phoneNumber: string): string => {
  let cleaned = phoneNumber
    .replaceAll('+1', '')
    .replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = cleaned.slice(1)
  }
  if (cleaned.length !== 10) {
    throw new Error(`Phone number ${phoneNumber} could not be normalized`)
  }
  return `+1${cleaned}`
}

const buildPollResponseJson = (params: {
  pollId: string
  csvRows: CsvRow[]
  issues: {
    rank: number
    theme: string
    summary: string
    responseCount: number
  }[]
  totalResponses: number
}): PollResponseJsonRow[] => {
  const { pollId, csvRows, issues, totalResponses } = params

  // Deduplicate phones and convert to 1XXXXXXXXXX format (no +) for JSON
  const uniquePhones = Array.from(
    new Set(csvRows.map((row) => normalizePhoneNumber(row.cellPhone))),
  )
  const phonesForJson = uniquePhones.map((p) => p.replace('+', ''))

  const rows: PollResponseJsonRow[] = []
  let phoneIndex = 0
  const now = new Date()

  // Allocate phones to issues based on responseCount
  for (const issue of issues) {
    for (
      let i = 0;
      i < issue.responseCount && phoneIndex < phonesForJson.length;
      i++
    ) {
      rows.push({
        atomicId: crypto.randomUUID(),
        phoneNumber: phonesForJson[phoneIndex]!,
        receivedAt: new Date(now.getTime() + phoneIndex * 1000).toISOString(),
        originalMessage: `Response about ${issue.theme}`,
        atomicMessage: `Response about ${issue.theme}`,
        pollId,
        clusterId: issue.rank,
        theme: issue.theme,
        category: 'General',
        summary: issue.summary,
        sentiment: 'negative',
        isOptOut: false,
      })
      phoneIndex++
    }
  }

  // Remaining phones become opt-outs
  const issueTotalPhones = issues.reduce((sum, i) => sum + i.responseCount, 0)
  const optOutCount = Math.max(0, totalResponses - issueTotalPhones)

  for (let i = 0; i < optOutCount && phoneIndex < phonesForJson.length; i++) {
    rows.push({
      atomicId: crypto.randomUUID(),
      phoneNumber: phonesForJson[phoneIndex]!,
      receivedAt: new Date(now.getTime() + phoneIndex * 1000).toISOString(),
      originalMessage: 'STOP',
      atomicMessage: 'STOP',
      pollId,
      clusterId: '',
      theme: 'Opt Out Request',
      category: '',
      summary: '',
      sentiment: '',
      isOptOut: true,
    })
    phoneIndex++
  }

  return rows
}

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

const getBucketNameFromSlackMessage = (text: string) => {
  const match = text.match(/serve-analyze-data-[a-z]+/)
  if (!match) {
    throw new Error('No S3 bucket name found in slack message')
  }
  return match[0]
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
  const bucketName = getBucketNameFromSlackMessage(slackMessage.text || '')

  return { pollId, csvRows, queueName, bucketName }
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
  bucketName: string
  csvRows: CsvRow[]
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
  const s3 = new S3Client({ region: 'us-west-2' })

  const { QueueUrl } = await sqs.getQueueUrl({
    QueueName: params.queueName,
  })

  // Build response JSON with real phone numbers from CSV
  const responseRows = buildPollResponseJson({
    pollId: params.pollId,
    csvRows: params.csvRows,
    issues: params.issues.map((issue) => ({
      rank: issue.rank,
      theme: issue.theme,
      summary: issue.summary,
      responseCount: issue.responseCount,
    })),
    totalResponses: params.totalResponses,
  })

  // Upload JSON to S3
  const responsesLocation = `e2e-test/${params.pollId}/${crypto.randomUUID()}.json`
  await s3.send(
    new PutObjectCommand({
      Bucket: params.bucketName,
      Key: responsesLocation,
      Body: JSON.stringify(responseRows),
      ContentType: 'application/json',
    }),
  )

  // Map quote phone_numbers to real phones from their respective clusters
  const issuesWithRealPhones = params.issues.map((issue) => {
    const clusterPhones = responseRows
      .filter((r) => r.clusterId === issue.rank && !r.isOptOut)
      .map((r) => `+${r.phoneNumber}`)

    return {
      pollId: params.pollId,
      ...issue,
      quotes: issue.quotes.map((quote, idx) => ({
        quote: quote.quote,
        phone_number:
          clusterPhones[idx % clusterPhones.length] || quote.phone_number,
      })),
    }
  })

  const queueEvent = {
    type: 'pollAnalysisComplete',
    data: {
      pollId: params.pollId,
      totalResponses: params.totalResponses,
      responsesLocation,
      issues: issuesWithRealPhones,
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

  const {
    pollId,
    csvRows,
    queueName,
    bucketName,
  } = await waitForPollSlackData(
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

  const queueToUse =
    process.env.E2E_SQS_QUEUE_NAME !== undefined &&
    process.env.E2E_SQS_QUEUE_NAME !== ''
      ? process.env.E2E_SQS_QUEUE_NAME
      : queueName

  const bucketToUse = process.env.SERVE_ANALYZE_S3_BUCKET || bucketName

  const queuedEvent = await completePoll({
    queueName: queueToUse,
    pollId,
    totalResponses: 45,
    bucketName: bucketToUse,
    csvRows: csvRows as CsvRow[],
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
            phone_number: '',
          },
          {
            quote: "I'm always late for work because of traffic.",
            phone_number: '',
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
            phone_number: '',
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

  const stripeIframe = page
    .locator('iframe[title="Secure payment input frame"]')
    .first()
  await expect(stripeIframe).toBeVisible({ timeout: 30_000 })

  const stripeFrame = page
    .frameLocator('iframe[title="Secure payment input frame"]')
    .first()

  // Target Stripe inputs directly by their stable IDs
  const cardInput = stripeFrame.locator('#payment-numberInput')
  const expiryInput = stripeFrame.locator('#payment-expiryInput')
  const cvcInput = stripeFrame.locator('#payment-cvcInput')
  const zipInput = stripeFrame.locator('#payment-postalCodeInput')

  await expect(cardInput).toBeVisible({ timeout: 30_000 })
  await expect(cardInput).toBeEditable({ timeout: 30_000 })
  await page.waitForTimeout(2_000)

  await cardInput.fill('4242424242424242')
  await page.waitForTimeout(500)
  await expiryInput.fill('0135')
  await page.waitForTimeout(500)
  await cvcInput.fill('123')
  await page.waitForTimeout(500)
  await zipInput.fill('82001')
  await page.waitForTimeout(500)

  // Uncheck "Save my information for faster checkout" (Stripe Link) —
  // when checked, it requires a phone number which blocks canConfirm.
  const saveCheckbox = stripeFrame.getByLabel(
    'Save my information for faster checkout',
  )
  if (await saveCheckbox.isChecked().catch(() => false)) {
    await saveCheckbox.uncheck()
  }
  await page.waitForTimeout(1_000)

  const purchaseButton = page.getByRole('button', {
    name: 'Complete Purchase',
  })

  const completeCheckoutResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/payments/purchase/complete-checkout-session') &&
      response.request().method() === 'POST',
    { timeout: 45_000 },
  )

  await expect(purchaseButton).toBeEnabled({ timeout: 30_000 })
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
  // Combine original and expansion CSV rows since all have ELECTED_OFFICIAL records
  const allCsvRows = [
    ...(csvRows as CsvRow[]),
    ...(expansionCsvRows as CsvRow[]),
  ]

  const expansionIssues = await completePoll({
    queueName: queueToUse,
    pollId,
    totalResponses: 100,
    bucketName: bucketToUse,
    csvRows: allCsvRows,
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
            phone_number: '',
          },
          {
            quote: "I'm always late for work because of traffic.",
            phone_number: '',
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
