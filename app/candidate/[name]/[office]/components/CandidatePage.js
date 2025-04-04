import HelpBanner from './HelpBanner'
import CandidateCard from './CandidateCard'
import ContentSection from './ContentSection'

export default function CandidatePage(props) {
  return (
    <div className="bg-black text-white">
      <HelpBanner {...props} />
      <div className="max-w-[1440px] mx-auto px-4 xl:p-0 pt-4 lg:flex">
        <CandidateCard {...props} />

        <ContentSection {...props} />
        <div id="candidate-footer" className="mb-4"></div>
        <div>&nbsp;</div>
      </div>
    </div>
  )
}
