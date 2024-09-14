import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import UserAvatar from '@shared/user/UserAvatar';
import { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MapContext } from './MapSection';

export default function CampaignSnippet({ campaign }) {
  const {
    firstName,
    lastName,
    avatar,
    didWin,
    office,
    state,
    ballotLevel,
    zip,
  } = campaign;

  const { onSelectCampaign, selectedCampaign } = useContext(MapContext);
  return (
    <div className=" m-2">
      <div
        className={`flex px-3 py-4  rounded shadow-sm hover:shadow-lg transition-shadow cursor-pointer ${
          selectedCampaign?.slug === campaign.slug ? 'bg-blue-100' : 'bg-white'
        }`}
        onClick={() => {
          onSelectCampaign(campaign);
        }}
      >
        <div className="mt-1">
          {avatar ? (
            <UserAvatar user={campaign} size="smaller" />
          ) : (
            <FaUserCircle size={24} />
          )}
        </div>
        <div className="flex-1 pl-3">
          <H3>
            {firstName} {lastName}
          </H3>
          <Body2 className="mt-2 text-gray-600">
            Running for {office}, {state}
          </Body2>
        </div>
      </div>
    </div>
  );
}
