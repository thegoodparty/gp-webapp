'use client';
import { LinearProgress } from '@mui/material';
import YellowButton from '@shared/buttons/YellowButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

async function generateAI() {
  try {
    const api = gpApi.campaign.onboarding.ai.fastCreate;
    return await gpFetch(api, {
      key: 'searchForOffice',
    });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function SearchForOffices({ campaign }) {
  const { zip } = campaign?.details;
  const [aiOffices, setAiOffices] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!zip) {
    return null;
  }

  const handleSearch = async () => {
    setLoading(true);
    const { aiResponse } = await generateAI();
    setAiOffices(aiResponse);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="my-12">
          <div className="text-center font-black text-2xl">
            Finding Offices in your area...
          </div>
          <div className="max-w-lg mx-auto">
            <LinearProgress className="h-2 mt-4 mb-2 bg-black rounded [&>.MuiLinearProgress-bar]:bg-slate-500" />
          </div>
        </div>
      ) : (
        <div className="my-12">
          {aiOffices ? (
            <div className="text-xl border border-gray-500 rounded p-3">
              <div dangerouslySetInnerHTML={{ __html: aiOffices }} />
            </div>
          ) : (
            <div className="text-center" onClick={handleSearch}>
              <YellowButton>SEARCH FOR OFFICES</YellowButton>
            </div>
          )}
        </div>
      )}
    </>
  );
}
