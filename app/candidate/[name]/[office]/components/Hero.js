'use client'

import MaxWidth from '@shared/layouts/MaxWidth'
import { usePublicCandidate } from './PublicCandidateProvider'
import UnclaimedBanner from './UnclaimedBanner'
import CandidateImage from './CandidatImage'

export default function Hero() {
  const { candidate } = usePublicCandidate()
  const { firstName, lastName, positionName } = candidate

  return (
    <div className="bg-[linear-gradient(82deg,_#0B1529_65.55%,_#26498F_139.02%)] p-6 w-full text-white">
      <MaxWidth>
        <UnclaimedBanner />
        <div className="lg:flex">
          <div className="mb-4 lg:w-[500px] lg:mr-4 pt-12 md:pt-0 flex lg:justify-center lg:items-center">
            <CandidateImage />
          </div>
          <div className="w-full ">
            <h1 className="mb-2 font-medium text-4xl md:text-6xl">
              {firstName} {lastName}
            </h1>
            <h2 className="text-2xl lg:text-3xl font-medium ">
              {positionName}
            </h2>
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
