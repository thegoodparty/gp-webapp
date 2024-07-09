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
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { dateUsHelper } from 'helpers/dateHelper';
import { CircularProgress } from '@mui/material';
import CantDownload from './CantDownload';
import Link from 'next/link';
import { slugify } from 'helpers/articleHelper';
import voterFileTypes from './VoterFileTypes';
import { getUserCookie } from 'helpers/cookieHelper';

const tableHeaders = ['NAME', 'CHANNEL', 'PURPOSE', 'AUDIENCE', 'ACTIONS'];

async function fetchVoterFile(type, customFilters) {
  try {
    const api = gpApi.voterData.getVoterFile;
    const payload = {
      type,
      customFilters: customFilters ? JSON.stringify(customFilters) : undefined,
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
  const [campaign, setCampaign] = useState(props.campaign);

  const user = getUserCookie(true);

  useEffect(() => {
    wakeUp();
  }, []);

  const handleDownload = async (type, isCustom, name, index) => {
    if (loading) {
      return;
    }
    setLoading(`index-${index}`);
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
      link.setAttribute('download', `${name}.csv`);
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

  const reloadCampaign = async () => {
    const res = await getCampaign();
    setCampaign(res.campaign);
  };

  if (
    campaign.data?.customVoterFiles &&
    campaign.data?.customVoterFiles.length > 0 &&
    voterFileTypes.length === 5
  ) {
    campaign.data?.customVoterFiles.forEach((file, i) => {
      voterFileTypes.push({
        key: i,
        isCustom: true,
        name: file.name,
        fields: [
          file.name,
          file.channel,
          file.purpose || '',
          <Chip
            key="custom"
            className="bg-orange-700 text-white"
            label="CUSTOM VOTER FILE"
          />,
        ],
      });
    });
  }
  return (
    <DashboardLayout {...props}>
      <Paper className="md:p-6">
        {props.canDownload ? (
          <>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <H2 className="mb-2">Voter File</H2>
                <Body2 className="text-gray-600">
                  A collection of voter data spreadsheets, tailored to your
                  needs.
                </Body2>
              </div>
              <CustomVoterFile
                {...props}
                reloadCampaignCallback={reloadCampaign}
                campaign={campaign}
              />
            </div>
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 border-x border-x-gray-200 ">
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
                  } ${header === 'AUDIENCE' ? 'hidden lg:block' : ''}
              
              ${header === 'PURPOSE' ? 'hidden md:block' : ''} ${
                    header === 'CHANNEL' ? 'hidden sm:block' : ''
                  }`}
                  key={index}
                >
                  <Overline>{header}</Overline>
                </div>
              ))}
              {voterFileTypes.map((file, index) => (
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
                      }
                  
                  ${index2 === 3 ? 'hidden lg:block' : ''} ${
                        index2 === 2 ? 'hidden md:block' : ''
                      }${index2 === 1 ? 'hidden sm:block' : ''}`}
                    >
                      {user.isAdmin ? (
                        <Link
                          href={
                            file.isCustom
                              ? `/dashboard/voter-records/custom-${slugify(
                                  file.name,
                                  true,
                                )}`
                              : `/dashboard/voter-records/${file.key.toLowerCase()}`
                          }
                        >
                          {field}
                        </Link>
                      ) : (
                        field
                      )}
                    </div>
                  ))}

                  <div
                    className={`col-span-1 p-4 border-b border-b-gray-200 flex justify-end ${
                      index % 2 !== 0 ? ' bg-indigo-50' : ''
                    }`}
                  >
                    {loading === `index-${index}` ? (
                      <div className="mr-3 cursor-not-allowed">
                        <CircularProgress size={20} />
                      </div>
                    ) : (
                      <FaDownload
                        className={`mr-3 cursor-pointer ${
                          loading ? 'opacity-50' : ''
                        }`}
                        onClick={() => {
                          handleDownload(
                            file.key,
                            file.isCustom,
                            file.name,
                            index,
                          );
                        }}
                      />
                    )}
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        ) : (
          <CantDownload {...props} />
        )}
      </Paper>
    </DashboardLayout>
  );
}
