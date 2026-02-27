import React from 'react'
import { it } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import ExpandPollPage from './ExpandPollPage'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import { PollProvider } from '../../../shared/hooks/PollProvider'
import { Poll } from '../../../shared/poll-types'

const poll: Partial<Poll> = {
  id: '1234',
  audienceSize: 500,
  responseCount: 50,
  lowConfidence: true,
}

it('shows the audience selection form', async () => {
  api.mock('GET /v1/contacts/stats', {
    status: 200,
    data: {
      districtId: '1234',
      totalConstituents: 30000,
      totalConstituentsWithCellPhone: 9000,
      computedAt: new Date().toISOString(),
      buckets: {} as any,
    },
  })

  render(
    <PollProvider poll={poll as any}>
      <ExpandPollPage scheduledDate={undefined} count={undefined} />
    </PollProvider>,
  )

  await screen.findByText('Recommended')

  await screen.findByText('2,125 constituents (25%)')
  await screen.findByText('4,250 constituents (50%)')
  await screen.findByText('6,375 constituents (75%)')
  await screen.findByText('8,500 constituents (100%)')

  fireEvent.click(await screen.findByText('330 constituents (4%)'))

  fireEvent.click(await screen.findByText('Pick Send Date'))

  await screen.findByText('When would you like to send your text messages?')
})
