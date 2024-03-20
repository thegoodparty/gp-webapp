import PrimaryButton from '@shared/buttons/PrimaryButton';
import H3 from '@shared/typography/H3';
import Image from 'next/image';
import Link from 'next/link';
import { FaHandSparkles } from 'react-icons/fa';
import {
  MdDoorFront,
  MdOutlineCheck,
  MdOutlineDoNotDisturbAlt,
} from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

export default function RoutePreview(props) {
  const { route } = props;
  if (!route.data?.response?.routes && route.data?.response?.routes[0])
    return null;
  const { status, data } = route;
  const { optimizedAddresses } = data;
  const res = route.data?.response?.routes[0];
  const { bounds, summary, overview_polyline } = res;
  if (!bounds) return null;
  const centerCords = {
    lat: (bounds.northeast.lat + bounds.southwest.lat) / 2,
    lng: (bounds.northeast.lng + bounds.southwest.lng) / 2,
  };

  const center = `${centerCords.lat},${centerCords.lng}`;
  const zoom = 14; // Example zoom level, adjust as needed
  const size = '380x250'; // Map image size in pixels (width x height)
  const apiKey = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8'; // Make sure to use your actual API key
  const path = `color:#4B3BFF|weight:2|enc:${overview_polyline.points}`;

  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&path=${encodeURIComponent(
    path,
  )}&zoom=${zoom}&size=${size}&key=${apiKey}`;

  return (
    <div className="p-4 rounded-md shadow border border-slate-300 h-full">
      <Image
        src={mapImageUrl}
        alt="map"
        width={380}
        height={250}
        className="w-full h-auto"
      />
      <H3 className="mb-2 mt-4">{summary}</H3>
      {status === 'not-claimed' && (
        <div className="bg-[#E5DCFF] p-2 rounded inline-flex items-center font-medium">
          <MdOutlineDoNotDisturbAlt className=" opacity-60" />
          <div className="ml-1 text-xs opacity-60">UNCLAIMED ROUTE</div>
        </div>
      )}
      {status === 'claimed' && (
        <div className="bg-green-50 text-amber-900 p-2 rounded inline-flex items-center font-medium">
          <FaHandSparkles />
          <div className="ml-1 text-xs">CLAIMED ROUTE</div>
        </div>
      )}
      {status === 'in progress' && (
        <div className="bg-cyan-100 text-cyan-800  p-2 rounded inline-flex items-center font-medium">
          <TbProgressCheck />
          <div className="ml-1 text-xs ">ROUTE IN PROGRESS</div>
        </div>
      )}
      {status === 'completed' && (
        <div className="bg-teal-50 text-green-700  p-2 rounded inline-flex items-center font-medium">
          <MdOutlineCheck />
          <div className="ml-1 text-xs ">ROUTE COMPLETED</div>
        </div>
      )}
      <div className="mt-2">
        <div className="bg-slate-50 text-indigo-600  p-2 rounded inline-flex items-center font-medium">
          <MdDoorFront />
          <div className="ml-1 text-xs ">
            {optimizedAddresses.length || 0} DOORS
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`${route.id}`}>
          <PrimaryButton variant="outlined" fullWidth>
            View Route
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
