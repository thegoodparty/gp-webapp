'use client'

import { UserProfile } from '@clerk/nextjs'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import DeleteAccountPage from './DeleteAccountPage'
import { MdDeleteForever } from 'react-icons/md'

const AccountProfilePage = (): React.JSX.Element => (
  <DashboardLayout pathname="/dashboard/account">
    <div className="-m-2 md:-m-4 h-full">
      <UserProfile
        routing="hash"
        appearance={{
          variables: {
            borderRadius: 'none',
            colorBackground: '#f5f5f5',
          },
          elements: {
            rootBox: 'w-full! h-full! border-none! max-w-full!',
            cardBox: 'w-full! h-full! border-none! shadow-none! max-w-full!',
            navbar: 'hidden',
          },
        }}
      >
        <UserProfile.Page
          label="Delete Account"
          url="delete-account"
          labelIcon={<MdDeleteForever />}
        >
          <DeleteAccountPage />
        </UserProfile.Page>
      </UserProfile>
    </div>
  </DashboardLayout>
)

export default AccountProfilePage
