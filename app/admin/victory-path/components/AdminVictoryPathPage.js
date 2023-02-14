'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { Select } from '@mui/material';

// import { useHookstate } from '@hookstate/core';
// import { globalSnackbarState } from '@shared/utils/Snackbar';

export default function AdminVictoryPathPage(props) {
  console.log('campaigns', props.campaigns);
  const [selected, setSelected] = useState(false);
  const [campaignsBySlug, setCampaignsBySlug] = useState(false);
  useEffect(() => {
    const bySlug = {};
    props.campaigns.forEach((campaign) => {
      bySlug[campaign.slug] = campaign;
    });
    setCampaignsBySlug(bySlug);
  }, []);

  const { campaigns } = props;

  const onSelectCallback = (e) => {
    setSelected(campaignsBySlug[e.target.value]);
  };

  console.log('se', selected);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Select
          native
          fullWidth
          variant="outlined"
          onChange={onSelectCallback}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <option value="">Select a Campaign</option>
          {campaigns.map((op) => (
            <option value={op.slug} key={op.slug}>
              {op.slug} (User: {op.user.name})
            </option>
          ))}
        </Select>
        {selected && <div>Fields here</div>}
      </PortalPanel>
    </AdminWrapper>
  );
}
