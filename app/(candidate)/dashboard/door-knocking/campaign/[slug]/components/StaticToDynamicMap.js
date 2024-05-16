'use client';
import Image from 'next/image';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const DynamicGoogleMap = dynamic(() => import('./DynamicGoogleMap'), {
  loading: () => <p className="p-4 text-center text-xl">Loading Map...</p>,
});

const StaticToDynamicMap = ({
  mapImageUrl,
  route,
  center,
  slug,
  allowDynamic,
}) => {
  const [dynamicMode, setDynamicMode] = useState(false);
  const toggleDynamicMode = () => {
    if (allowDynamic) {
      setDynamicMode(!dynamicMode);
    }
  };

  const coordinates = route.data.optimizedAddresses.map((address) => {
    return {
      lat: parseFloat(address.lat),
      lng: parseFloat(address.lng),
      url: `/volunteer-dashboard/door-knocking/${slug}/route/${route.id}/address/${address.voterId}`,
    };
  });
  return (
    <div
      className={` ${
        dynamicMode
          ? 'h-[calc(100vh-220px)] mb-12'
          : 'h-[316px] overflow-hidden'
      }`}
    >
      {dynamicMode ? (
        <div>
          <div
            className=" cursor-pointer mb-2 flex items-center justify-end"
            onClick={toggleDynamicMode}
          >
            <div className="mr-3">Back to small map</div>

            <IoMdCloseCircleOutline />
          </div>
          <DynamicGoogleMap
            center={center}
            zoom={14}
            coordinates={coordinates}
          />
        </div>
      ) : (
        <div
          className={`relative ${allowDynamic ? 'cursor-pointer' : ''}`}
          onClick={toggleDynamicMode}
        >
          <Image
            src={mapImageUrl}
            alt="map"
            width={380}
            height={250}
            className="w-full h-auto"
          />
          <div className="absolute w-full left-0 bottom-0 h-7 bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default StaticToDynamicMap;
