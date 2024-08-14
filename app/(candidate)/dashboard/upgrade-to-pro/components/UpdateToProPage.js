import DashboardLayout from '../../shared/DashboardLayout';
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/details/components/issues/CandidatePositionsProvider';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { MdOutlineArrowForward } from 'react-icons/md';
import { ProPricingCard } from 'app/(candidate)/dashboard/upgrade-to-pro/components/ProPricingCard';
import Link from 'next/link';

const CARD_FREE = {
  backgroundClass: 'lime-400',
  title: 'Free',
  features: [
    'AI Campaign Content',
    'Campaign progress tracker',
    'Path to Victory report',
    'Consultation with a campaign manager',
    'Discord community',
    'Good Party Academy',
  ],
  price: 0,
};

const CARD_PRO = {
  backgroundClass: 'primary',
  title: 'Pro',
  subTitle: 'Everything in free plus…',
  features: [
    'Voter data and records',
    'Dedicated support',
    'Peer-to-peer texting',
  ],
  price: 10,
};

export default function DetailsPage(props) {
  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="bg-gray-50 rounded-xl p-4 md:p-16">
          <H1 className="text-center mb-9">
            Upgrade to Pro for just $10 a month!
          </H1>
          <Body2 className="text-center mb-9">
            Being GoodParty.org Certified gives you access to a host of freemium
            tools. However, in order to ensure compliance with local, state and
            federal campaign finance laws, access to Pro tools requires payment.
            <br />
            <br />
            We aim to make serving the community as an elected official
            affordable and accessible to all. All payments made to GoodParty.org
            is reinvested into making it possible for more people across the
            country to run, win and serve.
          </Body2>
          <Link href="/dashboard/pro-sign-up">
            <PrimaryButton className="flex items-center justify-center mx-auto mb-16 w-full md:w-auto">
              <span>Join Pro Today</span>
              <MdOutlineArrowForward className="text-2xl ml-2" />
            </PrimaryButton>
          </Link>
          <div className="grid md:grid-cols-2 md:gap-4 md:px-24">
            <ProPricingCard {...CARD_FREE} />
            <ProPricingCard {...CARD_PRO} />
          </div>
        </div>
      </CandidatePositionsProvider>
    </DashboardLayout>
  );
}
