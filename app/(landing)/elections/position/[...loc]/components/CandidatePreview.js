import H3 from '@shared/typography/H3'
import Overline from '@shared/typography/Overline'
import Image from 'next/image'
import { IoPersonSharp } from 'react-icons/io5'

export default function CandidatePreview({ candidate }) {
  const { firstName, lastName, image, party } = candidate
  return (
    <div>
      <div className="bg-primary-dark p-6 rounded-2xl border border-gray-700 text-white">
        <div className="flex justify-between mb-4">
          {image ? (
            <div className="bg-primary inline-block border border-white rounded-2xl relative w-28 h-28">
              <Image
                src={image}
                fill
                alt={`${firstName} ${lastName}`}
                priority
                unoptimized
                className="rounded-2xl object-cover object-center"
              />
            </div>
          ) : (
            <div className="bg-primary inline-block border border-white rounded-2xl p-4">
              <IoPersonSharp size={72} />
            </div>
          )}
        </div>
        <H3>
          {firstName} {lastName}
        </H3>
        <Overline className="mt-1"> {party}</Overline>
      </div>
    </div>
  )
}
