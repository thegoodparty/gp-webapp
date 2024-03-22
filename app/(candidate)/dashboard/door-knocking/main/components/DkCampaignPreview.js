'use client';
import Link from 'next/link';
import { dateUsHelper } from 'helpers/dateHelper';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { CircularProgress } from '@mui/material';
import { boundsToImage } from '../../campaign/[slug]/components/RoutePreview';
import Image from 'next/image';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import Subtitle2 from '@shared/typography/Subtitle2';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import { Primary } from '@storybook/blocks';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Actions from './Actions';

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

export default function DkCampaignPreview(props) {
  const { campaign } = props;
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const handleDelete = async () => {
    await deleteDkCampaign(campaign.slug);
    window.location.reload();
  };

  const { hasRoutes, bounds, type, routesCount, status } = campaign;
  let mapImageUrl = '';
  if (hasRoutes && bounds) {
    mapImageUrl = boundsToImage(bounds);
  }
  const campaignStatus = status || 'active';
  return (
    <>
      <Link
        href={`/dashboard/door-knocking/campaign/${campaign.slug}`}
        key={campaign.slug}
        className="col-span-12 md:col-span-6 lg:col-span-4 no-underline"
      >
        <div className=" bg-white border transition-colors border-slate-300 p-4 rounded-md  hover:border-primary cursor-pointer relative">
          {hasRoutes ? (
            <div>
              <Image
                src={mapImageUrl}
                alt="map"
                width={380}
                height={250}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="h-[250px]  bg-gray-100 flex items-center justify-center">
              <CircularProgress />
            </div>
          )}
          <div className="flex items-center justify-between">
            <H2 className="mt-4">{campaign.name}</H2>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Actions campaign={campaign} />
            </div>
          </div>
          <Subtitle1 className="mb-2">{type}</Subtitle1>
          <Subtitle2 className="mb-2">
            {dateUsHelper(campaign.startDate)} -{' '}
            {dateUsHelper(campaign.endDate)}
          </Subtitle2>
          <div className="bg-green-50 text-green-800 uppercase  p-2 rounded inline-flex items-center font-medium mr-2 text-xs">
            {campaignStatus}
          </div>
          <div className="bg-slate-50 text-indigo-600  p-2 rounded inline-flex items-center font-medium text-xs">
            <MdOutlineDirectionsWalk />
            <div className="ml-1  ">{routesCount || 0} ROUTES</div>
          </div>
          {hasRoutes ? (
            <Link
              className="mt-4 block"
              href={`/dashboard/door-knocking/campaign/${campaign.slug}`}
            >
              <PrimaryButton variant="outlined" fullWidth>
                View Campaign
              </PrimaryButton>
            </Link>
          ) : null}
        </div>
      </Link>
      <AlertDialog
        open={showDeleteWarning}
        handleClose={() => {
          setShowDeleteWarning(false);
        }}
        title={'Delete Campaign'}
        description={`Are you sure you want to duplicate this campaign?`}
        handleProceed={handleDelete}
      />
    </>
  );
}
