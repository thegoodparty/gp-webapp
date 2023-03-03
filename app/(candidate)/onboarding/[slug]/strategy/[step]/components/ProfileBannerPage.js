'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactLoading from 'react-loading';

export default function ProfileBannerPage(props) {
  const { slug } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    router.push(`onboarding/${slug}/dashboard`);
  };

  return (
    <OnboardingWrapper {...props}>
      <div className="flex justify-center">
        {loading ? (
          <ReactLoading color="green" />
        ) : (
          <BlackButtonClient onClick={handleSave}>
            <div>NEXT</div>
          </BlackButtonClient>
        )}
      </div>
    </OnboardingWrapper>
  );
}
