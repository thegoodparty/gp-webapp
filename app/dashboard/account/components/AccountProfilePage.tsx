'use client'

import { UserProfile } from '@clerk/nextjs'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'

const AccountProfilePage = (): React.JSX.Element => (
  <DashboardLayout pathname="/dashboard/account">
    <div className="-m-2 md:-m-4 h-full">
      <UserProfile
        {...{
          routing: 'hash',
          appearance: {
            variables: {
              borderRadius: 'none',
              colorBackground: '#f5f5f5',
            },
            elements: {
              rootBox: 'w-full! h-full! border-none! max-w-full!',
              cardBox: 'w-full! h-full! border-none! shadow-none! max-w-full!',
              navbar: 'hidden',
            },
          },
        }}
      />
    </div>
  </DashboardLayout>
)

export default AccountProfilePage
