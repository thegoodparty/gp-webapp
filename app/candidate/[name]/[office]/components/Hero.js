'use client'

import MaxWidth from '@shared/layouts/MaxWidth'
import { usePublicCandidate } from './PublicCandidateProvider'
import UnclaimedBanner from './UnclaimedBanner'
import CandidateImage from './CandidateImage'
import Image from 'next/image'

export default function Hero() {
  const [candidate] = usePublicCandidate()
  const { firstName, lastName, positionName, claimed } = candidate

  return (
    <div className="bg-[linear-gradient(82deg,_#0B1529_65.55%,_#26498F_139.02%)] p-6 w-full text-white">
      <MaxWidth>
        <UnclaimedBanner className="mb-4 lg:mb-12" />
        <div className="lg:flex lg:mt-12">
          <div className="mb-4 lg:w-[400px] flex-shrink-0 lg:mr-4 pt-12 md:pt-0 flex lg:justify-center lg:items-center">
            <CandidateImage />
          </div>
          <div className="w-full ">
            <h1 className="mb-2 font-medium text-4xl lg:text-6xl">
              {firstName} {lastName}
            </h1>
            <h2 className="text-2xl lg:text-3xl font-medium ">
              {positionName}
            </h2>
            {claimed && (
              <div className="flex items-center gap-2 mt-4">
                <Image
                  src="/images/logo/heart.svg"
                  alt="Empowered"
                  width={28}
                  height={24}
                  priority
                />
                <h3 className="text-xl font-medium">
                  Empowered by GoodParty.org
                </h3>
              </div>
            )}
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
