'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import H3 from '@shared/typography/H3';
import Checkbox from '@shared/inputs/Checkbox';
import { useState } from 'react';
import { IsVerifiedSelect } from './IsVerifiedSelect';

async function updateAdminFields(slug, isVerified, isPro, didWin) {
  try {
    const api = gpApi.campaign.adminUpdate;
    const payload = {
      slug,
      isVerified,
      isPro,
      didWin,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const fields = [
  { key: 'isVerified', label: 'Is Verified?' },
  { key: 'isPro', label: 'Is Pro Account?' },
  { key: 'didWin', label: 'Did win election?' },
];

export default function ProFieldsSection(props) {
  const { campaignObj } = props;
  const [state, setState] = useState({
    isVerified: campaignObj.isVerified,
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
    );
  };



  return (
    <div className="bg-slate-50 rounded border border-slate-300 p-4 my-12">
      <H3>Additional Fields</H3>
      {fields.map(
        (field) => <div key={field.key} className="flex items-center">
          {
            field.key === 'isVerified' ?
              <IsVerifiedSelect
                value={state[field.key]}
                onChange={
                  (e) => handleChange(field.key, e.target.value)
                } /> :
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

