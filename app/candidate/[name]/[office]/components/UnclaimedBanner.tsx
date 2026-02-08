'use client'

import H4 from '@shared/typography/H4'
import { usePublicCandidate } from './PublicCandidateProvider'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { useUser } from '@shared/hooks/useUser'

interface UnclaimedBannerProps {
  className?: string
}

export default function UnclaimedBanner({ className }: UnclaimedBannerProps): React.JSX.Element | null {
  const [candidate] = usePublicCandidate()
  const [user] = useUser()
  const { claimed } = candidate || {}

  if (claimed || user) return null

  return (
    <div
      className={`bg-white text-black py-6 px-8 rounded-xl flex flex-col md:flex-row justify-between items-center ${className}`}
    >
      <div>
        <H4>This profile is unclaimed</H4>
        <Body2>Enhance your profile by signing up.</Body2>
      </div>

      <div className="mt-4 md:mt-0">
        <Button
          href="/sign-up"
          variant="outlined"
          className="bg-yellow-600 text-black border-black hover:[&:not([disabled])]:bg-yellow-500"
          style={{ borderRadius: '100px' }}
        >
          Join Today
        </Button>
      </div>
    </div>
  )
}
