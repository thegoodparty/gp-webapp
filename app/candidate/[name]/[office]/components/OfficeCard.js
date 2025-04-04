import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'
import DescriptionLabel from './DescriptionLabel'
import { FaMapMarkerAlt } from 'react-icons/fa'
import H5 from '@shared/typography/H5'

export default function OfficeCard(props) {
  const { candidate } = props
  const { office, city, state, officeDescription, term, salary } = candidate

  const descLabels = [
    { title: 'about role', description: officeDescription },
    { title: 'term', description: term },
    { title: 'salary', description: salary },
  ]

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl">
      <Overline className="text-gray-400 mb-2">Running for</Overline>
      <MarketingH4>{office}</MarketingH4>
      <div className="flex mt-2 mb-8 items-center">
        <FaMapMarkerAlt className="text-secondary-light mr-2" size={20} />
        <H5>
          {city ? `${city}, ` : ''} {state}
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
