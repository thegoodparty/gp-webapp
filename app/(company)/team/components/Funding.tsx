import Image from 'next/image'
import Link from 'next/link'
import SecondaryButton from '@shared/buttons/SecondaryButton'

export default function Funding(): React.JSX.Element {
  return (
    <section className="font-medium">
      <div className="md:grid md:grid-cols-4 lg:grid-cols-2 lg:gap-6">
        <Image
          className="object-cover
            object-top
            h-[215px]
            w-full
            rounded-[32px]
            mb-4
            mt-8
            md:col-span-3
            md:h-auto
            md:object-cover
            md:max-h-[454px]
            md:mt-24
            lg:col-span-1"
          src="/images/landing-pages/team-hero.png"
          alt="Team Hero"
          width={607}
          height={456}
          priority
        />
        <div
          className="
          py-8
          md:col-span-3
          lg:py-24
          lg:max-w-[812px]
          lg:col-span-1"
        >
          <h3
            className="text-4xl
            leading-tight
            mb-4
            md:text-6xl
            md:leading-snug"
          >
            The funding behind GoodParty.org
          </h3>
          <p className="text-xl mb-8 text-gray-600 mb-8 lg:text-2xl  font-medium">
            GoodParty.org is a Public Benefit Company receiving its seed funding
            from our founder, Farhad Mohit, a serial entrepreneur and full-time
            volunteer for the movement. We&apos;re neither affiliated with nor funded
            by any outside political party, special interest group, Super PAC,
            non-profit, NGO, or advocacy group.
          </p>
          <Link href="/about">
            <SecondaryButton
              className="bg-tertiary-main
              hover:bg-tertiary-dark
              border-none
              text-tertiary-contrast
              w-full
              md:w-auto"
            >
              Learn about our mission
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
