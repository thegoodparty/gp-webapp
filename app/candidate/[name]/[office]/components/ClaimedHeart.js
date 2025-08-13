'use client'

import Image from 'next/image'
import { usePublicCandidate } from './PublicCandidateProvider'

export default function ClaimedHeart() {
  const [candidate] = usePublicCandidate()
  const { claimed } = candidate

  return (
    <>
      {claimed && (
        <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2  rounded-full w-8 h-8 lg:w-12 lg:h-12">
          <Image
            src="/images/logo/heart.svg"
            alt="GoodParty.org candidate"
            fill
            priority
          />
        </div>
      )}
    </>
  )
}
