'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import Image from 'next/image';

import { useEffect } from 'react';
import CampaignPlanSection from '../../../campaign-plan/components/CampaignPlanSection';

const sections = [
  { key: 'slogan', title: 'Slogans' },
  { key: 'why', title: "Why I'm Running" },
  { key: 'aboutMe', title: 'About Me' },
  { key: 'policyPlatform', title: 'Policy Platform' },
];

export default function PlanPreviewPage({ slug, ...props }) {
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

  const { campaign } = props;

  return (
    <div className="bg-slate-100">
      <OnboardingWrapper {...props} slug={slug} icon={icon} fullWidth noBg>
        <h3 className="text-lg text-zinc-500 mb-40 text-center">
          Good Party will be providing you with data to help you understand your
          Path to Victory. While we work on the data, you can get started
          building out your <strong>Election Details</strong>
        </h3>
        <div>
          {sections.map((section) => (
            <CampaignPlanSection
              key={section.key}
              section={section}
              campaign={campaign}
              initialOpen={section.key === 'slogan'}
              versions={{}}
            />
          ))}
        </div>
        <div className="flex justify-center  mb-8">
          <a href={`/onboarding/${slug}/dashboard/1`}>
            <BlackButtonClient>
              <div>GO TO MY DASHBOARD</div>
            </BlackButtonClient>
          </a>
        </div>
      </OnboardingWrapper>
    </div>
  );
}
