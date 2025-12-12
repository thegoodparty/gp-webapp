import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import SurveyChips from '../../components/SurveyChips'
import EditSurvey from './EditSurvey'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'
import type { EcanvasserSurvey } from '@shared/hooks/EcanvasserSurveyProvider'

export default function SurveyHeader(): React.JSX.Element {
  const [survey] = useEcanvasserSurvey()
  if (!survey || typeof survey === 'function') {
    return <></>
  }
  const { name, description } = survey as EcanvasserSurvey
  return (
    <>
      <div className="md:flex justify-between items-center">
        <H1 className="mb-4">{name}</H1>
        <EditSurvey />
      </div>
      <Body2 className="mt-2">{description}</Body2>
      <SurveyChips survey={survey as EcanvasserSurvey as { [key: string]: string | number | boolean | object | null }} />
    </>
  )
}
