import MaxWidth from '@shared/layouts/MaxWidth';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import RaceCard from './RaceCard';

export default function BallotRaces({ races }) {
  return (
    <section className="my-12 text-center">
      <MaxWidth>
        <H2 className="mb-6">Available Races in your zip code</H2>
        <div className="grid grid-cols-12 gap-6">
          {races.map((race) => (
            <RaceCard key={race.node?.election?.id} race={race} />
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
