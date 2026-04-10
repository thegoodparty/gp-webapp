'use client'

import { useClerk, UserProfile } from '@clerk/nextjs'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import { useEffect } from 'react'

export default function AccountProfilePage(): React.JSX.Element {
  const clerk = useClerk()
  let removeListener: () => void

  useEffect(() => {
    removeListener = clerk.addListener((event) => {
      console.log('event', event)
    })
    return () => {
      removeListener()
    }
  }, [])

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
                cardBox: 'w-full! h-full!border-none! shadow-none!',
                navbar: 'hidden',
              },
            },
          }}
        />
      </div>
    </DashboardLayout>
  )
}
