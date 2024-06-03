'use client';

import DashboardLayout from '../../shared/DashboardLayout';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Paper from '@shared/utils/Paper';
import { Fragment, useEffect, useState } from 'react';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import Overline from '@shared/typography/Overline';
import { FaDownload } from 'react-icons/fa';
import { trackEvent } from 'helpers/fullStoryHelper';
import Chip from '@shared/utils/Chip';
import CustomVoterFile from './CustomVoterFile';

const tableHeaders = ['NAME', 'CHANNEL', 'PURPOSE', 'AUDIENCE', 'ACTIONS'];

const defaultFiles = [
  {
    key: 'full',
    fields: [
      'Full voter file',
      'Full voter file',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE VOTERS"
      />,
    ],
  },
  {
    key: 'doorKnocking',
    fields: [
      'Door Knocking',
      'Door Knocking (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE ADDRESSES"
      />,
    ],
  },
  {
    key: 'sms',
    fields: [
      'SMS Texting',
      'SMS Texting (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE PHONES"
      />,
    ],
  },
  {
    key: 'directMail',
    fields: [
      'Direct Mail',
      'Direct Mail (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE ADDRESSES"
      />,
    ],
  },
  {
    key: 'telemarketing',
    fields: [
      'Telemarketing',
      'Telemarketing (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE LANDLINES"
      />,
    ],
  },
];

async function fetchVoterFile(type) {
  try {
    const api = gpApi.voterData.getVoterFile;
    const payload = {
      type,
    };
    return await gpFetch(api, payload, false, false, false, true);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function wakeUp() {
  try {
    const api = gpApi.voterData.wakeUp;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function VoterRecordsPage(props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    wakeUp();
  }, []);

  const handleDownload = async (type) => {
    if (loading) {
      return;
    }
    setLoading(true);
    trackEvent('Download Voter File attempt', { type });
    const response = await fetchVoterFile(type);
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
    <DashboardLayout {...props}>
      <Paper className="md:p-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <H2 className="mb-2">Voter File</H2>
            <Body2 className="text-gray-600">
              A collection of voter data spreadsheets, tailored to your needs.
            </Body2>
          </div>
          <CustomVoterFile {...props} />
        </div>
        <div className="mt-8 grid grid-cols-8 border-x border-x-gray-200 ">
          {tableHeaders.map((header, index) => (
            <div
              className={` bg-primary text-white p-4 ${
                index === 0 ? 'rounded-tl-lg' : ''
              } ${
                index === tableHeaders.length - 1
                  ? 'rounded-tr-lg text-right'
                  : ''
              } ${
                index === tableHeaders.length - 1 || index === 2
                  ? 'col-span-1'
                  : 'col-span-2'
              }`}
              key={index}
            >
              <Overline>{header}</Overline>
            </div>
          ))}
          {defaultFiles.map((file, index) => (
            <Fragment key={file.key}>
              {file.fields.map((field, index2) => (
                <div
                  key={`${file.key}-${index2}`}
                  className={`p-4 border-b border-b-gray-200 ${
                    index % 2 !== 0 ? ' bg-indigo-50' : ''
                  } ${
                    index2 === tableHeaders.length - 1 || index2 === 2
                      ? 'col-span-1'
                      : 'col-span-2'
                  }`}
                >
                  {field}
                </div>
              ))}

              <div
                className={`col-span-1 p-4 border-b border-b-gray-200 flex justify-end ${
                  index % 2 !== 0 ? ' bg-indigo-50' : ''
                }`}
              >
                <FaDownload
                  className={`mr-3 cursor-pointer ${
                    loading ? 'opacity-25' : ''
                  }`}
                  onClick={() => {
                    handleDownload(file.key);
                  }}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </Paper>
    </DashboardLayout>
  );
}
