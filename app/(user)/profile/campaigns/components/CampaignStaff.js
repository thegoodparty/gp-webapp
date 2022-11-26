import React from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import PortalPanel from '@shared/candidate-portal/PortalPanel';
import StaffCard from './StaffCard';
import { getServerToken } from 'helpers/userServerHelper';

async function loadStaff() {
  try {
    const token = getServerToken();
    const api = gpApi.campaign.staff.userStaff;
    return await gpFetch(api, null, 3600, token);
  } catch (error) {
    console.log('staff error', JSON.stringify(error));
  }
}

async function CampaignStaff() {
  const res = await loadStaff();
  let staff;
  if (res) {
    staff = res.staff;
  }
  if (!staff || staff.length === 0) {
    return <div></div>;
  }

  return (
    <PortalPanel color="#EE6C3B">
      <h3
        className="text-[22px] tracking-wide font-black mb-16"
        data-cy="settings-title"
      >
        Campaigns
      </h3>
      <div className="grid grid-cols-12 gap-3">
        {staff.map((candidateStaff) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-4"
            key={candidateStaff.id}
            data-cy="campaign-staff-wrapper"
          >
            <StaffCard
              candidate={candidateStaff.candidate}
              role={candidateStaff.role}
            />
          </div>
        ))}
      </div>
    </PortalPanel>
  );
}

export default CampaignStaff;
