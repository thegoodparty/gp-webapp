import Body1 from '@shared/typography/Body1'
import H4 from '@shared/typography/H4'
import Image from 'next/image'
import { useState } from 'react'
import { IoPersonSharp } from 'react-icons/io5'

interface Campaign {
  firstName?: string
  lastName?: string
  office: string
  state: string
  avatar?: string
}

interface WinnerSnippetProps {
  campaign: Campaign
}

export default function WinnerSnippet({ campaign }: WinnerSnippetProps): React.JSX.Element {
  const { firstName, lastName, office, state, avatar } = campaign
  const [imageError, setImageError] = useState(false)
  return (
    <div className="border border-slate-300 rounded-2xl p-6 flex">
      {!imageError && avatar ? (
        <Image
          src={avatar}
          className="h-12 w-12 rounded-2xl"
          unoptimized
          width={48}
          height={48}
          alt={`${firstName?.charAt(0) || ''} ${lastName?.charAt(0) || ''}`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center text-2xl text-slate-600">
          <IoPersonSharp />
        </div>
      )}
      <div className="ml-4">
        <H4>
          {firstName} {lastName}
        </H4>
        <Body1 className="text-gray-600">
          Winner of {office}, {state}
        </Body1>
      </div>
    </div>
  )
}
