import Image from 'next/image';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';

const Funding = () => (
  <section className="font-medium">
    <Image
      className="object-cover
          h-[361px]
          w-full
          rounded-b-full
          mb-4
          lg:w-[610px]
          lg:h-[460px]
          lg:rounded-bl-none
          lg:rounded-tr-full
          lg:mt-24"
      src="/images/landing-pages/team-hero.png"
      alt="Team Hero"
      width={607}
      height={456}
      priority
    />
    <div className="px-4 py-8 lg:p-24 lg:max-w-[812px]">
      <h3 className="text-4xl leading-tight mb-4 lg:text-6xl">
        The funding behind GoodParty.org
      </h3>
      <p className="text-xl mb-8 text-gray-600 mb-8 lg:text-2xl  font-medium">
        GoodParty.org is a Public Benefit Company receiving its seed funding
        from our founder, Farhad Mohit, a serial entrepreneur and full-time
        volunteer for the movement. We’re neither affiliated with nor funded by
        any outside political party, special interest group, Super PAC,
        non-profit, NGO, or advocacy group.
      </p>
      <Link href="/about">
        <SecondaryButton
          className="bg-tertiary-main
            hover:bg-tertiary-dark
            border-none
            text-tertiary-contrast
            w-full
            lg:w-auto"
        >
          Learn about our mission
        </SecondaryButton>
      </Link>
    </div>
  </section>
);

export default Funding;
