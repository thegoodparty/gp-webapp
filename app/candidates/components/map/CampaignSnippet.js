import H3 from '@shared/typography/H3'
import { memo, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import Subtitle2 from '@shared/typography/Subtitle2'
import Image from 'next/image'

export default memo(function CampaignSnippet({
  campaign,
  onSelectCampaign,
  selectedCampaign,
}) {
  const {
    firstName,
    lastName,
    avatar,
    office,
    state,
    didWin,
    data: { hubSpotUpdates } = {},
  } = campaign
  const [imageError, setImageError] = useState(false) // State to track image load errors

  function handleKeyPress(e, campaign) {
    if (e.key == 'Enter') {
      onSelectCampaign(campaign)
    }
  }

  const electionResults = hubSpotUpdates?.election_results
    ? /won/i.test(hubSpotUpdates?.election_results)
    : didWin

  const electionStatus =
    typeof electionResults === 'boolean' && electionResults
      ? 'Elected'
      : 'Running'

  return (
    <div className="mx-4 my-2">
      <div
        role="button"
        tabIndex="0"
        className={`flex p-3 rounded-xl hover:bg-info-background border border-gray-200 cursor-pointer ${
          selectedCampaign?.slug === campaign.slug
            ? 'bg-info-background'
            : 'bg-white'
        }`}
        onClick={() => {
          onSelectCampaign(campaign)
        }}
        onKeyDown={(e) => handleKeyPress(e, campaign)}
      >
        <div className="">
          {!imageError && avatar ? (
            <Image
              src={avatar}
              className="h-12 w-12 rounded-2xl"
              unoptimized
              width={48}
              height={48}
              alt={`${firstName?.charAt(0) || ''} ${lastName?.charAt(0) || ''}`}
              onError={() => setImageError(true)} // Set error state when image fails to load
            />
          ) : (
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gray-200 border border-gray-300">
              <FaUserCircle size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 pl-3">
          <H3>
            {firstName} {lastName}
          </H3>

          <Subtitle2 className=" text-gray-600">
            {electionStatus} for {office}, {state}
          </Subtitle2>
        </div>
      </div>
    </div>
  )
})
