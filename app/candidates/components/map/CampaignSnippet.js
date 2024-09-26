import H3 from '@shared/typography/H3';
import { useContext, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MapContext } from './MapSection';
import Subtitle2 from '@shared/typography/Subtitle2';
import Image from 'next/image';

export default function CampaignSnippet({ campaign }) {
  const { firstName, lastName, avatar, office, state } = campaign;

  const { onSelectCampaign, selectedCampaign } = useContext(MapContext);
  const [imageError, setImageError] = useState(false); // State to track image load errors

  return (
    <div className="mx-4 my-2">
      <div
        className={`flex p-3  rounded-xl hover:bg-info-background border border-gray-200 cursor-pointer ${
          selectedCampaign?.slug === campaign.slug
            ? 'bg-info-background'
            : 'bg-white'
        }`}
        onClick={() => {
          onSelectCampaign(campaign);
        }}
      >
        <div className="">
          {!imageError && avatar ? (
            <Image
              src={avatar}
              className="h-12 w-12 rounded-2xl"
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
            Running for {office}, {state}
          </Subtitle2>
        </div>
      </div>
    </div>
  );
}
