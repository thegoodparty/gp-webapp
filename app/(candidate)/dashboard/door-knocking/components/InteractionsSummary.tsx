'use client'
import H2 from '@shared/typography/H2'
import Caption from '@shared/typography/Caption'
import Paper from '@shared/utils/Paper'
import { EcanvasserSummary } from './DoorKnockingPage'

interface InteractionsSummaryProps {
  summary?: EcanvasserSummary
}

interface Field {
  label: string
  value: number | string
}

const InteractionsSummary = ({ summary }: InteractionsSummaryProps): React.JSX.Element => {
  const { totalInteractions, interactions, averageRating } = summary || {}
  const {
    answered,
    'call-back': callBack,
    refused,
    'not-home': notHome,
    inaccessible: inaccessible,
  } = interactions || {}

  const fields: Field[] = [
    {
      label: 'Interactions',
      value: totalInteractions || 0,
    },
    {
      label: 'Answered',
      value: answered || 0,
    },
    {
      label: 'Call Back',
      value: callBack || 0,
    },
    {
      label: 'Refused',
      value: refused || 0,
    },
    {
      label: 'Not Home',
      value: notHome || 0,
    },
    {
      label: 'Inaccessible',
      value: inaccessible || 0,
    },
    {
      label: 'Avg. Rating',
      value: averageRating ? averageRating.toFixed(2) : 0,
    },
    {
      label: 'Conversion Rate',
      value: `${
        totalInteractions
          ? (((answered || 0) * 100) / totalInteractions).toFixed(2)
          : 0
      }%`,
    },
  ]
  return (
    <Paper className="md:p-6">
      <H2 className="mb-8">Interactions Summary</H2>
      <div className="grid grid-cols-12 gap-2">
        {fields.map((field) => (
          <div
            className="col-span-6 md:col-span-4 lg:col-span-3 h-full"
            key={field.label}
          >
            <div className="p-3 border rounded-lg border-gray-200 h-full">
              <Caption>{field.label}</Caption>
              <p className="text-3xl  xl:text-4xl font-semibold">
                {field.value || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}

export default InteractionsSummary
