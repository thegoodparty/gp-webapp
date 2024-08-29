import { useContext } from 'react';
import { MapContext } from './CandidatesPage';
import CandidateCard from 'app/candidate/[name]/[office]/components/CandidateCard';
import { IoPersonSharp } from 'react-icons/io5';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdStars } from 'react-icons/md';
import Overline from '@shared/typography/Overline';
import H2 from '@shared/typography/H2';
import H5 from '@shared/typography/H5';
import Image from 'next/image';

export default function CampaignPreview() {
  const { selectedCampaign } = useContext(MapContext);
  if (!selectedCampaign) {
    return null;
  }

  const { party, firstName, lastName, office, city, state, avatar } =
    selectedCampaign;
  return (
    <div className="absolute top-0 left-0 md:left-[316px] lg:left-[416px] md:w-[300px] lg:w-[400px]  md:h-full  shadow-lg py-4">
      <div className="h-full bg-white p-4 rounded-2xl">
        <div className="flex justify-between">
          {avatar ? (
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
          ) : (
            <div className="inline-block border border-primary rounded-2xl p-4">
              <IoPersonSharp size={60} />
            </div>
          )}
        </div>
        <Overline className="my-4">{party}</Overline>
        <H2 className="mb-4">
          {firstName} {lastName}
        </H2>
        <div className="flex mb-3 items-center">
          <MdStars className="text-blue" size={20} />
          <H5 className="ml-2">{party}</H5>
        </div>
        <div className="flex mb-3 items-center">
          <IoPersonSharp className="text-blue" size={20} />
          <H5 className="ml-2">Running for {office}</H5>
        </div>
        <div className="flex  items-center mb-8">
          <FaMapMarkerAlt className="text-blue" size={20} />
          <H5 className="ml-2">
            {city ? `${city}, ` : ''}
            {state}
          </H5>
        </div>
      </div>
    </div>
  );
}
