'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import React from 'react';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Image from 'next/image';

const PurchaseSuccessPage = () => {
  return (
    <FocusedExperienceWrapper className="flex flex-col items-center">
      <Image
        className="mx-auto mb-8"
        src="/images/emojis/party-popper.svg"
        width={80}
        height={80}
        alt="clap"
      />
      <H1 className="text-center mb-4">
        You are now subscribed to GoodParty.org Pro!
      </H1>
      <Body2 className="text-center mb-8">
        As a reminder you will be billed monthly for your subscription, until
        your election date, but can cancel or reactivate anytime in your{' '}
        <Link className="underline" href="/profile">
          settings
        </Link>
        .<br />
        <br />
        We look forward to helping you on your journey to run and win in office!
      </Body2>
      <Link className="block self-start w-full md:w-auto" href="/dashboard">
        <SecondaryButton className="w-full">
          Go Back to Dashboard
        </SecondaryButton>
      </Link>
    </FocusedExperienceWrapper>
  );
};

export default PurchaseSuccessPage;
