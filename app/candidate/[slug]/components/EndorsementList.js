import H4 from '@shared/typography/H4';
import Endorsement from './Endorsement';

export default function EndorsementList(props) {
  const { candidate, campaign, isStaged } = props;
  let endorsements;
  if (isStaged && campaign) {
    endorsements = campaign.endorsements || [];
  } else {
    endorsements = candidate.endorsements || [];
  }
  return (
    <div>
      {endorsements.length === 0 ? (
        <H4 className="text-indigo-50">No endorsements available.</H4>
      ) : (
        <div>
          {endorsements.map((endorsement, index) => (
            <Endorsement
              endorsement={endorsement}
              key={endorsement.name}
              index={index}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  );
}
