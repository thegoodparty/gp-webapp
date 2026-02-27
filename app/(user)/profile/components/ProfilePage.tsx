import NotificationSection from 'app/(user)/profile/components/NotificationSection'
import PasswordSection from './PasswordSection'
import PersonalSection from './PersonalSection'
import { AccountSettingsSection } from 'app/(user)/profile/components/AccountSettingsSection'
import TextingCompliance from 'app/(user)/profile/texting-compliance/components/TextingCompliance'
import { User, Website, TcrCompliance } from 'helpers/types'

interface ProfilePageProps {
  user: User
  isPro?: boolean
  subscriptionCancelAt?: number | null
  website?: Website | null
  domainStatus?: string | null
  tcrCompliance?: TcrCompliance | null
}

export default function ProfilePage(
  props: ProfilePageProps,
): React.JSX.Element {
  const { user, isPro, website, domainStatus, tcrCompliance } = props
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 py-4 xl:p-0 xl:pt-4">
        <PersonalSection user={user} />
        <AccountSettingsSection />
        {isPro && (
          <TextingCompliance
            {...{
              website,
              domainStatus,
              tcrCompliance,
            }}
          />
        )}
        <NotificationSection />
        <PasswordSection user={user} />
      </div>
    </div>
  )
}
