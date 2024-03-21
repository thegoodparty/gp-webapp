'use client';
import H3 from '@shared/typography/H3';

import DashboardLayout from '../../../shared/DashboardLayout';
import NoCampaign from './NoCampaign';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import Link from 'next/link';
import { dateUsHelper } from 'helpers/dateHelper';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function deleteDkCampaign(slug) {
  try {
    const api = gpApi.doorKnocking.delete;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function DoorKnockingMainPage(props) {
  const { dkCampaigns } = props;
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const handleDelete = async () => {
    await deleteDkCampaign(showDeleteWarning);
    window.location.reload();
  };
  return (
    <DashboardLayout {...props}>
      {!dkCampaigns || dkCampaigns.length === 0 ? (
        <NoCampaign />
      ) : (
        <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl min-h-[calc(100vh-75px)]">
          <H1>Existing Campaigns</H1>
          <div className="mt-6 grid grid-cols-12 gap-4">
            {dkCampaigns.map((campaign) => (
              <Link
                href={`/dashboard/door-knocking/campaign/${campaign.slug}`}
                key={campaign.slug}
                className="col-span-12 md:col-span-6 lg:col-span-4 no-underline"
              >
                <div className=" bg-white border transition-colors border-slate-300 p-4 rounded-md shadow hover:border-primary cursor-pointer relative">
                  <div
                    className="absolute right-3 top-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowDeleteWarning(campaign.slug);
                    }}
                  >
                    <FaTrash className="text-red-500" />
                  </div>
                  <H3 className="mb-3">{campaign.name}</H3>
                  <Body1>
                    {dateUsHelper(campaign.startDate)} -{' '}
                    {dateUsHelper(campaign.endDate)}
                    <br />
                    {campaign.housesPerRoute} houses per route
                    <br />
                    {campaign.minutesPerHouse} minutes at each house
                  </Body1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <AlertDialog
        open={showDeleteWarning}
        handleClose={() => {
          setShowDeleteWarning(false);
        }}
        title={'Delete Campaign'}
        description={`Are you sure you want to duplicate this campaign?`}
        handleProceed={handleDelete}
      />
    </DashboardLayout>
  );
}