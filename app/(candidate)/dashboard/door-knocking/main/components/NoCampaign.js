'use client';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import Image from 'next/image';
import Paper from '../../../../../shared/utils/Paper';
import AddCampaign from './AddCampaign';

export default function NoCampaign() {
  return (
    <div className="p-4">
      <H1>Route Dashboard</H1>
      <Paper className=" mt-6 md:py-12 md:px-6 flex flex-col items-center">
        <Image
          src="/images/door-knocking/marker-clouds.svg"
          alt="Marker"
          width={250}
          height={200}
          priority
        />
        <H2 className="mt-2">Welcome to your route dashboard.</H2>
        <Body1 className="mt-2">
          It looks like you don&apos;t have a door knocking campaign set up yet.
        </Body1>
        <div className="mt-6">
          <AddCampaign buttonLabel="Get Started" />
        </div>
      </Paper>
    </div>
  );
}
