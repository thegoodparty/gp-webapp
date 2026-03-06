import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { getUserFullName } from '@shared/utils/getUserFullName'
import { User } from 'helpers/types'

const HUBSPOT_PORTAL_ID = '21589597'

interface UserInfoCardProps {
  user?: User | null
}

export default function UserInfoCard({
  user,
}: UserInfoCardProps): React.JSX.Element {
  const hubspotId = user?.metaData?.hubspotId

  return (
    <Paper>
      <H2>User Information</H2>
      {user && (
        <div className="mt-4 space-y-2">
          <Body2>
            <span className="font-semibold">ID:</span> {user.id}
          </Body2>
          <Body2>
            <span className="font-semibold">Name:</span> {getUserFullName(user)}
          </Body2>
          <Body2>
            <span className="font-semibold">Email:</span> {user.email}
          </Body2>
          <Body2>
            <span className="font-semibold">HubSpot ID:</span>{' '}
            {hubspotId ? (
              <a
                href={`https://app.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/record/0-1/${hubspotId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                {hubspotId}
              </a>
            ) : (
              'N/A'
            )}
          </Body2>
          <Body2>
            <span className="font-semibold">Amplitude:</span>{' '}
            <a
              href={`https://app.amplitude.com/analytics/goodparty/users?property=amplitude_id&search=${user.id}&searchType=search`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              View in Amplitude
            </a>
          </Body2>
        </div>
      )}
      {user === null && (
        <Body2 className="mt-2 text-red-500">User not found</Body2>
      )}
      {user === undefined && <Body2 className="mt-2">Loading User...</Body2>}
    </Paper>
  )
}
