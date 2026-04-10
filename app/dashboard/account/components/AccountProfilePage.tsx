'use client'

import { UserProfile } from '@clerk/nextjs'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'

export default function AccountProfilePage(): React.JSX.Element {
  return (
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
                rootBox: 'w-full! h-full! border-none!',
                cardBox: 'w-full! h-full! border-none! shadow-none!',
                navbar: 'hidden',
              },
            },
          }}
        />
      </div>
    </DashboardLayout>
  )
}
