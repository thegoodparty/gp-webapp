import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { slugify } from 'helpers/articleHelper';
import { dateUsHelper } from 'helpers/dateHelper';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Race({ race }) {
  const { positionName, positionDescription, date, level } = race;
  const slug = slugify(positionName, true);
  let color = '';
  if (level === 'state') {
    color = '#F5FFFC';
  } else if (level === 'county') {
    color = '#3ABBEA';
  }
  return (
    <Link
      href={`/elections/${slug}/${race.hashId}/`}
      className="no-underline"
      id={`office-${slug}-${race.hashId}`}
    >
      <div
        className={` py-5 px-5 mb-3 rounded-lg transition-colors ${
          level === 'state'
            ? 'bg-[#F5FFFC] hover:bg-[rgba(51,225,178,0.8)]'
            : ''
        } ${
          level === 'county'
            ? 'bg-[#F5FFFC] hover:bg-[rgba(58,187,234,0.5)]'
            : ''
        }`}
      >
        <div className="grid-cols-12 gap-3 grid items-center">
          <div className="col-span-12 md:col-span-9">
            <H3>{positionName}</H3>
            <Body2 className="line-clamp-4 mt-1">{positionDescription}</Body2>
          </div>
          <div className="col-span-6 md:col-span-2 text-center">
            {dateUsHelper(date)}
          </div>
          {/* <div className="col-span-6 md:col-span-2">12</div> */}
          <div className="col-span-12 md:col-span-1 flex justify-end">
            <FaArrowRightLong className="mr-2" />
          </div>
        </div>
      </div>
    </Link>
  );
}
