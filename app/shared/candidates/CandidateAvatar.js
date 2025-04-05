import React from 'react'
import Image from 'next/image'
import { RxPerson } from 'react-icons/rx'

export default function CandidateAvatar({ candidate, priority = false }) {
  const { firstName, lastName, image } = candidate
  // const brightColor = candidateColor(candidate);

  return (
    <div className="relative ">
      <div className="relative h-44 w-44 rounded-full bg-zinc-300 text-white flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            fill
            alt={`${firstName} ${lastName}`}
            data-cy="candidate-img"
            // style={{ borderColor: brightColor }}
            priority={priority}
            className="object-cover object-top rounded-full"
          />
        ) : (
          <RxPerson className="text-5xl lg:text-9xl" />
        )}
      </div>
    </div>
  )
}
