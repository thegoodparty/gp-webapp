'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import H3 from '@shared/typography/H3';
import Checkbox from '@shared/inputs/Checkbox';
import { useState } from 'react';
import { CandidateFieldSelect } from './CandidateFieldSelect';
import { CANDIDATE_TIERS } from './candidate-tiers.constant';
import { IS_VERIFIED_OPTIONS } from './is-verified-options.constant';

async function updateAdminFields(
  slug,
  isVerified,
  isPro,
  didWin,
  tier
) {
  try {
    const api = gpApi.campaign.adminUpdate;
    const payload = {
      slug,
      isVerified,
      isPro,
      didWin,
      tier
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const fields = [
  { key: 'isVerified', label: 'Is Verified?' },
  { key: 'tier', label: 'Tier' },
  { key: 'isPro', label: 'Is Pro Account?' },
  { key: 'didWin', label: 'Did win election?' },
];

export default function ProFieldsSection(props) {
  const { campaignObj } = props;
  const [state, setState] = useState({
    isVerified: campaignObj.isVerified,
    tier: campaignObj.tier,
    isPro: campaignObj.isPro,
    didWin: campaignObj.didWin,
  });

  const handleChange = async (key, value) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    await updateAdminFields(
      campaignObj.slug,
      newState.isVerified,
      newState.isPro,
      newState.didWin,
      newState.tier,
    );
  };



  return (
    <div className="bg-slate-50 rounded border border-slate-300 p-4 my-12">
      <H3>Additional Fields</H3>
      {fields.map(
        (field) => <div key={field.key} className="flex items-center">
          {
            ['isVerified', 'tier'].includes(field.key) ?
              <CandidateFieldSelect
                value={state[field.key]}
                onChange={
                  (e) => handleChange(field.key, e.target.value)
                }
                valueMapping={
                  field.key === 'isVerified' ?
                    IS_VERIFIED_OPTIONS :
                    CANDIDATE_TIERS
                }
              /> :
              <Checkbox
                value={state[field.key]}
                defaultChecked={campaignObj[field.key]}
                onChange={(e) => handleChange(field.key, e.target.checked)}
              />
          }
          <div className="ml-2">{field.label}</div>
        </div>
      )}
    </div>
  );
}

