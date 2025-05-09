import AboutCard from './AboutCard'
import FreeToolsCard from './FreeToolsCard'
import OfficeCard from './OfficeCard'
import TopIssuesCard from './TopIssuesCard'

export default function ContentSection(props) {
  const { candidate } = props

  return (
    <div className="grid grid-cols-12 gap-4 mb-4 pt-5">
      <div className="col-span-12">
        <FreeToolsCard />
      </div>
      <div className="col-span-12 md:col-span-6">
        <AboutCard {...props} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <OfficeCard {...props} />
        <TopIssuesCard candidate={candidate} maxToShow={3} />
      </div>
    </div>
  )
}
