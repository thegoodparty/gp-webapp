import Body1 from '@shared/typography/Body1';
import { dateUsHelper } from 'helpers/dateHelper';

export default function PoistionDetails({ race, positions }) {
  const {
    level,
    filingDateStart,
    filingDateEnd,
    frequency,
    employmentType,
    partisanType,
    salary,
    positionDescription,
    eligibilityRequirements,
  } = race;
  const term = frequency.match(/\d+/g);
  return (
    <section className="grid grid-cols-12 gap-4 mt-6 md:mt-12">
      <div className="col-span-12 md:col-span-6 text-lg md:text-2xl font-medium">
        <h3>Election Details</h3>
        <ul>
          <li className=" leading-loose">
            Office level:{' '}
            <span className="font-normal capitalize">{level || 'N/A'}</span>
          </li>
          <li className=" leading-loose">
            Length of term:{' '}
            <span className="font-normal">{term || 'N/A'} years</span>
          </li>
          <li className=" leading-loose">
            Commitment level:{' '}
            <span className="font-normal">{employmentType || 'N/A'}</span>
          </li>
          <li className=" leading-loose">
            Affiliation:{' '}
            <span className="font-normal capitalize">
              {partisanType || 'N/A'}
            </span>
          </li>
          <li className=" leading-loose">
            Typical salary:{' '}
            <span className="font-normal">{salary || 'N/A'}</span>
          </li>
          <li className=" leading-loose">
            Filing period:{' '}
            <span className="font-normal">
              {dateUsHelper(filingDateStart) || 'N/A'} -{' '}
              {dateUsHelper(filingDateEnd) || 'N/A'}
            </span>
          </li>
          <li className=" leading-loose">
            Positions:
            <span className="font-normal">
              {positions.map((position) => (
                <div key={position}>{position}</div>
              ))}
            </span>
          </li>
        </ul>
      </div>
      <div className="col-span-12 md:col-span-6 ">
        <h3 className="text-2xl font-medium">Job description</h3>
        <Body1 className="mt-6 mb-12">{positionDescription || 'N/A'}</Body1>
        <h3 className="text-2xl font-medium">Eligibility requirements</h3>
        <Body1 className="mt-6">{eligibilityRequirements || 'N/A'}</Body1>
      </div>
    </section>
  );
}
