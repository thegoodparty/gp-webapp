import Paper from '@shared/utils/Paper'
import { P2vTitle } from './P2vTitle'
import { CurrentPhase } from './CurrentPhase'
import { ContactedBarSection } from './ContactedBarSection'

export function P2vSection(props) {
  return (
    <Paper className="mb-4">
      <P2vTitle {...props} />
      <CurrentPhase campaign={props.campaign} />
      <ContactedBarSection {...props} />
    </Paper>
  )
}
