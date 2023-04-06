'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { Fragment, useEffect, useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import ReactLoading from 'react-loading';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { Checkbox } from '@mui/material';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import Image from 'next/image';

export default function PledgePage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  pledge,
  subSectionKey,
  ...props
}) {
  let initialState = {
    pledged1: false,
    pledged2: false,
    pledged3: false,
  };
  const keys = ['pledged'];

  useEffect(() => {
    savingState.set(() => false);
  }, []);

  if (campaign?.[subSectionKey]?.pledged) {
    initialState = { pledged: true };
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();

  if (!pledge) {
    return null;
  }

  const canSave = () => {
    return state.pledged1 && state.pledged2 && state.pledged3;
  };

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey].pledged =
      state.pledged1 && state.pledged2 && state.pledged3;
    await updateCampaign(updated);
    let path = nextPath;

    savingState.set(() => true);

    setTimeout(() => {
      router.push(`onboarding/${slug}${path}`);
    }, 200);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const steps = ['1', '2', '3'];

  const icon = (
    <Image src="/images/heart.svg" alt="GP" width={64} height={64} priority />
  );

  return (
    <OnboardingWrapper {...props} slug={slug} icon={icon}>
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div className="bg-gray-200 p-6 font-bold rounded mb-6">
            {pledge[`title${step}`]}
          </div>
          <div
            className={`px-6 ${
              step === '1' || state[`pledged${index}`] ? 'block' : 'hidden'
            }`}
          >
            <CmsContentWrapper>
              {contentfulHelper(pledge[`content${step}`])}
            </CmsContentWrapper>
            <div className="mt-4 flex items-center font-bold mb-10">
              <Checkbox
                checked={state[`pledged${step}`]}
                onChange={(e) =>
                  onChangeField(`pledged${step}`, e.target.checked)
                }
              />
              &nbsp; &nbsp; I agree
            </div>
          </div>
        </Fragment>
      ))}

      <div className="flex justify-center mb-8">
        <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
          <div className="font-black">NEXT</div>
        </BlackButtonClient>
      </div>
    </OnboardingWrapper>
  );
}
