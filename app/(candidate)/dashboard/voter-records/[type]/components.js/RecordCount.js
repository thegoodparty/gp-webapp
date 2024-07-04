'use client';
import { useEffect, useState } from 'react';
import VoterFileTypes from '../../components/VoterFileTypes';

import MarketingH2 from '@shared/typography/MarketingH2';
import { CircularProgress } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { numberFormatter } from 'helpers/numberHelper';

async function countVoterFile(type, customFilters) {
  try {
    const api = gpApi.voterData.count;
    const payload = {
      type,
      customFilters: customFilters ? JSON.stringify(customFilters) : undefined,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const fileByKey = {};
VoterFileTypes.forEach((file) => {
  fileByKey[file.key.toLowerCase()] = file;
});

export default function RecordCount(props) {
  const { type, isCustom, campaign, index } = props;
  // const file = fileByKey[type];
  // const { name, fields } = file;
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    handleCount();
  }, [type, isCustom]);

  const handleCount = async () => {
    let response;
    if (isCustom) {
      let cleanType = type.replace('custom-', '');
      const customFilters = campaign.data.customVoterFiles[index];
      console.log('customFilters', customFilters);
      console.log(
        'campaign.data.customVoterFiles',
        campaign.data.customVoterFiles,
      );
      response = await countVoterFile('custom', customFilters);
    } else {
      response = await countVoterFile(type);
    }
    if (!response) {
      setError(true);
      setLoading(false);
    } else {
      setCount(response.count);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="mt-4">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-4">
        <MarketingH2>There was an error counting the records</MarketingH2>
      </div>
    );
  }
  return <MarketingH2>{numberFormatter(count)}</MarketingH2>;
}
