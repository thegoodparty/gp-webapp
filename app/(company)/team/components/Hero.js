import Link from 'next/link';

export default function Hero() {
  return (
    <section className="mt-16">
      <div className="grid grid-cols1 lg:grid-cols-2 gap-10">
        <div>
          <h1
            className="font-black text-3xl lg:text-4xl lg:pr-10"
            data-cy="team-hero-section-title"
          >
            Working on creating a Good Party for all!
            <br />
            <br />
            Meet the team.
          </h1>
        </div>
        <div
          className="text-xl font-bold mb-44"
          data-cy="team-hero-section-content"
        >
          Good Party&apos;s core team are the people working full-time,
          part-time, or as dedicated volunteers on a mission to make people
          matter more than money in our democracy.
          <br />
          <br />
          If you agree that a functioning democracy that serves people, not
          money, is the problem that must be solved, in order to solve our other
          problems, please consider{' '}
          <Link href="/work-with-us" data-cy="team-hero-section-join-link">
            <u>joining us!</u>
          </Link>
        </div>
      </div>
    </section>
  );
}
