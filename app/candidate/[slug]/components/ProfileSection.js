import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import { partyResolver } from 'helpers/candidateHelper';
import EditProfile from './EditProfile';
import EditProfileButton from './EditProfileButton';
import AvatarWithTracker from './AvatarWithTracker';
import CandidatePill from './CandidatePill';

export default function ProfileSection(props) {
  const { candidate, color, editMode, campaign } = props;

  const { firstName, lastName, slogan, party, office, state, district } =
    candidate;
  return (
    <section className="flex flex-col items-center mt-5  pt-5">
      <AvatarWithTracker {...props} />

      {editMode ? (
        <EditProfile {...props} />
      ) : (
        <>
          <H1 className="font-semibold">
            {firstName} {lastName}
          </H1>
          <div className="border-slate-500 border rounded-xl pt-2 pb-6 w-full flex flex-col items-center mt-6">
            <Body2 className="text-indigo-50 ">Running for</Body2>
            <H3 className="mt-2 mb-5">{office}</H3>
            <div className="flex items-center justify-center">
              <div className="mr-2">
                <CandidatePill text={partyResolver(party)} color={color} />
              </div>
              <CandidatePill
                text={`${district ? `${district}, ` : ''} ${{ state }}`}
                color={color}
              />
              <div className="mr-2">
                <CandidatePill
                  text={`${district ? `${district}, ` : ''} ${{ state }}`}
                  color={color}
                />
              </div>
            </div>
          </div>
          {slogan ? (
            <Body2 className="mt-6 text-center mb-8">
              <div dangerouslySetInnerHTML={{ __html: slogan }} />
            </Body2>
          ) : null}
          <EditProfileButton {...props} />
        </>
      )}
    </section>
  );
}
