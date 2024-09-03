'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';
import { fetchVoterFile } from '../../components/VoterRecordsPage';
import { trackEvent } from 'helpers/fullStoryHelper';
import { CircularProgress } from '@mui/material';

export default function DownloadFile(props) {
  const [loading, setLoading] = useState(false);
  const { type, campaign, fileName, isCustom } = props;

  const handleDownload = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let response;
    if (isCustom) {
      trackEvent('Download Voter File attempt', { type: 'custom' });
      const customFilters = campaign.data.customVoterFiles[type];
      response = await fetchVoterFile('custom', customFilters);
    } else {
      response = await fetchVoterFile(type);
      trackEvent('Download Voter File attempt', { type });
    }

    if (response) {
      // Read the response as Blob
      const blob = await response.blob();
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      trackEvent('Download Voter File Success', { type });
    } else {
      trackEvent('Download Voter File Failure', {
        type,
        slug: props.campaign.slug,
      });
    }
    setLoading(false);
  };

  return (
    <div className="mt-3 md:mt-0">
      <PrimaryButton
        disabled={loading}
        onClick={handleDownload}
        fullWidth
        loading={loading}
      >
        Download CSV
      </PrimaryButton>
    </div>
  );
}
