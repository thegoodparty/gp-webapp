import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import img from 'public/images/landing-pages/discord.png'
import user1 from 'public/images/landing-pages/discord-user1.png'
import user2 from 'public/images/landing-pages/discord-user2.png'
import user3 from 'public/images/landing-pages/discord-user3.png'
import user4 from 'public/images/landing-pages/discord-user4.png'
import user5 from 'public/images/landing-pages/discord-user5.png'
import H2 from '@shared/typography/H2'
import WarningButton from '@shared/buttons/WarningButton'

export default function DiscordSection() {
  return (
    <section className="bg-primary-dark pt-12 text-white">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-semibold font-outfit text-7xl md:text-8xl ">
              Join our
              <br />
              Discord.
            </h2>
            <H2 className="mt-10 mb-3">The community for independents</H2>
            <div className="text-lg">
              We&apos;re organizing people tired of toxic two-party politics to
              take action and fix our broken system. Join for conversation,
              inspiring updates, and opportunities to support campaigns.
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Image alt="Ads 2023" src={img} className="w-full object-contain" />
          </div>
        </div>
        <div className="flex">
          <Image alt="" src={user1} width={64} height={64} className="mr-2" />
          <Image alt="" src={user2} width={64} height={64} className="mr-2" />
          <Image alt="" src={user3} width={64} height={64} className="mr-2" />
          <Image alt="" src={user4} width={64} height={64} className="mr-2" />
          <Image alt="" src={user5} width={64} height={64} className="" />
        </div>
        <a
          href="https://community.goodparty.org"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-12 inline-block"
          id="ads23-join-discord"
        >
          <WarningButton>Join our GoodParty.org Community</WarningButton>
        </a>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#DFF265_55%)] h-[calc(100vw*0.09)] w-full" />
    </section>
  )
}
