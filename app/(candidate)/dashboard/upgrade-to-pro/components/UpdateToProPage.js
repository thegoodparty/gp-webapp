'use client';
import DashboardLayout from '../../shared/DashboardLayout';
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { MdOutlineArrowForward } from 'react-icons/md';
import { ProPricingCard } from 'app/(candidate)/dashboard/upgrade-to-pro/components/ProPricingCard';
import Link from 'next/link';
import { useUser } from '@shared/hooks/useUser';
import AlertDialog from '@shared/utils/AlertDialog';
import { useState } from 'react';
import { handleDemoAccountDeletion } from '@shared/utils/handleDemoAccountDeletion';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'helpers/useSnackbar';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

const CARD_FREE = {
  backgroundClass: 'lime-400',
  title: 'Free',
  features: [
    'AI Campaign Content',
    'Campaign progress tracker',
    'Path to Victory report',
    'Consultation with a campaign managing',
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
  const [user] = useUser();
  const router = useRouter();
  const { metaData: userMetaData } = user || {};
  const { demoPersona } = userMetaData || {};
  const [showDialog, setShowDialog] = useState(false);
  const { errorSnackbar } = useSnackbar();

  const handleLinkOnClick = (e) => {
    if (demoPersona) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const handleJoinProOnClick = () => {
    if (demoPersona) {
      setShowDialog(true);
    }
    trackEvent(EVENTS.ProUpgrade.VoterData.ClickUpgrade);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="max-w-[940px] mx-auto bg-gray-50 rounded-xl p-4 md:p-16">
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
          <Link
            onClick={handleLinkOnClick}
            href={demoPersona ? '#' : '/dashboard/pro-sign-up'}
          >
            <PrimaryButton
              onClick={handleJoinProOnClick}
              className="flex items-center justify-center mx-auto mb-16 w-full md:w-auto"
            >
              <span>Join Pro Today</span>
              <MdOutlineArrowForward className="text-2xl ml-2" />
            </PrimaryButton>
            <AlertDialog
              open={showDialog}
              handleProceed={handleDialogClose}
              handleClose={handleDialogClose}
              title="End Demo & Upgrade?"
              ariaLabel="End Demo & Upgrade"
              description={
                <>
                  You are currently on a demo account.
                  <br />
                  To upgrade, you must first create a candidate account.
                </>
              }
              onCancel={handleDemoAccountDeletion(errorSnackbar, router)}
              cancelLabel="Create Account"
              proceedLabel="Continue Demo"
              redButton={false}
            />
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
