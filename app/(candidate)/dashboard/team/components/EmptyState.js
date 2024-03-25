import Paper from '@shared/utils/Paper';
import Image from 'next/image';
import waveImg from 'public/images/dashboard/wave.png';
import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import InviteButton from './InviteButton';

export default function EmptyState(props) {
  const { reloadInvitationsCallback } = props;

  return (
    <Paper>
      <div className="py-12 lg:py-28 flex flex-col items-center">
        <Image src={waveImg} alt="wave" width={80} height={80} />
        <H3 className="mt-8 text-center mb-2">
          Teamwork makes the dream work.
        </H3>
        <Body1 className="mb-8">
          Add staff and volunteers to your campaign.
        </Body1>
        <InviteButton reloadInvitationsCallback={reloadInvitationsCallback} />
      </div>
    </Paper>
  );
}
