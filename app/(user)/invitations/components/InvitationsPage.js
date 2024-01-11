import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import ElectionCandidate from 'app/(company)/elections/[...params]/components/ElectionCandidate';
import Invitation from './Invitation';

export default function InvitationsPage(props) {
  const { invitations } = props;
  return (
    <div className="bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto bg-gray-50 py-5 px-6 rounded-xl">
        <div className="pb-6 border-b border-slate-300">
          <div>
            <H3>Join the movement: Your Invitation Awaits!</H3>
          </div>
        </div>
        <Body1 className="mt-6">
          Welcome to the heart of political change! Here, you can view
          invitations from candidates who believe in your potential to make a
          difference. Your skills and enthusiasm are in high demand. Take a
          moment to review the invitations and decide how you&apos;d like to
          contribute to shaping the future.
        </Body1>
        {(!invitations || invitations.length === 0) && (
          <H3 className="mt-12">No invitations available at the moment.</H3>
        )}
        {invitations && invitations.length > 0 && (
          <>
            {invitations.map((invitation) => (
              <div key={invitation.id}>
                <Invitation invitation={invitation} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
