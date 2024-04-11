import MaxWidth from '@shared/layouts/MaxWidth';
import ElectionCard from './ElectionCard';

// import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';

const cards = [
  {
    id: '1',
    title: 'What makes a candidate Good Party Certified?',
    bgColor: 'bg-secondary-light',
    content: (
      <>
        We&apos;re <strong>not a political party</strong>, but are seeking to
        replace the corrupt and ineffective two-party system with{' '}
        <strong>people-powered, independent candidates</strong>. Candidates earn
        the Good Party Certified label when they take our pledge, in which
        candidates agree to not run as Republicans or Democrats, raise a
        majority of their funding from real people instead of corporate
        lobbyists, and propose real solutions in the interest of their
        communities, not hate or partisanship.
        <br />
        <br />
        We believe candidates who check these boxes put all levels of government
        on track by rejecting dark money influences and{' '}
        <strong>putting power back in the hands of the people.</strong>
      </>
    ),
  },
  {
    id: '2',
    title: 'Why North Carolina?',
    bgColor: 'bg-lime-600',
    content: (
      <>
        Good Party is focused on helping candidates in North Carolina because it
        is{' '}
        <strong>
          one of the most independent states in the country. 36% of voters in
          the state identify with neither major political party, and 46% of
          those voters are under the age of 40
        </strong>
        . This means that the fastest-growing voting population of the state is
        young voters without representation! It also makes North Carolina an
        important proving ground for our movement to elect new options other
        than Red and Blue.
      </>
    ),
  },
];

export default function ElectionCards(props) {
  return (
    <div className="bg-indigo-200 py-16">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-7 md:items-stretch">
          {cards.map((card) => (
            <div
              className={`col-span-12 md:col-span-6 md:h-full rounded-2xl ${card.bgColor}`}
              key={card.id}
            >
              <ElectionCard {...card} />
            </div>
          ))}
        </div>
      </MaxWidth>
    </div>
  );
}
