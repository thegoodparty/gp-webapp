'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { RxRocket } from 'react-icons/rx';

export default function CrunchingPage({ slug, ...props }) {
  useEffect(() => {
    savingState.set(() => false);
  }, []);

  const icon = (
    <Image
      src="/images/campaign/confetti-icon.png"
      alt="GP"
      width={64}
      height={64}
      priority
    />
  );

  return (
    <OnboardingWrapper {...props} slug={slug} icon={icon}>
      <h3 className="text-lg text-zinc-500 mb-40 text-center">
        Good Party will be providing you with data to help you understand your
        Path to Victory. While we work on the data, you can get started building
        out your <strong>Goals</strong>
      </h3>
      <div className="flex justify-center  mb-8">
        <a href={`/onboarding/${slug}/dashboard/1`}>
          <BlackButtonClient>
            <div>GET STARTED</div>
          </BlackButtonClient>
        </a>
      </div>
    </OnboardingWrapper>
  );
}
