import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import { IoMdCheckmark } from 'react-icons/io';
import MarketingH3 from '@shared/typography/MarketingH3';
import MarketingH4 from '@shared/typography/MarketingH4';
import Body1 from '@shared/typography/Body1';
import Button from '@shared/buttons/Button';

const points1 = [
  'AI Campaign Content',
  'Campaign progress tracker',
  'Path to Victory report',
  'Consultation with a campaign managing',
  'Discord community',
  'GoodParty.org Academy',
];

const points2 = [
  'Voter data and records',
  'Dedicated support',
  'Peer-to-peer texting and calling platform',
];

function PricingCard({ heading, subheading, price, points, color }) {
  const bgColor = color === 'lime' ? 'bg-lime-400' : 'bg-white';
  const bulletColor =
    color === 'lime'
      ? 'bg-primary-main text-white'
      : 'bg-lime-400 border-black/[0.12]';

  return (
    <div className={`flex flex-col p-6 md:p-12 rounded-md ${bgColor}`}>
      <MarketingH4 className="pb-3 mb-6 border-b border-black/60">
        {heading}
      </MarketingH4>
      {subheading && <Body1 className="mb-2">{subheading}</Body1>}
      <ul className="grow p-0 m-0 list-inside list-none font-normal font-sfpro">
        {points.map((point) => (
          <li key={point} className="flex gap-3 mb-2">
            <span>
              <IoMdCheckmark
                className={`p-[2px] rounded-full border ${bulletColor}`}
                size={14}
              />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-14 mb-8 text-4xl font-medium">${price}/month</div>
      <Link id="free-candidtate" href="/sign-up">
        <Button className="w-full">Get Started</Button>
      </Link>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing-section">
      <hgroup className="text-white text-center mb-8">
        <MarketingH3 className="mb-4 !text-4xl md:!text-5xl">
          Affordable and accessible
        </MarketingH3>
        <Body1>
          Get free access to our core tools by agreeing to serve as an
          anti-corruption, independent, and people-powered representative for
          your community plus premium features for a small monthly fee.
        </Body1>
      </hgroup>

      <div class="flex-col md:flex-row flex justify-center mx-auto gap-4">
        <PricingCard heading="Free" points={points1} price={0} />
        <PricingCard
          heading="Pro"
          subheading="Everything in free plus…"
          points={points2}
          price={10}
          color="lime"
        />
      </div>
    </section>
  );
}
