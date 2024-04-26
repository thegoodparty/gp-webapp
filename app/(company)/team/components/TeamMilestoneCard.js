import Image from 'next/image';

export const MONTHS = [
  { month: 'January', abbreviation: 'Jan' },
  { month: 'February', abbreviation: 'Feb' },
  { month: 'March', abbreviation: 'Mar' },
  { month: 'April', abbreviation: 'Apr' },
  { month: 'May', abbreviation: 'May' },
  { month: 'June', abbreviation: 'Jun' },
  { month: 'July', abbreviation: 'Jul' },
  { month: 'August', abbreviation: 'Aug' },
  { month: 'September', abbreviation: 'Sep' },
  { month: 'October', abbreviation: 'Oct' },
  { month: 'November', abbreviation: 'Nov' },
  { month: 'December', abbreviation: 'Dec' },
];

const getMonthAbbreviation = (month) => {
  const monthObj = MONTHS.find(
    (m) => m.month.toLowerCase() === month.toLowerCase(),
  );
  return monthObj ? monthObj.abbreviation : '';
};

export const TeamMilestoneCard = ({
  month,
  year,
  blurb,
  image: { url, alt },
}) => (
  <div className="px-2 carousel-item-wrap">
    <div>
      <Image
        className="rounded-t-3xl border-x-2 border-t-2 object-cover object-top h-[224px] w-full"
        src={`https:${url}`}
        alt={alt}
        width={405}
        height={224}
      />
      <div className="bg-white border-x-2 border-b-2 p-6 md:py-8 rounded-b-3xl">
        <h3 className="text-mint-900 text-5xl font-medium leading-tight mb-2">
          {getMonthAbbreviation(month)} {year}
        </h3>
        <p className="font-sfpro text-gray-600 min-h-[83px]">{blurb}</p>
      </div>
    </div>
  </div>
);
