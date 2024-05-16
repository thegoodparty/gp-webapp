'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { slugify } from 'helpers/articleHelper';

export async function downloadResults(slug) {
  try {
    const api = gpApi.doorKnocking.survey.download;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload, false, false, false, true);
  } catch (e) {
    console.log('error downloading results', e);
    return false;
  }
}

export default function DownloadResults(props) {
  const { dkCampaign } = props;

  const handleDownload = async () => {
    try {
      const response = await downloadResults(dkCampaign.slug);
      if (response) {
        // Check if the response is ok
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          return;
        }

        // Read the response as Blob
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `door-knocking-campaign-results-${slugify(dkCampaign.name)}.csv`,
        );
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.log('Downloaded CSV successfully');
      } else {
        console.error('No response received from downloadResults');
      }
    } catch (error) {
      console.error('Error during download:', error);
    }
  };

  return (
    <PrimaryButton onClick={handleDownload}>Download Results</PrimaryButton>
  );
}
