'use client'
import { InfoAlert } from '@shared/alerts/InfoAlert'
import Body2 from '@shared/typography/Body2'
import { dateUSClientLocaleHelper } from 'helpers/dateHelper'

interface SubscriptionPendingCancellationAlertProps {
  subscriptionCancelAt: string
}

export const SubscriptionPendingCancellationAlert = ({
  subscriptionCancelAt,
}: SubscriptionPendingCancellationAlertProps): React.JSX.Element => (
  <InfoAlert className="mb-4" variant="outlined">
    <div className="flex flex-col flex-grow lg:justify-between lg:flex-row">
      <div className="p-2 mr-2 lg:max-w-[73%]">
        <Body2 className="">
          Your subscription will end on{' '}
          <strong>{dateUSClientLocaleHelper(new Date(subscriptionCancelAt).getTime())}</strong>
        </Body2>
      </div>
    </div>
  </InfoAlert>
)
