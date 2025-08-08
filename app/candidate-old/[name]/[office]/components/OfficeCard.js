import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'
import DescriptionLabel from './DescriptionLabel'
import { FaMapMarkerAlt } from 'react-icons/fa'
import H5 from '@shared/typography/H5'

export default function OfficeCard(props) {
  const { candidate } = props
  const { positionName, placeName, state, positionDescription, electionFrequency } = candidate

  const descLabels = [
    { title: 'about role', description: positionDescription },
    { title: 'term', description: electionFrequency?.length
        ? `${electionFrequency[0]} years`
        : 'Unknown' },
  ]

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl">
      <Overline className="text-gray-400 mb-2">Running for</Overline>
      <MarketingH4>{positionName}</MarketingH4>
      <div className="flex mt-2 mb-8 items-center">
        <FaMapMarkerAlt className="text-secondary-light mr-2" size={20} />
        <H5>
          {placeName ? `${placeName}, ` : ''} {state}
        </H5>
      </div>
      {descLabels.map((item) => (
        <DescriptionLabel
          key={item.title}
          title={item.title}
          description={item.description}
        />
      ))}
    </section>
  )
}
