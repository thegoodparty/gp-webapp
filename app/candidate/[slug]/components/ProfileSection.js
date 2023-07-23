import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import { partyResolver } from 'helpers/candidateHelper';
import EditProfile from './EditProfile';
import EditProfileButton from './EditProfileButton';
import AvatarWithTracker from './AvatarWithTracker';
import CandidatePill from './CandidatePill';
import { Fragment } from 'react';

const federalOffices = ['US Senate', 'US House of Representatives'];

const calcLocation = ({ office, state, district }) => {
  const isFederal = federalOffices.includes(office);
  if (isFederal) {
    return `${office}, ${state}, ${district}`;
  }
  return `${district}, ${state}, ${office}`;
};

export default function ProfileSection(props) {
  const { candidate, color, editMode, campaign } = props;

  const { firstName, lastName, slogan, party, office, state, district } =
    candidate;

  let fields;
  const isFederal = federalOffices.includes(office);
  if (isFederal) {
    fields = [
      { label: 'Running For', value: office },
      {
        label: 'Location',
        value: `${district ? `${district}, ` : ''} ${state}`,
      },
      { label: 'Affiliation', value: partyResolver(party) },
    ];
  } else {
    fields = [
      {
        label: 'Location',
        value: `${district ? `${district}, ` : ''} ${state}`,
      },
      { label: 'Running For', value: office },
      { label: 'Affiliation', value: partyResolver(party) },
    ];
  }
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
          <div className="border-slate-500 border rounded-xl w-full flex flex-col mt-6 py-5 px-10">
            {fields.map((field) => (
              <Fragment key={field.label}>
                <Body2 className="text-indigo-50 ">{field.label}</Body2>
                <H3 className="mt-1 mb-4">{field.value}</H3>
              </Fragment>
            ))}
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
