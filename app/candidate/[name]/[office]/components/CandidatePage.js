import MaxWidth from '@shared/layouts/MaxWidth'
import Hero from './Hero'

export default function CandidatePage(props) {
  return (
    <div className="bg-black text-white">
      <Hero />
      <div className="bg-cream-500">
        <MaxWidth>
          <div className="h-48 "></div>
          {/* <CandidateCard {...props} />

        <ContentSection {...props} />
        <div id="candidate-footer" className="mb-4"></div>
        <div>&nbsp;</div> */}
        </MaxWidth>
      </div>
    </div>
  )
}
