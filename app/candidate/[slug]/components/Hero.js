import CandidateAvatar from '@shared/candidates/CandidateAvatar';

export default function Hero(props) {
  const { candidate } = props;
  const { color } = candidate;

  const { firstName, lastName } = candidate;

  return (
    <div className="bg-violet-600 text-white rounded-2xl px-7 py-8 ">
      <div className="flex">
        <CandidateAvatar candidate={candidate} />
        <div className="flex-1 pl-3 lg:pl-12 flex flex-col justify-between">
          <div className="hidden lg:block">A</div>
          <div>
            <div className="text-4xl font-black">
              {firstName} {lastName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
