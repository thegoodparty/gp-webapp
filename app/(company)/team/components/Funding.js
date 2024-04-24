import Image from 'next/image';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';

const Funding = () => (
  <section className="font-medium">
    <Image
      className="object-cover h-[361px] w-full rounded-b-full mb-4"
      src="/images/landing-pages/team-hero.png"
      alt="Team Hero"
      width={607}
      height={456}
      priority
    />
    <div className="px-4 py-8">
      <h3 className="text-4xl leading-tight mb-4">
        The funding behind Good Party
      </h3>
      <p className="text-xl mb-8 text-gray-600 mb-8">
        Good Party is a Public Benefit Company receiving its seed funding from
        our founder, Farhad Mohit, a serial entrepreneur and full-time volunteer
        for the movement. We’re neither affiliated with nor funded by any
        outside political party, special interest group, Super PAC, non-profit,
        NGO, or advocacy group.
      </p>
      <Link href="/about">
        <SecondaryButton className="bg-tertiary-main hover:bg-tertiary-dark border-none text-tertiary-contrast">Learn about our mission</SecondaryButton>
      </Link>
    </div>
  </section>
);

export default Funding;
