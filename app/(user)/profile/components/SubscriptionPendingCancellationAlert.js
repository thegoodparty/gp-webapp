'use client'
import { InfoAlert } from '@shared/alerts/InfoAlert'
import Body2 from '@shared/typography/Body2'
import { dateUSClientLocaleHelper } from 'helpers/dateHelper'

export const SubscriptionPendingCancellationAlert = ({
  subscriptionCancelAt,
}) => (
  <InfoAlert className="mb-4" variant="outlined" severity="info">
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        <Body2 className="">
          Your subscription will end on{' '}
          <strong>{dateUSClientLocaleHelper(subscriptionCancelAt)}</strong>
        </Body2>
      </div>
    </div>
  </InfoAlert>
)
