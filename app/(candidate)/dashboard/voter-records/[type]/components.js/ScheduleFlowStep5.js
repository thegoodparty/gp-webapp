'use client';
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { getUserCookie } from 'helpers/cookieHelper';
import Link from 'next/link';

export default function ScheduleFlowStep5({ resetCallback }) {
  const user = getUserCookie(true);
  return (
    <div className="p-4 w-[90vw] max-w-xl">
      <div className="text-center">
        <H1>Request Submitted</H1>
        <Body1 className="mt-4 mb-8">
          A confirmation has been sent to{' '}
          <span className="font-bold">{user.email}</span>.<br />
          We will be reaching out to you shortly to pay your invoice and
          schedule your campaign.
        </Body1>

        <div className="mt-8">
          <CheckmarkAnimation />
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <Link href="/dashboard">
              <PrimaryButton
                variant="outlined"
                fullWidth
                onClick={resetCallback}
              >
                Return to Dashboard
              </PrimaryButton>
            </Link>
          </div>
          <div className="col-span-6 text-right mt-6">
            <Link href="/dashboard/voter-records" fullWidth>
              <PrimaryButton fullWidth onClick={resetCallback}>
                Return to Voter File
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
