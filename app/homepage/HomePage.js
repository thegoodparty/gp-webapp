import Hero from './Hero'
import FactsSection from './FactsSection'
import P2VSection from './P2VSection'
import ToolsSection from './ToolsSection'
import Cta from './Cta'
import { SlantSection } from '@shared/landing-pages/SlantSection'

export default function HomePage() {
  return (
    <div className="bg-indigo-50">
      <Hero />
      <FactsSection />
      <P2VSection />
      <SlantSection
        colors={['#FCF8F3', '#0D1528', '#0D1528']}
        reverseDirection
      />
      <ToolsSection />
      <SlantSection
        colors={['#0D1528', '#FCF8F3', '#FCF8F3']}
        reverseDirection
      />
      <Cta />
    </div>
  )
}
