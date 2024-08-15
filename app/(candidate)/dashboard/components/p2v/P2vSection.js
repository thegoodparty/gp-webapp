import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { P2vTitle } from './P2vTitle';
import { CurrentPhase } from './CurrentPhase';
import { ContactedBarSection } from './ContactedBarSection';

export function P2vSection(props) {
  return (
    <Paper className="mb-4">
      <P2vTitle />
      <CurrentPhase {...props} />
      <ContactedBarSection {...props} />
    </Paper>
  );
}
