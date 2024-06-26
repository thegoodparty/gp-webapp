import Link from 'next/link';
import { candidateRoute } from 'helpers/candidateHelper';
import { colors } from './CandidateColors';
import AvatarWithTracker from './AvatarWithTracker';
import WarningButton from '@shared/buttons/WarningButton';
import { FaChevronRight } from 'react-icons/fa';
import CandidatePill from './CandidatePill';

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

export default function ElectionCandidate({
  candidate,
  shortVersion = false,
  priority = true,
}) {
  const {
    firstName,
    lastName,
    color,
    office,
    otherOffice,
    district,
    state,
    topPosition,
    slogan,
    occupation,
    city,
  } = candidate;

  const resolvedOffice = office === 'Other' ? otherOffice : office;
  const loc = calcLocation({ office, state, district, city });

  let pillText = `${resolvedOffice}, ${loc}`; // herer

  return (
    <Link href={candidateRoute(candidate)} className="no-underline h-full">
      <div className=" no-underline md:px-2  h-full">
        <div
          className={`flex flex-col items-center text-slate-50 px-5 bg-primary-dark-dark rounded-2xl pt-10  transition-colors hover:bg-indigo-600 h-full ${
            shortVersion ? 'pb-10' : 'pb-5'
          }`}
        >
          <AvatarWithTracker
            candidate={candidate}
            color={color ?? colors[0]}
            candidateUrl={candidateRoute(candidate)}
            reportedVoterGoals={candidate.reportedVoterGoals}
            priority={priority}
          />

          <span className=" text-slate-50 text-2xl p-3 text-center">
            {firstName} {lastName}
          </span>

          <CandidatePill
            text={pillText}
            color={color ?? colors[0]}
            className="mt-3"
          />
          {!shortVersion && (
            <>
              <div className="font-sfpro  font-normal  text-center mb-4">
                <div
                  className="pt-2 text-base italic"
                  dangerouslySetInnerHTML={{ __html: slogan }}
                />

                <div className="flex justify-center w-full">
                  <div className="w-10 border-b-2 border-slate-50 my-4"></div>
                </div>

                <div className="line-clamp-3 text-sm">{topPosition}</div>
                <div className="pt-4 font-bold  text-sm">{occupation}</div>
              </div>
              <WarningButton variant="text" size="medium">
                <div className="flex items-center justify-center">
                  <div className="mr-2">Learn More</div>
                  <FaChevronRight />
                </div>
              </WarningButton>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
