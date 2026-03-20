import NotificationSection from 'app/dashboard/profile/components/NotificationSection'
import ContactInfoSection from './ContactInfoSection'
import { AccountSettingsSection } from 'app/dashboard/profile/components/AccountSettingsSection'
import TextingCompliance from 'app/dashboard/profile/texting-compliance/components/TextingCompliance'
import { User, Website, TcrCompliance, Campaign } from 'helpers/types'

interface ProfilePageProps {
  user: User
  campaign: Campaign | null
  isPro?: boolean
  subscriptionCancelAt?: number | null
  website?: Website | null
  domainStatus?: string | null
  tcrCompliance?: TcrCompliance | null
}

export default function ProfilePage({
  user,
  campaign,
  isPro,
  website,
  domainStatus,
  tcrCompliance,
}: ProfilePageProps): React.JSX.Element {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 py-4 xl:p-0 xl:pt-4">
        <ContactInfoSection user={user} />
        {!!campaign && <AccountSettingsSection />}
        {!!campaign && isPro && (
          <TextingCompliance
            {...{
              website,
              domainStatus,
              tcrCompliance,
            }}
          />
        )}
        {!!campaign && <NotificationSection />}
      </div>
    </div>
  )
}
