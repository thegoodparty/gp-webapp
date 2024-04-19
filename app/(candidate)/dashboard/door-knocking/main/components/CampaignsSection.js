'use client';
import { useState } from 'react';
import DkCampaignPreview from './DkCampaignPreview';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import AddCampaign from './AddCampaign';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Select } from '@mui/material';
import { calcCampaignStatus } from './CampaignStatusChip';

const statuses = ['Active', 'Upcoming', 'Completed', 'Archived'];

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
  const { campaignDates } = props;
  const [dkCampaigns, setDkCampaigns] = useState(props.dkCampaigns || []);
  const [selectedStatus, setSelectedStatus] = useState('');

  const updateCampaignsCallback = async () => {
    const { dkCampaigns } = await fetchDkCampaigns();
    setDkCampaigns(dkCampaigns);
  };

  const filterByStatus = (status) => {
    if (status === '') {
      return props.dkCampaigns;
    }
    return props.dkCampaigns.filter((campaign) => {
      const resolvedStatus = calcCampaignStatus(campaign);
      return resolvedStatus === status.toLowerCase();
    });
  };
  const handleSelect = (status) => {
    setSelectedStatus(status);
    setDkCampaigns(filterByStatus(status));
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <H1>Door Knocking Campaigns</H1>
          <Body2>All of your campaigns in one place.</Body2>
        </div>
        <div className="flex items-center">
          <Select
            value={selectedStatus}
            onChange={(e) => handleSelect(e.target.value)}
            native
            outlined
            variant="outlined"
            size="small"
            style={{
              paddingTop: '9px',
              paddingBottom: '2px',
              minWidth: '180px',
              marginRight: '16px',
            }}
          >
            <option value="">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <AddCampaign
            buttonLabel={
              <div className="flex items-center">
                <BsPlusCircleFill /> <div className="ml-2">New Campaign</div>
              </div>
            }
            campaignDates={campaignDates}
          />
        </div>
      </div>
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
