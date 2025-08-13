import MaxWidth from '@shared/layouts/MaxWidth'
import Hero from './Hero'
import OfficeCard from './OfficeCard'
import ContentSection from './ContentSection'
import PledgeSection from './PledgeSection'
import BuildSection from './BuildSection'
import CtaSection from './CtaSection'

export default function CandidatePage(props) {
  return (
    <div className=" text-white">
      <Hero />
      <div className="bg-cream-500">
        <MaxWidth>
          <div className="lg:flex">
            <OfficeCard />
            <ContentSection />
          </div>
        </MaxWidth>
      </div>
      <div id="sticky-end" className=" bg-cream-500">
        &nbsp;
      </div>
      <div className="h-12 lg:h-16 bg-cream-500"></div>
      <PledgeSection />
      <BuildSection />
      <CtaSection />
    </div>
  )
}
