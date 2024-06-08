import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H5 from '@shared/typography/H5';
import Overline from '@shared/typography/Overline';
import { FaGlobeAmericas, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebookF, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';
import { MdEmail, MdStars } from 'react-icons/md';

export default function CandidateCard(props) {
  const { candidate } = props;
  const { firstName, lastName, party, office, city, state } = candidate;

  let partyName = '';
  if (party === 'Independent') {
    partyName = 'Non-Partisan Candidate';
  }

  return (
    <div className=" bg-primary-dark p-6 rounded-2xl border border-gray-700">
      <div className="flex justify-between">
        <div className="bg-primary inline-block border border-white rounded-2xl p-4">
          <IoPersonSharp size={60} />
        </div>
        <div>
          <div className="bg-secondary-light text-black py-2 px-4 rounded">
            <Overline>UNCLAIMED</Overline>
          </div>
        </div>
      </div>
      <Overline className="my-4">{partyName}</Overline>
      <H1 className="mb-4">
        {firstName} {lastName}
      </H1>
      <div className="flex mb-3 items-center">
        <MdStars className="text-secondary-light" size={20} />
        <H5 className="ml-2">{party}</H5>
      </div>
      <div className="flex mb-3 items-center">
        <IoPersonSharp className="text-secondary-light" size={20} />
        <H5 className="ml-2">Running for {office}</H5>
      </div>
      <div className="flex mb-3 items-center">
        <FaMapMarkerAlt className="text-secondary-light" size={20} />
        <H5 className="ml-2">
          {city}, {state}
        </H5>
      </div>
      <Body1 className="mt-7 mb-8">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium.
      </Body1>

      <div className=" flex justify-between items-center opacity-50">
        <MdEmail size={20} />
        <FaGlobeAmericas size={20} />
        <FaXTwitter size={20} />
        <FaFacebookF size={20} />
        <FaInstagram size={20} />
        <FaTiktok size={20} />
      </div>
    </div>
  );
}
