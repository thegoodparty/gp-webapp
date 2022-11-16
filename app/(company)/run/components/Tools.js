import BlackButton from '@shared/buttons/BlackButton';
import Link from 'next/link';

const points = [
  {
    title: 'Viability',
    description:
      "Show supporters that it's possible to win and your campaign is not a wasted vote.",
  },
  {
    title: 'Insights',
    description:
      'Actionable insights about how to grow awareness for your campaign.',
  },
  {
    title: 'People',
    description:
      'Online and grassroots influencers, organizers, and volunteers to help your campaign win.',
  },
];

export default function Tools() {
  return (
    <section className="text-center">
      <h2
        className="mb-12 text-4xl my-3 font-black"
        data-cy="becoming-good-certified"
      >
        Good Party Free Tools Provide:
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {points.map((point) => (
          <div key={point.title}>
            <div className="text-xl font-black mb-4">{point.title}</div>
            {point.description}
          </div>
        ))}
      </div>
      <div className="mt-14">
        <h3 className="text-2xl">
          Best of all, it's totally
          <div className="text-3xl mt-2 mb-6 font-black">
            transparent and free.
          </div>
        </h3>
      </div>
      <Link
        href="/campaign-application/guest/1"
        data-cy="campaign-start-button-link"
      >
        <BlackButton>
          <div data-cy="campaign-start-button-label" className="font-black">
            START YOUR CAMPAIGN
          </div>
        </BlackButton>
      </Link>
    </section>
  );
}
