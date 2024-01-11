import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import ElectionCandidate from 'app/(company)/elections/[...params]/components/ElectionCandidate';
import { calcLocation } from 'app/candidate/[slug]/components/ProfileSection';

export default function Invitation(props) {
  const { invitation } = props;
  const {
    firstName,
    lastName,
    office,
    otherOffice,
    district,
    state,

    occupation,
    city,
  } = invitation?.campaign || {};

  const resolvedOffice = office === 'Other' ? otherOffice : office;
  const loc = calcLocation({ office, state, district, city });
  return (
    <div className="my-6 bg-slate-100 px-3 py-2 rounded-lg">
      <H4>
        {firstName} {lastName}
      </H4>
      <Body1>
        Running for {resolvedOffice} in {loc}
        <br />
        <br />
        Occupation: {occupation}
      </Body1>
    </div>
  );
}
