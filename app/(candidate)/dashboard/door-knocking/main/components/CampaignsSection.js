'use client';
import { useState } from 'react';
import DkCampaignPreview from './DkCampaignPreview';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchDkCampaigns() {
  try {
    const api = gpApi.doorKnocking.list;

    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchDkCampaigns', e);
    return false;
  }
}

export default function CampaignsSection(props) {
  const [dkCampaigns, setDkCampaigns] = useState(props.dkCampaigns || []);

  const updateCampaignsCallback = async () => {
    const { dkCampaigns } = await fetchDkCampaigns();
    setDkCampaigns(dkCampaigns);
  };
  return (
    <div>
      <section className="mt-6 grid grid-cols-12 gap-4">
        {dkCampaigns &&
          dkCampaigns.map((campaign) => (
            <DkCampaignPreview
              campaign={campaign}
              key={campaign.slug}
              updateCampaignsCallback={updateCampaignsCallback}
              campaignDates={props.campaignDates}
            />
          ))}
      </section>
    </div>
  );
}
