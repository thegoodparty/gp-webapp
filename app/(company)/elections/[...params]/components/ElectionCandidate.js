import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';
import Link from 'next/link';
import { candidateRoute } from 'helpers/candidateHelper';
import { colors } from '/app/candidate/[slug]/components/CandidateColors';
import AvatarWithTracker from 'app/candidate/[slug]/components/AvatarWithTracker';

export default function ElectionCandidate({ candidate }) {
  const {
    firstName,
    lastName,
    color,
    office,
    district,
    state,
    topPosition,
    slogan,
    occupation,
  } = candidate;

  return (
    <div className="flex flex-col items-center text-slate-50">
      <AvatarWithTracker
        candidate={candidate}
        color={color ?? colors[0]}
        candidateUrl={candidateRoute(candidate)}
      />

      <Link href={candidateRoute(candidate)}>
        <span className=" text-slate-50 text-2xl p-3">
          {firstName} {lastName}
        </span>
      </Link>

      <CandidatePill
        text={`${office}, ${district ?? state}`}
        color={color ?? colors[0]}
        className="mt-3"
      />

      <div className="font-sfpro text-base font-normal  text-center">
        <div className="pt-2 text-lg italic">&apos;{slogan}&apos;</div>
        <div className="flex justify-center w-full">
          <div className="w-10 border-b-2 border-slate-50 my-4"></div>
        </div>

        <div className="line-clamp-3">{topPosition}</div>
        <div className="pt-4 font-bold">{occupation}</div>
      </div>
    </div>
  );
}
