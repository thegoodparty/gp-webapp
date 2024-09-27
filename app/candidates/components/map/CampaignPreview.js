import { useContext } from 'react';
import { MapContext } from './MapSection';
import { IoClose } from 'react-icons/io5';
import {
  MdBeenhere,
  MdCalendarMonth,
  MdGroupWork,
  MdLocationOn,
  MdWorkHistory,
} from 'react-icons/md';

import Image from 'next/image';
import MarketingH5 from '@shared/typography/MarketingH5';
import Body1 from '@shared/typography/Body1';
import { dateUsHelper } from 'helpers/dateHelper';

export default function CampaignPreview() {
  const { selectedCampaign, onSelectCampaign } = useContext(MapContext);
  if (!selectedCampaign) {
    return null;
  }

  const {
    party,
    firstName,
    lastName,
    office,
    city,
    county,
    state,
    avatar,
    electionDate,
    didWin,
  } = selectedCampaign;
  return (
    <div className="absolute top-0 p-4 md:p-0 left-4 w-[calc(100vw-32px)]   md:left-[416px] lg:left-[516px] md:w-[320px]   md:shadow md:mt-4  rounded-2xl z-50">
      <div className="h-full bg-white p-4 rounded-2xl shadow-md md:shadow-none">
        <div className="flex justify-end">
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              onSelectCampaign(false);
            }}
          >
            <IoClose size={24} />
          </div>
        </div>
        <div className="flex justify-between">
          {avatar && (
            <div className="inline-block border border-primary rounded-2xl relative w-28 h-28">
              <Image
                src={avatar}
                fill
                alt={`${firstName} ${lastName}`}
                priority
                unoptimized
                className="rounded-2xl w-28 h-28 object-cover object-center"
              />
            </div>
          )}
        </div>
        <MarketingH5 className="mb-4">
          {firstName} {lastName}
        </MarketingH5>
        {office && (
          <div className="flex mb-3 items-center">
            <MdWorkHistory size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">{office}</Body1>
          </div>
        )}
        {state && (
          <div className="flex mb-3 items-center">
            <MdLocationOn size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">
              {city ? `${city}, ` : ''}
              {county ? `${county}, ` : ''}
              {state}
            </Body1>
          </div>
        )}
        {party && (
          <div className="flex mb-3 items-center">
            <MdGroupWork size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">{party}</Body1>
          </div>
        )}
        {electionDate && (
          <div className="flex mb-3 items-center">
            <MdCalendarMonth size={20} className="text-primary-light" />
            <Body1 className="ml-2 gray-600">
              Election Day: {dateUsHelper(electionDate)}
            </Body1>
          </div>
        )}
        <div className="flex mb-3 items-center">
          <MdBeenhere size={20} className="text-primary-light" />
          <Body1 className="ml-2 gray-600">
            Election Results: {didWin ? 'Winner' : 'Upcoming'}
          </Body1>
        </div>
      </div>
    </div>
  );
}
