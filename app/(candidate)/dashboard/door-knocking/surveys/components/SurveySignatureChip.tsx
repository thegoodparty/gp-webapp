import Body2 from '@shared/typography/Body2'

import Chip from '@shared/utils/Chip'
import { TbSignature } from 'react-icons/tb'

interface Survey {
  requires_signature?: boolean
}

interface SurveySignatureChipProps {
  survey?: Survey
  className?: string
}

export default function SurveySignatureChip({ survey, className = '' }: SurveySignatureChipProps): React.JSX.Element {
  const { requires_signature } = survey || {}
  return (
    <>
      {requires_signature ? (
        <Chip
          className={`mt-4 bg-green-200 text-green-800 ${className}`}
          icon={<TbSignature />}
        >
          <Body2>Signature Required</Body2>
        </Chip>
      ) : (
        <Chip
          className={`mt-4 bg-gray-100 text-gray-800 ${className}`}
          icon={<TbSignature />}
        >
          <Body2>No Signature Required</Body2>
        </Chip>
      )}
    </>
  )
}
