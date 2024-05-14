import PrimaryButton from '@shared/buttons/PrimaryButton';
import H3 from '@shared/typography/H3';
import Chip from '@shared/utils/Chip';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { FaHandSparkles } from 'react-icons/fa';
import {
  MdDoorFront,
  MdOutlineCheck,
  MdOutlineDoNotDisturbAlt,
} from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

export function boundsToImage(bounds, overview_polyline) {
  if (!bounds) return false;
  const centerCords = {
    lat: (bounds.northeast.lat + bounds.southwest.lat) / 2,
    lng: (bounds.northeast.lng + bounds.southwest.lng) / 2,
  };

  const center = `${centerCords.lat},${centerCords.lng}`;
  const zoom = 14; // Example zoom level, adjust as needed
  const size = '380x250'; // Map image size in pixels (width x height)
  const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8';
  const path = overview_polyline
    ? `color:#4B3BFF|weight:2|enc:${overview_polyline.points}`
    : false;

  let mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&key=${apiKey}`;
  if (path) {
    mapImageUrl += `&path=${encodeURIComponent(path)}`;
  }
  return mapImageUrl;
}

function RoutePreview(props) {
  const { route, dkCampaign, noCard } = props;
  if (!route.data?.response?.routes && route.data?.response?.routes[0])
    return null;
  const { status, data } = route;
  const { optimizedAddresses } = data;
  if (!optimizedAddresses || optimizedAddresses.length === 0) {
    return null;
  }
  const res = route.data?.response?.routes[0];
  const { bounds, summary, overview_polyline } = res || {};

  const mapImageUrl = boundsToImage(bounds, overview_polyline);

  return (
    <div
      className={`${
        noCard ? '' : 'p-4 rounded-md  border border-slate-300 h-full'
      }`}
    >
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
      <H3 className="mb-2">{summary}</H3>
      {status === 'not-claimed' && (
        <Chip
          className="bg-[#E5DCFF] text-primary"
          icon={<MdOutlineDoNotDisturbAlt className=" opacity-60" />}
          label="UNCLAIMED ROUTE"
        />
      )}
      {status === 'claimed' && (
        <Chip
          className="bg-green-50 text-amber-900"
          icon={<FaHandSparkles />}
          label="CLAIMED ROUTE"
        />
      )}
      {status === 'in-progress' && (
        <Chip
          className="bg-cyan-100 text-cyan-800"
          icon={<TbProgressCheck />}
          label="ROUTE IN PROGRESS"
        />
      )}
      {status === 'completed' && (
        <Chip
          className="bg-teal-50 text-green-700"
          icon={<MdOutlineCheck />}
          label="ROUTE COMPLETED"
        />
      )}
      <div className="mt-2">
        <div className="bg-indigo-50 text-indigo-600  p-2 rounded inline-flex items-center font-medium">
          <MdDoorFront />
          <div className="ml-1 text-xs ">
            {optimizedAddresses?.length || 0} DOORS
          </div>
        </div>
      </div>
      {!noCard ? (
        <div className="mt-4">
          <Link
            href={`/dashboard/door-knocking/campaign/${dkCampaign.slug}/route/${route.id}`}
          >
            <PrimaryButton variant="outlined" fullWidth>
              View Route
            </PrimaryButton>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default memo(RoutePreview);
