import React from 'react';
import Image from 'next/image';
import { candidateColor } from '/helpers/candidateHelper';

export default function CandidateAvatar({ candidate, priority = false }) {
  const { firstName, lastName, image, isClaimed } = candidate;
  const brightColor = candidateColor(candidate);

  return (
    <div className="relative bg-white">
      <div
        className="relative h-32 w-32 lg:h-60 lg:w-60 border-solid border-4 rounded-full"
        style={{ borderColor: brightColor }}
      >
        {image && (
          <Image
            src={image}
            fill
            alt={`${firstName} ${lastName}`}
            data-cy="candidate-img"
            style={{ borderColor: brightColor }}
            priority={priority}
            className="object-cover object-top rounded-full"
          />
        )}
        {isClaimed && (
          <div
            className="absolute bottom-0 left-0 w-full h-full rounded-full p-1 text-xs font-black text-white flex flex-col items-center justify-end lg:p-3 lg:text-sm"
            style={{
              background: `linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.8) 0%,
                rgba(255, 255, 255, 0) 40%,
                rgba(255, 255, 255, 0) 100%
              )`,
            }}
          >
            <div className="text-center">GOOD CERTIFIED</div>
            <Image
              src="/images/heart.svg"
              width={26}
              height={20}
              alt="GP"
              className="mt-3 inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );
}
