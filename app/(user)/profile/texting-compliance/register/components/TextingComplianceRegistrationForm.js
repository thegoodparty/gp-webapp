'use client'
import TextField from '@shared/inputs/TextField'
import Checkbox from '@shared/inputs/Checkbox'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import { useState } from 'react'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextingComplianceForm'
import { EinCheckInput } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
import isURL from 'validator/es/lib/isURL'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isFQDN from 'validator/es/lib/isFQDN'
import isEmail from 'validator/es/lib/isEmail'
import isFilled from '@shared/inputs/IsFilled'
import AddressAutocomplete from '@shared/AddressAutocomplete'

const initialFormState = {
  electionFilingLink: '',
  campaignCommitteeName: '',
  localTribeName: '',
  ein: '',
  phone: '',
  address: '',
  website: '',
  email: '',
  verifyInfo: false,
}

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
    verifyInfo,
  } = data

  return (
    isURL(electionFilingLink) &&
    isFilled(campaignCommitteeName) &&
    isFilled(localTribeName) &&
    isValidEIN(ein) &&
    isMobilePhone(phone, 'en-US') &&
    // TODO: We should do idiomatic "recommended address" validation flow here,
    //  and elsewhere, to have higher degree of confidence that the address
    //  entered is valid
    validateAddress(address) &&
    (isFQDN(website) || isURL(website)) &&
    isEmail(email) &&
    verifyInfo === true
  )
}

export default function TextingComplianceRegistrationForm() {
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
    verifyInfo,
  } = formData

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

  return (
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
        label="Phone"
        placeholder="(555) 555-5555"
        required
        fullWidth
        value={phone}
        onChange={(e) => handleChange({ phone: e.target.value })}
      />

      <AddressAutocomplete
        {...{
          value: addressInputValue,
          onChange: (inputValue) => {
            console.log(`inputValue =>`, inputValue)
            setAddressInputValue(inputValue)
          },
          onSelect: (address) => {
            console.log(`address =>`, address)
            setAddressInputValue(address.formatted_address)
            return handleChange({ address })
          },
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
      <TextField
        label="Email"
        placeholder="jane@gmail.com"
        fullWidth
        required
        value={email}
        onChange={(e) => handleChange({ email: e.target.value })}
      />
      <Checkbox
        label="I verify this information matches my election filing"
        required
        checked={verifyInfo}
        onChange={(e) => handleChange({ verifyInfo: e.target.checked })}
      />
    </TextingComplianceForm>
  )
}
