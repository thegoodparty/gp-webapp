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
    isFilled(address) &&
    (isFQDN(website) || isURL(website)) &&
    isEmail(email) &&
    verifyInfo === true
  )
}

export default function TextingComplianceRegistrationForm() {
  const { formData, handleChange } = useFormData()
  // =======
  // export default function TextingComplianceRegistrationForm({
  //   onChange = () => {},
  //   initialFormData = initialFormState,
  // }) {
  //   const [formData, setFormData] = useState({
  //     ...initialFormState,
  //     ...initialFormData,
  //   })
  // >>>>>>> origin/develop
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

  // <<<<<<< HEAD
  // =======
  //   const handleChange = (change) => {
  //     const newFormData = {
  //       ...formData,
  //       ...change,
  //     }
  //     setFormData(newFormData)
  //     onChange(newFormData)
  //   }

  // >>>>>>> origin/develop
  // TODO: Move this redundant logic into EinCheckInput and refactor consumer
  //  components to support signature change
  const [validEin, setValidEin] = useState(isValidEIN(ein))
  const handleEINChange = (value) => {
    setValidEin(isValidEIN(value))
    handleChange({ ein: value })
  }

  return (
    // <<<<<<< HEAD
    <TextingComplianceForm>
      {/*=======*/}
      {/*    <form className="space-y-4 pb-16 md:p-0">*/}
      {/*>>>>>>> origin/develop*/}
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
          // <<<<<<< HEAD
          onChange: (address) => {
            console.log(`address =>`, address)
            return handleChange({ address: address.formatted_address })
          },
          // =======
          //           onChange: (place) =>
          //             handleChange({ address: place.formatted_address }),
          // >>>>>>> origin/develop
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
      {/*<<<<<<< HEAD*/}
    </TextingComplianceForm>
    // =======
    //     </form>
    // >>>>>>> origin/develop
  )
}
