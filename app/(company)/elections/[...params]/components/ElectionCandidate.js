import Link from 'next/link';
import { candidateRoute } from 'helpers/candidateHelper';
import { colors } from 'app/candidate/[slug]/components/CandidateColors';
import AvatarWithTracker from 'app/candidate/[slug]/components/AvatarWithTracker';
import WarningButton from '@shared/buttons/WarningButton';
import { FaChevronRight } from 'react-icons/fa';
import CandidatePill from 'app/candidate/[slug]/components/CandidatePill';

export default function ElectionCandidate({ candidate }) {
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
  } = candidate;

  const resolvedOffice = office === 'Other' ? otherOffice : office;

  let pillText = resolvedOffice;
  if (district && district !== '') {
    pillText += `, ${district}`;
  } else if (state && state !== '') {
    pillText += `, ${state}`;
  }

  return (
    <Link href={candidateRoute(candidate)} className="no-underline h-full">
      <div className=" no-underline md:px-2  h-full">
        <div className="flex flex-col items-center text-slate-50 px-5 bg-indigo-700 rounded-2xl pt-10 pb-5 transition-colors hover:bg-indigo-600 h-full">
          <AvatarWithTracker
            candidate={candidate}
            color={color ?? colors[0]}
            candidateUrl={candidateRoute(candidate)}
          />

          <span className=" text-slate-50 text-2xl p-3 text-center">
            {firstName} {lastName}
          </span>

          <CandidatePill
            text={pillText}
            color={color ?? colors[0]}
            className="mt-3"
          />

          <div className="font-sfpro  font-normal  text-center mb-4">
            <div className="pt-2 text-base italic">&apos;{slogan}&apos;</div>
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
        </div>
      </div>
    </Link>
  );
}
