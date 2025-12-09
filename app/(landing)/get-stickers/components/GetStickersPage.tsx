import Hero from './Hero'
import BrightenSection from './BrightenSection'
import FormSection from './FormSection'
import MostAmericans from './MostAmericans'

export default function GetStickersPage(): React.JSX.Element {
  return (
    <div>
      <Hero />
      <BrightenSection />
      <FormSection />
      <MostAmericans />
    </div>
  )
}
