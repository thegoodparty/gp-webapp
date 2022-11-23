import VoteDate from './VoteDate';

export default function DateBox({ candidate, showPast }) {
  if (!candidate) {
    return <></>;
  }

  const { certifiedDate, ballotDate, earlyVotingDate, raceDate, isClaimed } =
    candidate;

  return (
    <div
      className="mx-3 px-6 pb-6 bg-zinc-100"
      style={
        showPast
          ? { borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }
          : { borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }
      }
    >
      {isClaimed && (
        <VoteDate
          title="Good Certified"
          date={certifiedDate}
          showPast={showPast}
        />
      )}
      <VoteDate
        title="Made it On the Ballot"
        date={ballotDate}
        showPast={showPast}
      />
      <VoteDate
        title="Early Voting Begins"
        date={earlyVotingDate}
        showPast={showPast}
      />
      <VoteDate title="Election Night" date={raceDate} showPast={showPast} />
    </div>
  );
}
