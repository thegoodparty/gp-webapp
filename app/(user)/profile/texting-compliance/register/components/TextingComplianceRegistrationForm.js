'use client'
import TextField from '@shared/inputs/TextField'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
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
import { MatchingComplianceContactFields } from 'app/(user)/profile/texting-compliance/register/components/MatchingComplianceContactFields'
import { urlIncludesPath } from 'helpers/urlIncludesPath'
import Body2 from '@shared/typography/Body2'
import { StyledAlert } from '@shared/alerts/StyledAlert'

const validateAddress = (address) => Boolean(address?.formatted_address)

export const validateRegistrationForm = (data) => {
  const {
    electionFilingLink,
    campaignCommitteeName,
    officeLevel,
    ein,
    phone,
    address,
    website,
    email,
    matchingContactFields,
  } = data
  const validations = {
    electionFilingLink:
      isURL(electionFilingLink) && urlIncludesPath(electionFilingLink),
    campaignCommitteeName: isFilled(campaignCommitteeName),
    // TODO(ENG-6192): Add federal and actually send the officeLevel to the backend.
    officeLevel: officeLevel === 'state' || officeLevel === 'local',
    ein: isValidEIN(ein),
    phone: isMobilePhone(phone, 'en-US'),
    // TODO: We should do idiomatic "recommended address" validation flow here,
    //  and elsewhere, to have higher degree of confidence that the address
    //  entered is valid
    address: validateAddress(address),
    // Website must exist (official purchased domain)
    website: isFilled(website) && isURL(website),
    email: isEmail(email),
    matchingContactFields: matchingContactFields.length > 0,
  }
  return {
    validations,
    isValid: Object.values(validations).every(Boolean),
  }
}

export default function TextingComplianceRegistrationForm({
  onSubmit = (formData) => {},
  loading = false,
  hasSubmissionError = false,
}) {
  const { formData, handleChange } = useFormData()
  const {
    electionFilingLink,
    campaignCommitteeName,
    officeLevel,
    ein,
    phone,
    address,
    website,
    email,
    matchingContactFields,
  } = formData
  const formValidation = validateRegistrationForm(formData)
  const { isValid } = formValidation

  const [addressInputValue, setAddressInputValue] = useState(
    address?.formatted_address || '',
  )

  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(ein))
  const handleEINChange = (value) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  const handleOnSubmit = () => {
    trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceFormSubmitted, {
      source: 'compliance_flow'
    })
    return onSubmit(formData)
  }

  const handleAddressOnChange = (value) => {
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
            value: ein,
            onChange: handleEINChange,
            validated: validEin,
            label: 'EIN *',
          }}
        />
        <StyledAlert severity="warning" className="mb-6">
          <Body2>
            A PIN is required to verify your identity. <br></br>
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
        <MatchingComplianceContactFields
          {...{
            value: matchingContactFields,
            onChange: (value) => handleChange({ matchingContactFields: value }),
          }}
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
