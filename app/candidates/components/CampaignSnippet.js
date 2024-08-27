import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import UserAvatar from '@shared/user/UserAvatar';
import { FaUserCircle } from 'react-icons/fa';

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
  return (
    <div className="px-3 py-4 border-b border-gray-300 flex">
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
  );
}
