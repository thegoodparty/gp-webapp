'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { Fragment, useState } from 'react';
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
    pledged1: false,
    pledged2: false,
    pledged3: false,
  };
  const keys = ['pledged'];

  if (campaign?.[campaignKey]?.pledged) {
    initialState = { pledged: true };
  }
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!pledge) {
    return null;
  }

  const canSave = () => {
    return state.pledged1 && state.pledged2 && state.pledged3;
  };

  const handleSave = async () => {
    setLoading(true);
    const updated = campaign;
    if (!updated[campaignKey]) {
      updated[campaignKey] = {};
    }

    updated[campaignKey].pledged =
      state.pledged1 && state.pledged2 && state.pledged3;
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

  const steps = ['1', '2', '3'];

  return (
    <OnboardingWrapper {...props} slug={slug}>
      {steps.map((step) => (
        <Fragment key={step}>
          <div className="bg-gray-200 p-6 font-bold rounded mb-6">
            {pledge[`title${step}`]}
          </div>
          <div className="px-6">
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
