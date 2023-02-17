import Link from 'next/link';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function Page() {
  return (
    <MaxWidth>
      <h1 className="text-5xl font-black mt-20 mb-10" data-cy="about-title">
        What is Good Party?
      </h1>
      <div className="text-xl" data-cy="about-description">
        Good Party is <strong>not a political party</strong>. We’re building
        tools to change the rules and a movement of people to disrupt the
        corrupt!
        <br />
        <br />
        Our work has two parts: One is building free, open-source tools to{' '}
        <strong>connect voters looking for a better alternative</strong> to the
        two-party system{' '}
        <strong>
          with Independent, People-powered, Anti-corruption candidates
        </strong>
        . The other is mobilizing a movement of digital natives - who will be
        the majority of voters by 2024 - to believe they can seize the memes of
        production and <strong>change politics for good!</strong>
        <br />
        <br />
        As we grow, we will show that independent, grassroots candidates from
        across the political spectrum have{' '}
        <strong>a real chance of running and winning elections</strong>, for the
        first time in modern history!{' '}
        <Link href="/register" className="underline">
          Join Us
        </Link>
      </div>
      <h2 className="text-5xl font-black mt-24 mb-16">Who is Good Party?</h2>
      <div className="text-xl">
        Good Party is a group of concerned citizens, independent-minded
        activists and technologists who believe that our democracy is in peril
        and we need to do all that we can to save it. We are self-funded,
        putting our own time and money to this important cause, and stay
        independent of any political parties or associations.{' '}
        <Link href="/team">Meet our team here</Link>.
      </div>
      <h2 className="text-5xl font-black mt-24 mb-16">Why Good Party?</h2>
      <div className="text-xl mb-10">
        Our democracy has been <strong>corrupted by a two-party system</strong>{' '}
        that serves moneyed interests. It leaves people apathetic, or having to
        choose between the lesser of two evils, neither of which truly serve
        them. So, important issues continue to go unaddressed.
        <br />
        <br />
        Whether you’re concerned about the climate, privacy, inequality, or our
        individual freedoms, all are{' '}
        <strong>
          hampered by the dark doom-loop of dysfunctional partisan politics.
        </strong>
        <br />
        <br />
        It&apos;s no wonder that a majority of eligible voters (over 130M
        Americans), including more than half of Millennials and Gen Z, say that{' '}
        <strong>neither Republicans, nor Democrats represent them</strong>. It’s
        time to declare independence from the corrupt two-party system.
      </div>
    </MaxWidth>
  );
}
