import MaxWidth from '@shared/layouts/MaxWidth'
import Hero from './Hero'
import OfficeCard from './OfficeCard'
import ContentSection from './ContentSection'

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
      <div id="sticky-end" className="h-4 bg-cream-500">
        &nbsp;
      </div>
    </div>
  )
}
