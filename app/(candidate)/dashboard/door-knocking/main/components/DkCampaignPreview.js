'use client';
import Link from 'next/link';
import { dateUsHelper } from 'helpers/dateHelper';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { boundsToImage } from '../../campaign/[slug]/components/RoutePreview';
import Image from 'next/image';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import Subtitle2 from '@shared/typography/Subtitle2';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Actions from './Actions';
import Chip from '@shared/utils/Chip';

// if a campaign status is complete or archived, reutrn that status.
// else use the start and end date to determine if the campaign is active, upcoming  or passed
function calcCampaignState(campaign) {
  if (campaign.status === 'complete' || campaign.status === 'archived') {
    return campaign.status;
  }
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const currentDate = new Date();
  if (currentDate < startDate) {
    return 'upcoming';
  } else if (currentDate > endDate) {
    return 'passed';
  } else {
    return 'active';
  }
}

export default function DkCampaignPreview(props) {
  const { campaign, updateCampaignsCallback, campaignDates } = props;

  console.log('campaign', campaign);

  const { hasRoutes, bounds, type, routesCount, status } = campaign || {};

  useEffect(() => {
    let timeoutId;

    if (campaign && !campaign.hasRoutes) {
      timeoutId = setTimeout(() => {
        console.log('callback');
        updateCampaignsCallback();
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [campaign, updateCampaignsCallback]); // Dependency array, re-run the effect if campaign or updateCampaignsCallback changes

  if (!campaign) return null;

  let mapImageUrl = '';
  if (hasRoutes && bounds) {
    mapImageUrl = boundsToImage(bounds);
  }
  const campaignStatus = calcCampaignState(campaign);
  return (
    <>
      <Link
        href={`/dashboard/door-knocking/campaign/${campaign.slug}`}
        key={campaign.slug}
        className="col-span-12 md:col-span-6 lg:col-span-4 no-underline"
      >
        <div className=" bg-white border transition-colors border-slate-300 p-4 rounded-md  hover:border-primary cursor-pointer relative">
          {hasRoutes ? (
            <div className="relative">
              <Image
                src={mapImageUrl}
                alt="map"
                width={380}
                height={250}
                className="w-full h-auto"
              />
              <div className="absolute w-full left-0 bottom-0 h-7 bg-white"></div>
            </div>
          ) : (
            <div className="h-[250px]  bg-gray-100 flex items-center justify-center mb-4">
              <CircularProgress />
            </div>
          )}
          <div className="flex items-center justify-between">
            <H2>{campaign.name}</H2>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Actions campaign={campaign} campaignDates={campaignDates} />
            </div>
          </div>
          <Subtitle1 className="mb-2">{type}</Subtitle1>
          <Subtitle2 className="mb-2">
            {dateUsHelper(campaign.startDate)} -{' '}
            {dateUsHelper(campaign.endDate)}
          </Subtitle2>
          <Chip
            label={campaignStatus}
            className={`uppercase ${
              campaignStatus === 'active'
                ? 'bg-green-100 text-green-800  mr-2'
                : ''
            } ${
              campaignStatus === 'passed' || campaignStatus === 'upcoming'
                ? 'bg-gray-100 text-gray-800  mr-2'
                : ''
            } ${
              campaignStatus === 'archived' ? 'bg-primary text-white  mr-2' : ''
            }  ${
              campaignStatus === 'archived' ? 'bg-primary text-white  mr-2' : ''
            } ${
              campaignStatus === 'complete'
                ? 'bg-purple-100 text-purple-800'
                : ''
            }`}
          />
          <Chip
            icon={<MdOutlineDirectionsWalk size={12} />}
            label={`${routesCount || 0} ROUTES`}
            className="bg-indigo-100 text-indigo-600"
          />

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
    </>
  );
}
