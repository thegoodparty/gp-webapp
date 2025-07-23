'use client'
import TextField from '@shared/inputs/TextField'
import Checkbox from '@shared/inputs/Checkbox'
import { FilingLinkInfoIcon } from 'app/(user)/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import { useState } from 'react'
import { EinCheckInput } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
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

export default function TextingComplianceRegistrationForm({
  onChange = () => {},
  initialFormData = initialFormState,
}) {
  const [formData, setFormData] = useState({
    ...initialFormState,
    ...initialFormData,
  })
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

  const handleChange = (change) => {
    const newFormData = {
      ...formData,
      ...change,
    }
    setFormData(newFormData)
    onChange(newFormData)
  }

  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(ein))
  const handleEINChange = (value) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  return (
    <form className="space-y-4 pb-16 md:p-0">
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
          onChange: (place) =>
            handleChange({ address: place.formatted_address }),
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
    </form>
  )
}
