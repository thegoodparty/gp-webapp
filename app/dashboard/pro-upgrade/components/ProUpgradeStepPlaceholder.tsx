import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'

interface ProUpgradeStepPlaceholderProps {
  title: string
  // Which epic task lands the real screen for this step. Foundation-only
  // placeholder: tasks 06–15 replace each step page's body.
  taskNote: string
}

// Temporary content for a wizard step whose real screen ships in a later task.
// Lets the route tree, shell, and step-derivation router work end-to-end now.
const ProUpgradeStepPlaceholder = ({
  title,
  taskNote,
}: ProUpgradeStepPlaceholderProps): React.JSX.Element => (
  <>
    <H2 className="mb-2">{title}</H2>
    <Body2 className="text-gray-600">{taskNote}</Body2>
  </>
)

export default ProUpgradeStepPlaceholder
