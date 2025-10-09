'use client'

import { LuScrollText } from 'react-icons/lu'
import { usePoll } from '../hooks/PollProvider'
import H3 from '@shared/typography/H3'
import Image from 'next/image'
import Body2 from '@shared/typography/Body2'

export default function PollMessage() {
  const [poll] = usePoll()
  const { messageContent, imageUrl } = poll
  return (
    <div className="w-full max-w-[600px] bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex gap-2 items-center mb-4">
        <LuScrollText />
        <H3>Message</H3>
      </div>
      {imageUrl && (
        <div className="flex justify-center mb-4">
          <Image
            src={imageUrl}
            alt="Poll Image"
            width={600}
            height={400}
            className="object-cover max-h-[300px] md:max-h-[400px]"
          />
        </div>
      )}
      <Body2>{messageContent}</Body2>
    </div>
  )
}
