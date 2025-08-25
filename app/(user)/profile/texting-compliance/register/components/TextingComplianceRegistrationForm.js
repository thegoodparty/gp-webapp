'use client'
import TextField from '@shared/inputs/TextField'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
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

const validateAddress = (address) => Boolean(address.formatted_address)

export const validateRegistrationForm = (data) => {
  const {
    electionFilingLink,
    campaignCommitteeName,
    localTribeName,
    ein,
    phone,
    address,
    website,
    email,
    matchingContactFields,
  } = data
  const validations = {
    electionFilingLink: isURL(electionFilingLink),
    campaignCommitteeName: isFilled(campaignCommitteeName),
    localTribeName: isFilled(localTribeName),
    ein: isValidEIN(ein),
    phone: isMobilePhone(phone, 'en-US'),
    // TODO: We should do idiomatic "recommended address" validation flow here,
    //  and elsewhere, to have higher degree of confidence that the address
    //  entered is valid
    address: validateAddress(address),
    website: isURL(website),
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
}) {
  const { formData, handleChange } = useFormData()
  const {
    electionFilingLink,
    campaignCommitteeName,
    localTribeName,
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
    address.formatted_address || '',
  )

  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(ein))
  const handleEINChange = (value) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  const handleOnSubmit = () => {
    trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceFormSubmitted)
    return onSubmit(formData)
  }

  return (
    <>
      <TextingComplianceForm>
        <TextField
          label="Election filing link"
          fullWidth
          required
          endAdornments={[<FilingLinkInfoIcon key="filing-info-icon" />]}
          value={electionFilingLink}
          onChange={(e) => handleChange({ electionFilingLink: e.target.value })}
        />
        <TextField
          label="Campaign committee name"
          placeholder="Jane for Council"
          fullWidth
          required
          value={campaignCommitteeName}
          onChange={(e) =>
            handleChange({ campaignCommitteeName: e.target.value })
          }
        />
        <TextField
          label="Local/Tribe Name"
          required
          fullWidth
          value={localTribeName}
          onChange={(e) => handleChange({ localTribeName: e.target.value })}
        />
        <EinCheckInput
          {...{
            value: ein,
            onChange: handleEINChange,
            validated: validEin,
          }}
        />
        <TextField
          label="Website"
          placeholder="janesmithcitycouncil.co"
          fullWidth
          required
          value={website}
          onChange={(e) => handleChange({ website: e.target.value })}
        />
        <AddressAutocomplete
          {...{
            value: addressInputValue,
            onChange: (inputValue) => setAddressInputValue(inputValue),
            onSelect: async (address) => {
              setAddressInputValue(address.formatted_address)

              return handleChange({ address })
            },
          }}
        />
        <TextField
          label="Email"
          placeholder="jane@gmail.com"
          fullWidth
          required
          value={email}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
        <TextField
          label="Phone"
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
          }}
        />
      </TextingComplianceFooter>
    </>
  )
}
