import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import ImageUploader from 'app/candidate-old/[slug]/components/ImageUploader';
import { partyResolver } from 'helpers/candidateHelper';
import VictoryTracker from './VictoryTracker';

export default function ProfileSection(props) {
  const { candidate, color, editMode, campaign, district } = props;
  console.log('candidate', candidate);

  const { firstName, lastName, slogan, party, office, state } = candidate;
  return (
    <section className="flex flex-col items-center mt-5">
      <div className="relative">
        <div>
          <VictoryTracker {...props} />
        </div>
        <div className="absolute top-4 left-9 ">
          <CandidateAvatar candidate={candidate} priority />
          {editMode ? <ImageUploader campaign={campaign} /> : null}
        </div>
      </div>
      <H1 className="font-semibold">
        {firstName} {lastName}
      </H1>
      <div className="border-slate-500 border rounded-xl pt-2 pb-6 w-full flex flex-col items-center mt-6">
        <Body2 className="text-indigo-50 ">Running for</Body2>
        <H3 className="mt-2 mb-5">{office}</H3>
        <div className="flex items-center justify-center">
          <div className=" relative py-1 px-3 rounded-full mr-2">
            <div
              className="absolute w-full h-full rounded-full top-0 left-0 opacity-10"
              style={{ backgroundColor: color }}
            />
            <div className="relative" style={{ color }}>
              {partyResolver(party)}
            </div>
          </div>

          <div className="relative py-1 px-3 rounded-full mr-2">
            <div
              className="absolute w-full h-full rounded-full top-0 left-0 opacity-10"
              style={{ backgroundColor: color }}
            />
            <div className="relative" style={{ color }}>
              {district ? `${district}, ` : ''}
              {state}
            </div>
          </div>
        </div>
      </div>
      <Body2 className="mt-6 text-center">
        <div dangerouslySetInnerHTML={{ __html: slogan }} />
      </Body2>
    </section>
  );
}
