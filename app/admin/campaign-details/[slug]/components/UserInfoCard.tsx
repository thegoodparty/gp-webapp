import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { getUserFullName } from '@shared/utils/getUserFullName'
import { User } from 'helpers/types'

interface UserInfoCardProps {
  user?: User | null
}

export default function UserInfoCard({
  user,
}: UserInfoCardProps): React.JSX.Element {
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
        </div>
      )}
      {user === null && (
        <Body2 className="mt-2 text-red-500">User not found</Body2>
      )}
      {user === undefined && <Body2 className="mt-2">Loading User...</Body2>}
    </Paper>
  )
}
