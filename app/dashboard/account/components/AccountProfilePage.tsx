'use client'

import { UserProfile } from '@clerk/nextjs'

export default function AccountProfilePage(): React.JSX.Element {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <div className="max-w-screen-md mx-auto px-4 py-4 xl:p-0 xl:pt-4">
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-none',
              navbar: 'hidden',
              pageScrollBox: 'p-0',
            },
          }}
        />
      </div>
    </div>
  )
}
