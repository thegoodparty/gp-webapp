'use client';
import { FiSettings } from 'react-icons/fi';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import { MdOpenInNew } from 'react-icons/md';
import { PaymentPortalButton } from '@shared/PaymentPortalButton';
import H6 from '@shared/typography/H6';

export const AccountSettingsSection = ({ isPro }) => {
  const plan = isPro ? 'Pro plan' : 'Free plan';
  return (
    <section className="py-4 border-b border-slate-300 flex">
      <div className="shrink-0 pr-3 text-indigo-600 pt-[6px]">
        <FiSettings />
      </div>
      <div className="flex-1">
        <H4>Account Settings</H4>
        <Body2 className="text-indigo-600 mb-6">
          See information regarding your current plan.
        </Body2>
        <H6>Current Plan</H6>
        <Body2 className="text-indigo-600 mb-4">
          Manage and change your plan.
        </Body2>
        <div className="rounded-lg border border-indigo-200 p-6">
          <div className="flex justify-between">
            <div className="left-side">
              <div className="font-medium mb-4">
                Good Party - {plan}{' '}
                {!isPro && (
                  <Link className="underline" href="/dashboard/pro-sign-up">
                    Sign Up Today!
                  </Link>
                )}
              </div>
              <span className="font-normal">
                Need help? Please{' '}
                <Link className="underline" href="/contact">
                  Contact us
                </Link>
              </span>
            </div>
            {isPro && (
              <PaymentPortalButton>
                Manage Subscription
                <MdOpenInNew className="ml-2" />
              </PaymentPortalButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
