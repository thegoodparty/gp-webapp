'use client'
import TextField from '@shared/inputs/TextField'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import {
  FecCommitteeIdInput,
  isValidFecCommitteeId,
  getFecCommitteeIdValidation,
} from 'app/(user)/profile/texting-compliance/register/components/FecCommitteeIdInput'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState, type ComponentProps } from 'react'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import { EinCheckInput } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
import isURL from 'validator/es/lib/isURL'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isEmail from 'validator/es/lib/isEmail'
import isFilled from '@shared/inputs/IsFilled'
import AddressAutocomplete from '@shared/AddressAutocomplete'
import TextingComplianceFooter from 'app/(user)/profile/texting-compliance/shared/TextingComplianceFooter'
import { TextingComplianceSubmitButton, type ValidationField } from 'app/(user)/profile/texting-compliance/shared/TextingComplianceSubmitButton'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { urlIncludesPath } from 'helpers/urlIncludesPath'
import Body2 from '@shared/typography/Body2'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import type { FormDataState } from '@shared/hooks/useFormData'

type AddressValue = Parameters<
  NonNullable<ComponentProps<typeof AddressAutocomplete>['onSelect']>
>[0]

type FormValue = FormDataState[keyof FormDataState] | undefined

const isAddressValue = (value: FormValue): value is AddressValue =>
  Boolean(value && typeof value === 'object' && 'formatted_address' in value)

const getStringValue = (value: FormValue): string =>
  typeof value === 'string' ? value : ''

const validateAddress = (address: AddressValue | null): boolean =>
  Boolean(address?.formatted_address)

const validateFECUrl = (url: string): boolean => {
  if (!url) return false
  // Must be from fec.gov AND include a path (not just the domain)
  return /fec\.gov/i.test(url) && urlIncludesPath(url)
}

type ValidationResult = {
  validations: Record<ValidationField, boolean>
  isValid: boolean
}

const getFailingFields = (
  validations: Record<ValidationField, boolean>
): ValidationField[] => {
  const fields: ValidationField[] = []
  let key: ValidationField
  for (key in validations) {
    if (!validations[key]) {
      fields.push(key)
    }
  }
  return fields
}

export const validateRegistrationForm = (data: FormDataState): ValidationResult => {
  const {
    electionFilingLink,
    campaignCommitteeName,
    officeLevel,
    ein,
    phone,
    address,
    website,
    email,
    fecCommitteeId,
    committeeType,
  } = data

  const electionFilingLinkValue = getStringValue(electionFilingLink)
  const campaignCommitteeNameValue = getStringValue(campaignCommitteeName)
  const officeLevelValue = getStringValue(officeLevel)
  const einValue = getStringValue(ein)
  const phoneValue = getStringValue(phone)
  const addressValue = isAddressValue(address) ? address : null
  const websiteValue = getStringValue(website)
  const emailValue = getStringValue(email)
  const fecCommitteeIdValue = getStringValue(fecCommitteeId)
  const committeeTypeValue = getStringValue(committeeType)

  const baseValidations: Record<ValidationField, boolean> = {
    electionFilingLink:
      isURL(electionFilingLinkValue) &&
      urlIncludesPath(electionFilingLinkValue),
    campaignCommitteeName: isFilled(campaignCommitteeNameValue),
    officeLevel: ['federal', 'state', 'local'].includes(officeLevelValue),
    ein: Boolean(isValidEIN(einValue)),
    phone: isMobilePhone(phoneValue, 'en-US'),
    // TODO: We should do idiomatic "recommended address" validation flow here,
    //  and elsewhere, to have higher degree of confidence that the address
    //  entered is valid
    address: validateAddress(addressValue),
    // Website must exist (official purchased domain)
    website: isFilled(websiteValue) && isURL(websiteValue),
    email: isEmail(emailValue),
    fecCommitteeId: true, // Not required for non-federal
    committeeType: true, // Not required for non-federal
  }

  // Add federal-specific validations
  if (officeLevelValue === 'federal') {
    const validCommitteeTypes = ['H', 'S', 'P']
    const federalValidations = {
      ...baseValidations,
      electionFilingLink: validateFECUrl(electionFilingLinkValue),
      fecCommitteeId: isValidFecCommitteeId(fecCommitteeIdValue),
      committeeType: validCommitteeTypes.includes(committeeTypeValue),
    }

    return {
      validations: federalValidations,
      isValid: Object.values(federalValidations).every(Boolean),
    }
  }

  return {
    validations: baseValidations,
    isValid: Object.values(baseValidations).every(Boolean),
  }
}

interface TextingComplianceRegistrationFormProps {
  onSubmit?: (formData: FormDataState) => void
  loading?: boolean
  hasSubmissionError?: boolean
}

const TextingComplianceRegistrationForm = ({
  onSubmit = () => { },
  loading = false,
  hasSubmissionError = false,
}: TextingComplianceRegistrationFormProps): React.JSX.Element => {
  const { formData, handleChange } = useFormData()
  const {
    electionFilingLink,
    campaignCommitteeName,
    officeLevel,
    ein,
    phone,
    address,
    email,
  } = formData
  const formValidation = validateRegistrationForm(formData)
  const { isValid, validations } = formValidation
  const failingFields = getFailingFields(validations)

  const addressValue = isAddressValue(address) ? address : null
  const [addressInputValue, setAddressInputValue] = useState<string | undefined>(
    addressValue?.formatted_address || '',
  )

  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(getStringValue(ein)))
  const handleEINChange = (value: string) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  const [validFecCommitteeId, setValidFecCommitteeId] = useState(
    getFecCommitteeIdValidation(getStringValue(formData.fecCommitteeId)),
  )
  const handleFecCommitteeIdChange = (value: string) => {
    setValidFecCommitteeId(getFecCommitteeIdValidation(value))
    handleChange({ fecCommitteeId: value })
  }

  const handleOnSubmit = () => {
    trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceFormSubmitted, {
      source: 'compliance_flow'
    })
    // Federal: include fecCommitteeId and committeeType (H/S/P) as entered
    // Non-federal: exclude fecCommitteeId, set committeeType to 'CA' (Candidate)
    const { fecCommitteeId, committeeType, ...baseFormData } = formData
    const submitData = officeLevel === 'federal'
      ? formData
      : { ...baseFormData, committeeType: 'CA' }
    return onSubmit(submitData)
  }

  const handleAddressOnChange = (value: string) => {
    setAddressInputValue(value)
    return !value && handleChange({ address: null })
  }

  return (
    <>
      <TextingComplianceForm>
        <FormControl fullWidth required variant="outlined">
          <InputLabel>Office Level</InputLabel>
          <Select
            label="Office Level"
            value={officeLevel || ''}
            onChange={(e) => handleChange({ officeLevel: e.target.value })}
          >
            <MenuItem value="federal">Federal</MenuItem>
            <MenuItem value="state">State</MenuItem>
            <MenuItem value="local">Local</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Campaign Committee Name"
          placeholder="Jane for Council"
          fullWidth
          required
          value={campaignCommitteeName}
          onChange={(e) =>
            handleChange({ campaignCommitteeName: e.target.value })
          }
        />
        <EinCheckInput
          {...{
            value: getStringValue(ein),
            onChange: handleEINChange,
            validated: validEin,
            label: 'EIN *',
          }}
        />
        {officeLevel === 'federal' && (
          <>
            <FecCommitteeIdInput
              value={getStringValue(formData.fecCommitteeId)}
              validated={validFecCommitteeId}
              onChange={handleFecCommitteeIdChange}
            />
            <FormControl fullWidth required variant="outlined">
              <InputLabel>Committee Type</InputLabel>
              <Select
                label="Committee Type"
                value={formData.committeeType || ''}
                onChange={(e) => handleChange({ committeeType: e.target.value })}
              >
                <MenuItem value="H">House</MenuItem>
                <MenuItem value="S">Senate</MenuItem>
                <MenuItem value="P">Presidential</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        <StyledAlert severity="warning" className="mb-6">
          <Body2>
            A PIN is required to verify your identity. <br />
            It will only be sent if your email, phone, or address matches your election filing.
          </Body2>
        </StyledAlert>
        <TextField
          label="Election Filing Link"
          fullWidth
          required
          endAdornments={[<FilingLinkInfoIcon key="filing-info-icon" />]}
          value={electionFilingLink}
          onChange={(e) => handleChange({ electionFilingLink: e.target.value })}
        />
        <AddressAutocomplete
          {...{
            value: addressInputValue,
            onChange: handleAddressOnChange,
            onSelect: async (address) => {
              setAddressInputValue(address.formatted_address)

              return handleChange({ address })
            },
            placeholder: 'Filing Address *',
            variant: 'outlined',
          }}
        />
        <TextField
          label="Filing Email"
          placeholder="jane@gmail.com"
          fullWidth
          required
          value={email}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
        <TextField
          label="Filing Phone"
          placeholder="(555) 555-5555"
          required
          fullWidth
          value={phone}
          onChange={(e) => handleChange({ phone: e.target.value })}
        />
      </TextingComplianceForm>
      <TextingComplianceFooter>
        <TextingComplianceSubmitButton
          {...{
            onClick: handleOnSubmit,
            loading,
            isValid,
            hasSubmissionError,
            failingFields,
            officeLevel: getStringValue(officeLevel),
          }}
        />

      </TextingComplianceFooter>
    </>
  )
}

export default TextingComplianceRegistrationForm
