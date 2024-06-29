'use client';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const doRedirect = async () => {
  try {
    const { redirectUrl } =
      (await gpFetch(gpApi.payments.createCheckoutSession)) || {};
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      throw new Error('No redirect url found');
    }
  } catch (e) {
    console.error('error when creating checkout session.', e);
  }
};

const PurchaseRedirectPage = ({ campaign }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      return doRedirect();
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <FocusedExperienceWrapper>
      {campaign?.isPro ? (
        <AlreadyProUserPrompt />
      ) : (
        <div className="text-center">
          <Image
            className="mx-auto mb-8"
            src="/images/emojis/clockwise-vertical-arrows.svg"
            width={80}
            height={80}
            alt="clap"
          />
          <H1 className="mb-4">
            You are about to be redirected to Stripe to confirm you payment
            details.
          </H1>
          <Body2 className="mb-8">
            Once finished, you will be brought back to Good Party.
          </Body2>
          <p className="text-sm font-semibold mb-6">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      )}
    </FocusedExperienceWrapper>
  );
};

export default PurchaseRedirectPage;
