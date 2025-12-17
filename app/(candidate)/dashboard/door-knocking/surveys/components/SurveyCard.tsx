import H3 from '@shared/typography/H3'
import Body2 from '@shared/typography/Body2'
import Link from 'next/link'
import { FcSurvey } from 'react-icons/fc'
import Paper from '@shared/utils/Paper'
import SurveyChips from './SurveyChips'

import { EcanvasserSurvey } from '@shared/hooks/EcanvasserSurveyProvider'

interface SurveyCardProps {
  survey?: EcanvasserSurvey
}

export default function SurveyCard(props: SurveyCardProps): React.JSX.Element {
  const { survey } = props
  const { name, description, id } = survey || {}
  return (
    <Link
      href={`/dashboard/door-knocking/surveys/${id}`}
      className="no-underline"
    >
      <Paper className="hover:shadow-lg transition-all duration-300">
        <FcSurvey size={40} className="block my-4" />
        <H3>{name}</H3>
        <Body2>{description}</Body2>
        <SurveyChips survey={survey} />
      </Paper>
    </Link>
  )
}
