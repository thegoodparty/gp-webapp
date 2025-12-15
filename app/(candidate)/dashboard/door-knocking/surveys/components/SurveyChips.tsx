import SurveyStatusChip from './SurveyStatusChip'
import SurveySignatureChip from './SurveySignatureChip'
import SurveyQuestionsChip from './SurveyQuestionsChip'
import type { EcanvasserSurvey } from '@shared/hooks/EcanvasserSurveyProvider'

interface SurveyChipsProps {
  survey: EcanvasserSurvey
}

export default function SurveyChips(
  props: SurveyChipsProps,
): React.JSX.Element {
  const { survey } = props
  return (
    <div className="mt-4 flex">
      <SurveyStatusChip survey={survey} />
      <SurveySignatureChip survey={survey} className="ml-4" />
      <SurveyQuestionsChip survey={survey} className="ml-4" />
    </div>
  )
}
