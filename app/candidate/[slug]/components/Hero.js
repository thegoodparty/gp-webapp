import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import GetInvolvedButton from './GetInvolvedButton';

export default function Hero(props) {
  const { candidate } = props;
  const { color } = candidate;

  const { firstName, lastName, party, office, state } = candidate;

  return (
    <div className="bg-violet-600 text-white rounded-2xl px-7 py-8 ">
      <div className="flex">
        <CandidateAvatar candidate={candidate} />
        <div className="flex-1 pl-6 lg:pl-12 flex flex-col justify-between">
          <div className="hidden lg:block text-right">
            <GetInvolvedButton />
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black">
              {firstName} <div className="lg:hidden"></div>
              {lastName}
            </div>
            <div className="mt-3">
              {party}
              <div className="lg:hidden"></div>
              <div className="hidden lg:inline-block px-3">&middot;</div>
              {office}
              <div className="lg:hidden"></div>
              <div className="hidden lg:inline-block px-3">&middot;</div>
              {state}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden  text-center mt-10">
        <GetInvolvedButton />
      </div>
    </div>
  );
}
