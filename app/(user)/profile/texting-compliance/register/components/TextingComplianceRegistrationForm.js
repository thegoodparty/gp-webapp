'use client'
import TextField from '@shared/inputs/TextField'
import Checkbox from '@shared/inputs/Checkbox'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import { useState } from 'react'
import { useFormData } from '@shared/hooks/useFormData'
import TextinComplianceForm from 'app/(user)/profile/texting-compliance/shared/TextinComplianceForm'
import { EinCheckInput } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
import AddressAutocomplete from 'app/(candidate)/dashboard/website/editor/components/AddressAutocomplete'
import isURL from 'validator/es/lib/isURL'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isFQDN from 'validator/es/lib/isFQDN'
import isEmail from 'validator/es/lib/isEmail'
import isFilled from '@shared/inputs/IsFilled'

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
    isFilled(address) &&
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

  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(ein))
  const handleEINChange = (value) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  return (
    <TextinComplianceForm>
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
      {/*
        TODO: AddressAutocomplete has a known but and usage of deprecated GoogleMaps API.
          Swap out with https://www.npmjs.com/package/react-google-autocomplete
      */}
      <AddressAutocomplete
        {...{
          value: address,
          onChange: (address) => handleChange({ address }),
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
    </TextinComplianceForm>
  )
}
