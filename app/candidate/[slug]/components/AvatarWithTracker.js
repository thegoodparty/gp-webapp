import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import VictoryTracker from './VictoryTracker';
import dynamic from 'next/dynamic';
const ImageUploader = dynamic(() =>
  import('app/candidate/[slug]/components/ImageUploader'),
);

export default function AvatarWithTracker(props) {
  const { candidate, editMode } = props;
  return (
    <div className="relative">
      <div>
        <VictoryTracker {...props} />
      </div>
      <div className="absolute top-3 left-8 z-20">
        <div className={editMode ? 'opacity-60' : ''}>
          <CandidateAvatar candidate={candidate} priority />
        </div>
        {editMode ? <ImageUploader {...props} /> : null}
      </div>
    </div>
  );
}
