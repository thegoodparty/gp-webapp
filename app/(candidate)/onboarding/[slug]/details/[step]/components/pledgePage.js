'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useState } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import ReactLoading from 'react-loading';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PositionsSelector from 'app/(candidate)/onboarding/components/PositionsSelector';
import TextField from '@shared/inputs/TextField';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { Checkbox } from '@mui/material';

export default function PledgePage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  pledge,
  campaignKey,
  ...props
}) {
  let initialState = {
    pledged: false,
  };
  const keys = ['pledged'];

  if (campaign?.[campaignKey]?.pledged) {
    initialState = { pledged: true };
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canSave = () => {
    return state.pledged;
  };

  const handleSave = async () => {
    setLoading(true);
    const updated = campaign;
    if (!updated[campaignKey]) {
      updated[campaignKey] = {};
    }

    updated[campaignKey].pledged = state.pledged;
    await updateCampaign(updated);
    let path = nextPath;

    router.push(`onboarding/${slug}${path}`);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <CmsContentWrapper>{contentfulHelper(pledge?.content)}</CmsContentWrapper>
      <div className="mt-4 flex items-center text-xl font-bold mb-10">
        <Checkbox
          checked={state.pledged}
          onChange={(e) => onChangeField('pledged', e.target.checked)}
        />
        &nbsp; &nbsp; {pledge?.cta}
      </div>
      <div className="flex justify-center">
        {loading ? (
          <ReactLoading color="green" />
        ) : (
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div>NEXT</div>
          </BlackButtonClient>
        )}
      </div>
    </OnboardingWrapper>
  );
}
