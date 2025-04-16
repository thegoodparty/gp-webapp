import Body1 from '@shared/typography/Body1'
import { dateUsHelper } from 'helpers/dateHelper'
import { PositionsListItem } from './PositionsListItem'

function processAndSort(strings) {
  try {
    return strings
      .map((s) => {
        let label = '',
          number = 0,
          original = s
        if (s.includes(' - District ')) {
          label = 'District'
          number = parseInt(s.split(' - District ')[1], 10)
        } else if (s.includes(' - Office ')) {
          label = 'Office'
          number = parseInt(s.split(' - Office ')[1], 10)
        } else {
          return { original, sortKey: Infinity } // Keep original and set sort key to ensure it goes to the end
        }
        return { label, number, sortKey: number, original }
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((item) =>
        item.label ? `${item.label} ${item.number}` : item.original,
      )
  } catch (e) {
    return strings
  }
}

export default function PositionDetails({ race, positions }) {
  const {
    positionLevel,
    filingDateStart,
    filingDateEnd,
    frequency,
    employmentType,
    partisanType,
    salary,
    positionDescription,
    eligibilityRequirements,
    filingOfficeAddress,
    filingPhoneNumber,
    paperworkInstructions,
    filingRequirements,
    isRunoff,
    isPrimary,
  } = race
  const term = frequency?.[0] || 'N/A'
  const cleanPositions = processAndSort(positions)
  return (
    <section className="grid grid-cols-12 gap-4 mt-6 md:mt-12">
      <div className="col-span-12 md:col-span-6">
        <h3 className=" text-lg md:text-2xl">Election Details</h3>
        <ul className="text-lg">
          <li className=" leading-loose">
            Office level:{' '}
            <span className="font-normal capitalize">
              {positionLevel?.toLowerCase() || 'N/A'}
            </span>
          </li>
          <li className=" leading-loose">
            Length of term: <span className="font-normal">{term} years</span>
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
            Is this a runoff election?{' '}
            <span className="font-normal">{isRunoff ? 'Yes' : 'No'}</span>
          </li>
          <li className=" leading-loose">
            Is this a primary election?{' '}
            <span className="font-normal">{isPrimary ? 'Yes' : 'No'}</span>
          </li>
          <li className=" leading-loose">
            Filing period:{' '}
            <span className="font-normal">
              {dateUsHelper(filingDateStart) || 'N/A'} -{' '}
              {dateUsHelper(filingDateEnd) || 'N/A'}
            </span>
          </li>
          <PositionsListItem positions={cleanPositions} />
        </ul>
      </div>
      <div className="col-span-12 md:col-span-6 ">
        <h3 className="text-2xl font-medium">Job description</h3>
        <Body1 className="mt-6 mb-12">{positionDescription || 'N/A'}</Body1>
        <h3 className="text-2xl font-medium">Eligibility requirements</h3>
        <Body1 className="mt-6 mb-12">{eligibilityRequirements || 'N/A'}</Body1>
        <h3 className="text-2xl font-medium">Filing instructions</h3>
        {filingOfficeAddress && (
          <Body1 className="mt-6">
            Filing office address: {filingOfficeAddress}
          </Body1>
        )}
        {filingPhoneNumber && (
          <Body1 className="mt-1">
            Filing phone number: {filingPhoneNumber}
          </Body1>
        )}
        {paperworkInstructions && (
          <Body1 className="mt-1">
            Paperwork instructions: {paperworkInstructions}
          </Body1>
        )}
        {filingRequirements && (
          <Body1 className="mt-1">
            Filing requirements: {filingRequirements}
          </Body1>
        )}
      </div>
    </section>
  )
}
