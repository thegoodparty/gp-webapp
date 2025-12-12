'use client'

import { usePublicCandidate } from './PublicCandidateProvider'
import Image from 'next/image'
import { IoPersonSharp } from 'react-icons/io5'
import ClaimedHeart from './ClaimedHeart'

export default function CandidateImage(): React.JSX.Element {
  const [candidate] = usePublicCandidate()
  const { firstName, lastName, image } = candidate || {}

  return (
    <div className="lg:-mb-40">
      {image ? (
        <div className="bg-indigo-400 inline-block border-2 lg:border-4 border-white rounded-full relative w-40 h-40 lg:w-60 lg:h-60">
          <Image
            src={image}
            fill
            alt={`${firstName} ${lastName}`}
            priority
            unoptimized
            className="rounded-full w-40 h-40 lg:w-60 lg:h-60 object-cover object-center"
          />
          <ClaimedHeart />
        </div>
      ) : (
        <div className="bg-indigo-400  border-2 lg:border-4 border-white rounded-full p-4 w-40 h-40 lg:w-60 lg:h-60 flex items-center justify-center text-7xl lg:text-9xl relative">
          <IoPersonSharp />
          <ClaimedHeart />
        </div>
      )}
    </div>
  )
}
