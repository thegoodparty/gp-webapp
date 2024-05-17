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
import H4 from '@shared/typography/H4';
import H2 from '@shared/typography/H2';

async function fetchVoterFile() {
  try {
    const api = gpApi.voterData.getVoterFile;
    return await gpFetch(api, false, false, false, false, true);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const content = [
  {
    title: 'General Compliance',
    description:
      'The Data User certifies to use any voter file data provided by GoodParty.org LLC in accordance with all applicable federal, state, and local laws, including statutory, regulatory, and common law governing the use of voter file data in the relevant jurisdictions.',
  },
  {
    title: 'Specific Uses',
    description:
      'The Data User certifies that the use of voter data is strictly limited to supporting political campaigns and public affairs advocacy.',
  },
  {
    title: 'Awareness and Conformity',
    description:
      'The Data User represents and warrants that they are fully informed of all applicable laws and will use the data in conformity with these laws.',
  },
  {
    title: 'Legal Restrictions Awareness',
    description:
      'The Data User is solely responsible for informing themselves of and complying with all legal restrictions governing the use of registered voter data.',
  },
  {
    title: 'Telephone Consumer Protection',
    description:
      'The Data User acknowledges awareness of special rules governing the use of cell phone numbers as per the Telephone Consumer Protection Act, enforced by the Federal Communications Commission.',
  },
  {
    title: 'Prohibited Uses',
    description:
      'The Data User ensures that no data supplied by GoodParty.org LLC will be used for any purposes that are immoral or illegal.',
  },
  {
    title: 'No Warranty',
    description:
      'GoodParty.org LLC disclaims all express or implied warranties regarding the accuracy, reliability, utility, or completeness of the voter file data, which is provided on an "AS IS" basis.',
  },
  {
    title: 'Disclaimer of Implied Warranties',
    description:
      'All implied warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement of proprietary rights, are expressly disclaimed.',
  },
  {
    title: 'Data Currency',
    description:
      'The Data User is cautioned that voter file data can quickly become out-of-date and must assume all responsibility for the use of such data.',
  },
  {
    title: 'Indemnification',
    description:
      'The Data User shall defend, indemnify, and hold harmless GoodParty.org LLC and its affiliates, directors, officers, employees, and agents from all claims, expenses, attorneys fees, and court costs arising from the use of the voter file data.',
  },
  {
    title: 'Ownership',
    description:
      'The data downloaded is the exclusive property of L2 INC., with GoodParty.org LLC acting as a licensee.',
  },
  {
    title: 'License Grant',
    description:
      "The Data User is granted a limited, non-exclusive license to use the data downloaded from L2's platform for the allowable purposes specified.",
  },
  {
    title: 'Compliance with Privacy Requests',
    description:
      "The Data User acknowledges that legal privacy requirements may compel GoodParty.org LLC to remove identifying information from its records and to share such deletion requests with the Data User. The Data User agrees to comply promptly with the removal of relevant records from their licensed copy of GoodParty.org's data as mandated under this agreement.",
  },
  {
    title: 'Termination',
    description:
      'We reserve the right to terminate your access to the voter file data at any time, with or without notice, if you fail to comply with these terms and conditions.',
  },
];

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
        <H2 className="mb-4">Voter File Data Use Agreement</H2>
        <Body1>
          {content.map((item, index) => (
            <div key={index} className="mt-4">
              <H4>{item.title}</H4>
              <Body2>{item.description}</Body2>
            </div>
          ))}
          <div className="flex items-center mt-12">
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
