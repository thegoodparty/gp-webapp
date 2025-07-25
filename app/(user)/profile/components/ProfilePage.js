import NotificationSection from 'app/(user)/profile/components/NotificationSection'
import PasswordSection from './PasswordSection'
import PersonalSection from './PersonalSection'
import { AccountSettingsSection } from 'app/(user)/profile/components/AccountSettingsSection'
import TextingCompliance from 'app/(user)/profile/texting-compliance/components/TextingCompliance'
import { userIsAdmin } from 'helpers/userHelper'

export default function ProfilePage(props) {
  // TODO: Rip this out once this feature is ready to go live
  const { user, isPro, website, domainStatus, tcrCompliance } = props
  const isAdmin = userIsAdmin(user)
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 py-4 xl:p-0 xl:pt-4">
        <PersonalSection {...props} />
        <AccountSettingsSection {...props} />
        {isAdmin && isPro && (
          <TextingCompliance
            {...{
              website,
              domainStatus,
              tcrCompliance,
            }}
          />
        )}
        <NotificationSection />
        <PasswordSection {...props} />
      </div>
    </div>
  )
}
