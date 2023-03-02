'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import Link from 'next/link';
import { RxRocket } from 'react-icons/rx';

export default function CrunchingPage({ slug, ...props }) {
  return (
    <OnboardingWrapper {...props} slug={slug} icon={<RxRocket size={50} />}>
      <h3 className="text-lg text-zinc-500 mb-40 text-center">
        Good Party will be providing you with data to help you understand your
        Path to Victory.
      </h3>
      <div className="mb-8 text-lg text-center max-w-[360px] mx-auto">
        While we work on the data. You can get started with our{' '}
        <strong>Virtual Campaign Manager.</strong>
      </div>
      <div className="flex justify-center">
        <Link href={`/onboarding/${slug}/dashboard`}>
          <BlackButtonClient>
            <div>NEXT</div>
          </BlackButtonClient>
        </Link>
      </div>
    </OnboardingWrapper>
  );
}
