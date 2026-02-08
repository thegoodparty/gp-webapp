'use client'
import TextField from '@shared/inputs/TextField'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
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
import { TextingComplianceSubmitButton } from 'app/(user)/profile/texting-compliance/shared/TextingComplianceSubmitButton'
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

export const validateRegistrationForm = (data: FormDataState) => {
  const {
    electionFilingLink,
    campaignCommitteeName,
    officeLevel,
    ein,
    phone,
    address,
    website,
    email,
  } = data
  const electionFilingLinkValue = getStringValue(electionFilingLink)
  const campaignCommitteeNameValue = getStringValue(campaignCommitteeName)
  const officeLevelValue = getStringValue(officeLevel)
  const einValue = getStringValue(ein)
  const phoneValue = getStringValue(phone)
  const addressValue = isAddressValue(address) ? address : null
  const websiteValue = getStringValue(website)
  const emailValue = getStringValue(email)
  const validations = {
    electionFilingLink:
      isURL(electionFilingLinkValue) &&
      urlIncludesPath(electionFilingLinkValue),
    campaignCommitteeName: isFilled(campaignCommitteeNameValue),
    // TODO(ENG-6192): Add federal and actually send the officeLevel to the backend.
    officeLevel: officeLevelValue === 'state' || officeLevelValue === 'local',
    ein: isValidEIN(einValue),
    phone: isMobilePhone(phoneValue, 'en-US'),
    // TODO: We should do idiomatic "recommended address" validation flow here,
    //  and elsewhere, to have higher degree of confidence that the address
    //  entered is valid
    address: validateAddress(addressValue),
    // Website must exist (official purchased domain)
    website: isFilled(websiteValue) && isURL(websiteValue),
    email: isEmail(emailValue),
  }
  return {
    validations,
    isValid: Object.values(validations).every(Boolean),
  }
}

interface TextingComplianceRegistrationFormProps {
  onSubmit?: (formData: FormDataState) => void
  loading?: boolean
  hasSubmissionError?: boolean
}

const TextingComplianceRegistrationForm = ({
  onSubmit = () => {},
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
  const { isValid } = formValidation

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

  const handleOnSubmit = () => {
    trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceFormSubmitted, {
      source: 'compliance_flow'
    })
    return onSubmit(formData)
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
          }}
        />
        
      </TextingComplianceFooter>
    </>
  )
}

export default TextingComplianceRegistrationForm
