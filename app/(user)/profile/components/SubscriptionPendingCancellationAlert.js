'use client'
import { InfoAlert } from '@shared/alerts/InfoAlert'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import { dateUSClientLocaleHelper } from 'helpers/dateHelper'

export const SubscriptionPendingCancellationAlert = ({
  subscriptionCancelAt,
}) => (
  <InfoAlert className="mb-4" variant="outlined" severity="info">
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        <H4 className="mb-2">Cancellation Received</H4>
        <Body2 className="">
          You still have access to pro features until{' '}
          <strong>{dateUSClientLocaleHelper(subscriptionCancelAt)}</strong>
        </Body2>
      </div>
    </div>
  </InfoAlert>
)
