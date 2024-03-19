'use client';

import H1 from '@shared/typography/H1';
import DashboardLayout from '../../shared/DashboardLayout';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchVoterFile() {
  try {
    const api = gpApi.voterData.getVoterFile;
    return await gpFetch(api, false, false, false, false, true);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function VoterRecordsPage(props) {
  const handleDownload = async () => {
    const response = await fetchVoterFile();
    if (response) {
      // Read the response as Blob
      const blob = await response.blob();
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voter-records.csv');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };
  return (
    <DashboardLayout {...props}>
      <H1>Voter Records</H1>
      <div className="bg-white border border-slate-300 py-6 px-8 rounded-xl mt-6 md:py-12 md:px-6">
        <Body1>
          To download your voter records, please click the button below. This
          might take a minute.
        </Body1>
        <div className="mt-12 cursor-pointer" onClick={handleDownload}>
          <PrimaryButton>Download Voter file (.csv)</PrimaryButton>
        </div>
      </div>
    </DashboardLayout>
  );
}
