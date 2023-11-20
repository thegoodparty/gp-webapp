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
const noDistrictOffices = [
  'US Senate',
  'Governor',
  'Lieutenant Governor',
  'Attorney General',
  'Comptroller',
  'Treasurer',
  'Secretary of State',
  'State Supreme Court Justice',
];

export const calcLocation = ({ office, state, district, city }) => {
  const isFederal = federalOffices.includes(office);
  const noDistrict = noDistrictOffices.includes(office);
  let str = '';
  if (isFederal) {
    return `${district ? `${district}, ` : ''} ${state}`;
  }
  if (noDistrict) {
    return `${city ? `${city},` : ''} ${state}`;
  }
  if (!district && city) {
    return `${city}, ${state}`;
  }
  if (!district) {
    return `${state}`;
  }
  return `${city ? `District ${district}, ${city}` : district}, ${state}`;
};

export default function ProfileSection(props) {
  const { candidate, editMode } = props;

  const {
    firstName,
    lastName,
    slogan,
    party,
    office,
    otherOffice,
    state,
    district,
    city,
  } = candidate;

  const resolvedOffice = office === 'Other' ? otherOffice : office;

  let fields;
  const isFederal = federalOffices.includes(office);
  if (isFederal) {
    fields = [
      { label: 'Running For', value: resolvedOffice },
      {
        label: 'Location',
        value: calcLocation({ office, state, district, city }),
        // value: `${district ? `${district}, ` : ''} ${state}`,
      },
      { label: 'Affiliation', value: partyResolver(party) },
    ];
  } else {
    fields = [
      {
        label: 'Location',
        // value: `${district ? `${district}, ` : ''} ${state}`,
        value: calcLocation({ office, state, district, city }),
      },
      { label: 'Running For', value: resolvedOffice },
      { label: 'Affiliation', value: partyResolver(party) },
    ];
  }
  return (
    <section className="flex flex-col items-center mt-5  pt-5">
      <AvatarWithTracker {...props} priority />

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
