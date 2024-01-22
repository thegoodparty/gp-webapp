import Subtitle2 from '@shared/typography/Subtitle2';
import Race from './Race';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';

export default function RacesSection({ races }) {
  return (
    <section>
      <div className="grid-cols-12 gap-3 hidden md:grid mb-2 px-5">
        <div className="col-span-12 md:col-span-9">
          <Subtitle2 className="">Position</Subtitle2>
        </div>
        <div className="col-span-12 md:col-span-2 text-center">
          <Subtitle2>Election date</Subtitle2>
        </div>
        {/* <div className="col-span-6 md:col-span-2">Candidates filed</div> */}
        <div className="col-span-12 md:col-span-1">&nbsp;</div>
      </div>
      {races.map((race) => (
        <div
          key={race.hash}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <Race race={race} />
        </div>
      ))}
      <div className="mt-6 flex justify-center">
        <Link href="?viewAll=true" id="view-all">
          <PrimaryButton> View all</PrimaryButton>
        </Link>
      </div>
    </section>
  );
}
