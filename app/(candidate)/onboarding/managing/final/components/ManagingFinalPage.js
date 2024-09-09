'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation';

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
          If your candidate is already in our system, they will receive an email
          to confirm your role as their Campaign Manager. Once they accept,
          you&apos;ll have full access to manage the campaign through your
          account.
        </Body2>
        <Body2 className="mt-3">
          If not, they will receive an invitation to create an account and add
          you as their Campaign Manager.
        </Body2>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-8">
        <Link className="w-full" href="/">
          <PrimaryButton className="w-full">
            <div className="min-w-[120px]">Return to GoodParty.org</div>
          </PrimaryButton>
        </Link>
      </div>
    </CardPageWrapper>
  );
};
