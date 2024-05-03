'use client';

import H1 from '@shared/typography/H1';
import DashboardLayout from '../../shared/DashboardLayout';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Paper from '@shared/utils/Paper';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import Checkbox from '@shared/inputs/Checkbox';
import { useState } from 'react';

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
  const [checked, setChecked] = useState(false);
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
      <Paper className=" mt-6 md:py-12 md:px-6">
        <Body1>
          To download your voter records, please click the button below. This
          might take a minute.
        </Body1>

        <H3 className="mt-8">Voter File Data Use Agreement</H3>
        <Body1>
          <br />
          By downloading voter file data from our website, you
          (&quot;Candidate&quot; or &quot;Authorized User&quot;) agree to the
          following terms and conditions:
          <br />
          <br />
          <strong>Permitted Use:</strong> <br />
          You are permitted to use the voter file data solely for political
          campaign purposes, including but not limited to, voter outreach, voter
          registration, and get-out-the-vote efforts. You may not use the data
          for any commercial or non-political purposes.
          <br />
          <br />
          <strong>Data Protection:</strong> <br />
          You agree to protect the voter file data from unauthorized access,
          disclosure, or use. You will implement appropriate security measures
          to prevent the data from being lost, stolen, or compromised.
          <br />
          <br />
          <strong>Data Sharing:</strong> <br />
          You may not share the voter file data with any third party, except as
          necessary to fulfill your political campaign purposes. You may not
          sell, rent, or otherwise disclose the data to any third party.
          <br />
          <br />
          <strong>Opt-Out:</strong> <br />
          You will respect the privacy rights of individuals who opt-out of
          receiving communications from you. You will provide a clear and easy
          way for individuals to opt-out of future communications.
          <br />
          <br />
          <strong>Security:</strong> <br />
          You will ensure that any sensitive information, such as credit card
          data, is encrypted and transmitted securely.
          <br />
          <br />
          <strong>Compliance:</strong> <br />
          You will comply with all applicable laws and regulations, including
          but not limited to, data protection laws, campaign finance laws, and
          election laws.
          <br />
          <br />
          <strong>Indemnification:</strong> <br />
          You agree to indemnify and hold harmless our website, its affiliates,
          and its licensors from any claims, damages, or expenses arising from
          your use of the voter file data.
          <br />
          <br />
          <strong>Termination:</strong> <br />
          We reserve the right to terminate your access to the voter file data
          at any time, with or without notice, if you fail to comply with these
          terms and conditions.
          <br />
          <br />
          <div className="flex items-center">
            <Checkbox
              value={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <div className="ml-2">
              By checking this box and downloading the file, you acknowledge
              that you have read, understood, and agree to be bound by these
              terms and conditions.
            </div>
          </div>
        </Body1>
        <div className="mt-12 cursor-pointer">
          <PrimaryButton onClick={handleDownload} disabled={!checked}>
            Download Voter file (.csv)
          </PrimaryButton>
        </div>
      </Paper>
    </DashboardLayout>
  );
}
