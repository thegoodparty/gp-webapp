import Button from '@shared/buttons/Button'
import { Tooltip } from '@mui/material'
import { MouseEvent } from 'react'

export type ValidationField =
  | 'electionFilingLink'
  | 'campaignCommitteeName'
  | 'officeLevel'
  | 'ein'
  | 'phone'
  | 'address'
  | 'website'
  | 'email'
  | 'fecCommitteeId'
  | 'committeeType'

type ValidationMessages = Record<ValidationField, string>

interface TextingComplianceSubmitButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  isValid?: boolean
  hasSubmissionError?: boolean
  failingFields?: ValidationField[]
  officeLevel?: string
}

const fieldDisplayNames: ValidationMessages = {
  electionFilingLink: 'Election Filing Link',
  campaignCommitteeName: 'Campaign Committee Name',
  officeLevel: 'Office Level',
  ein: 'EIN',
  phone: 'Filing Phone',
  address: 'Filing Address',
  website: 'Website',
  email: 'Filing Email',
  fecCommitteeId: 'FEC Committee ID',
  committeeType: 'Committee Type',
}

const getValidationMessage = (
  field: ValidationField,
  officeLevel?: string,
): string => {
  const messages: ValidationMessages = {
    electionFilingLink:
      officeLevel === 'federal'
        ? 'Must be from FEC.gov (e.g., https://fec.gov/data/committee/C00123456)'
        : 'Enter a valid URL with a path (e.g., https://example.com/candidates)',
    campaignCommitteeName:
      'Your official committee name (e.g., "Smith for Council")',
    officeLevel: 'Select an option',
    ein: 'Valid format (XX-XXXXXXX)',
    phone: 'Valid US phone number as it appears on your election filing',
    address: 'Select a valid address as it appears on your election filing',
    website: 'Valid URL',
    email: 'Valid email address as it appears on your election filing',
    fecCommitteeId: 'Must be "C" followed by 8 digits (e.g., C00123456)',
    committeeType: 'Select House, Senate, or Presidential',
  }
  return messages[field]
}

export const TextingComplianceSubmitButton = ({
  onClick = () => {},
  loading = false,
  isValid = true,
  hasSubmissionError = false,
  failingFields = [],
  officeLevel,
}: TextingComplianceSubmitButtonProps): React.JSX.Element => {
  if (hasSubmissionError) {
    return (
      <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Form submission failed. Contact your Political Assistant to complete
          this process or report the issue.
        </p>
      </div>
    )
  }

  const button = (
    <Button
      {...{
        color: 'primary',
        size: 'large',
        className: 'flex-1 md:flex-initial',
        disabled: !isValid || loading,
        onClick,
        loading,
      }}
    >
      Submit
    </Button>
  )

  if (!isValid && failingFields.length > 0) {
    const tooltipContent = (
      <div className="p-1">
        <div className="font-medium mb-1">Please fix the following fields:</div>
        <ul className="list-disc pl-4">
          {failingFields.map((field) => (
            <li key={field}>
              <span className="font-medium">{fieldDisplayNames[field]}</span>
              {' - '}
              {getValidationMessage(field, officeLevel)}
            </li>
          ))}
        </ul>
      </div>
    )

    return (
      <Tooltip title={tooltipContent} arrow placement="top">
        <span>{button}</span>
      </Tooltip>
    )
  }

  return button
}
