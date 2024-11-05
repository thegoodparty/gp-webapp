'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import Link from 'next/link';
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation';
import Button from '@shared/buttons/Button';

export const ManagingFinalPage = ({ candidateEmail }) => {
  return (
    <CardPageWrapper>
      <div className="text-center mb-4 pt-0 mb-8">
        <H1>Request Submitted</H1>
        <Body2 className="mt-3">
          A confirmation has been sent to{' '}
          <Link
            className="underline"
            target="_blank"
            href={`mailto:${candidateEmail}`}
          >
            {candidateEmail}
          </Link>
          .
        </Body2>
        <div className="max-w-xs m-auto">
          <CheckmarkAnimation loop={false} />
        </div>
        <Body2>
          Your candidate will receive an email to confirm you as their Campaign
          Manager. If they&apos;re new to our system, they&apos;ll be prompted
          to create an account.
        </Body2>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-8">
        <Button href="/" className="w-full min-w-[170px]">
          Return to GoodParty.org
        </Button>
      </div>
    </CardPageWrapper>
  );
};
