'use client'
import { noop } from '@shared/utils/noop'
import TextField from '@shared/inputs/TextField'
import { FilingLinkInfoIcon } from 'app/dashboard/profile/texting-compliance/register/components/FilingLinkInfoIcon'
import {
  FecCommitteeIdInput,
  isValidFecCommitteeId,
  getFecCommitteeIdValidation,
} from 'app/dashboard/profile/texting-compliance/register/components/FecCommitteeIdInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@styleguide'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { useFormData } from '@shared/hooks/useFormData'
import TextingComplianceForm from 'app/dashboard/profile/texting-compliance/shared/TextingComplianceForm'
import { EinCheckInput } from 'app/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import { isValidEIN } from '@shared/inputs/IsValidEIN'
import isURL from 'validator/es/lib/isURL'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isEmail from 'validator/es/lib/isEmail'
import isFilled from '@shared/inputs/IsFilled'
import AddressAutocomplete from '@shared/AddressAutocomplete'
import TextingComplianceFooter from 'app/dashboard/profile/texting-compliance/shared/TextingComplianceFooter'
import { Button } from '@styleguide'

import { urlIncludesPath } from 'helpers/urlIncludesPath'
import Body2 from '@shared/typography/Body2'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import type { FormDataState } from '@shared/hooks/useFormData'

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
  validations: Record<ValidationField, boolean>,
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

interface ValidateOpts {
  // When false, allows blank `website` (new agentic flow purchases the domain
  // after this form submits, before sending to peerly).
  requireWebsite?: boolean
}

export const validateRegistrationForm = (
  data: FormDataState,
  opts: ValidateOpts = {},
): ValidationResult => {
  const { requireWebsite = true } = opts
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
    website: requireWebsite
      ? isFilled(websiteValue) && isURL(websiteValue)
      : !isFilled(websiteValue) || isURL(websiteValue),
    email: isEmail(emailValue),
    fecCommitteeId: true, // Not required for non-federal
    committeeType: true, // Not required for non-federal
  }

  // Add federal-specific validations
  if (officeLevelValue === 'federal') {
    const validCommitteeTypes = ['HOUSE', 'SENATE', 'PRESIDENTIAL']
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
  requireWebsite?: boolean
}

const TextingComplianceRegistrationForm = ({
  onSubmit = noop,
  loading = false,
  hasSubmissionError = false,
  requireWebsite = true,
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
  const formValidation = validateRegistrationForm(formData, { requireWebsite })
  const { isValid, validations } = formValidation
  // `website` is validated but has no input in this form — it is derived from
  // the campaign's purchased domain upstream (the register page redirects to
  // domain purchase when absent, and the election-filing flow passes
  // requireWebsite=false). Exclude it so the error banner never tells the user
  // to fix a field they cannot see or interact with.
  const failingFields = getFailingFields(validations).filter(
    (field) => field !== 'website',
  )

  // The Submit button is always enabled so the user can attempt submission and
  // receive guiding errors. Errors (banner + red field borders) only surface
  // once they've actually tried to submit an invalid form.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const showError = (field: ValidationField): boolean =>
    attemptedSubmit && !validations[field]

  // Synchronous double-submit guard. `loading` is a parent prop that only
  // reflects the submission after a re-render, so it can't block a second click
  // fired within the same render cycle. A ref flips immediately.
  const submittingRef = useRef(false)
  useEffect(() => {
    if (!loading) submittingRef.current = false
  }, [loading])

  const addressValue = isAddressValue(address) ? address : null
  const [addressInputValue, setAddressInputValue] = useState<
    string | undefined
  >(addressValue?.formatted_address || '')

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
    // Always-enabled button: block submission of an invalid form and reveal the
    // guiding errors instead. The footer is fixed at the bottom of a long form,
    // so scroll the error banner (rendered at the top) into view.
    if (!isValid) {
      setAttemptedSubmit(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Block a double-submit. The ref is set synchronously below, so a second
    // rapid click within the same render cycle is caught even before `loading`
    // propagates from the parent.
    if (submittingRef.current || loading) return
    submittingRef.current = true
    // Federal: include fecCommitteeId and committeeType (HOUSE/SENATE/PRESIDENTIAL) as entered
    // Non-federal: exclude fecCommitteeId, set committeeType to 'CANDIDATE'
    const { fecCommitteeId: _, committeeType: __, ...baseFormData } = formData
    const submitData =
      officeLevel === 'federal'
        ? formData
        : { ...baseFormData, committeeType: 'CANDIDATE' }
    return onSubmit(submitData)
  }

  const handleAddressOnChange = (value: string) => {
    setAddressInputValue(value)
    return !value && handleChange({ address: null })
  }

  return (
    <>
      <TextingComplianceForm>
        {hasSubmissionError && (
          <StyledAlert severity="error">
            <Body2>
              Form submission failed. Contact your Political Assistant to
              complete this process or report the issue.
            </Body2>
          </StyledAlert>
        )}
        {attemptedSubmit && !isValid && (
          <StyledAlert severity="error">
            <Body2>
              <span className="font-medium">
                Please fix the following fields:
              </span>
              <ul className="mt-1 list-disc pl-5">
                {failingFields.map((field) => (
                  <li key={field}>
                    <span className="font-medium">
                      {fieldDisplayNames[field]}
                    </span>
                    {' — '}
                    {getValidationMessage(field, getStringValue(officeLevel))}
                  </li>
                ))}
              </ul>
            </Body2>
          </StyledAlert>
        )}
        <div className="flex flex-col gap-1.5 w-full">
          <Label>Office Level *</Label>
          <Select
            value={getStringValue(officeLevel)}
            onValueChange={(val) => handleChange({ officeLevel: val })}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={showError('officeLevel') || undefined}
            >
              <SelectValue placeholder="Select an office level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="state">State</SelectItem>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TextField
          label="Campaign Committee Name"
          placeholder="Jane for Council"
          fullWidth
          required
          error={showError('campaignCommitteeName')}
          value={getStringValue(campaignCommitteeName)}
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
            error: showError('ein'),
          }}
        />
        {officeLevel === 'federal' && (
          <>
            <FecCommitteeIdInput
              value={getStringValue(formData.fecCommitteeId)}
              validated={validFecCommitteeId}
              onChange={handleFecCommitteeIdChange}
              error={showError('fecCommitteeId')}
            />
            <div className="flex flex-col gap-1.5 w-full">
              <Label>Committee Type *</Label>
              <Select
                value={getStringValue(formData.committeeType)}
                onValueChange={(val) => handleChange({ committeeType: val })}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={showError('committeeType') || undefined}
                >
                  <SelectValue placeholder="Select committee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOUSE">House</SelectItem>
                  <SelectItem value="SENATE">Senate</SelectItem>
                  <SelectItem value="PRESIDENTIAL">Presidential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <StyledAlert severity="warning" className="mb-6">
          <Body2>
            A PIN is required to verify your identity. <br />
            It will only be sent if your email, phone, or address matches your
            election filing. Please review your campaign filing link to ensure
            the email, phone number, or address matches exactly before
            submitting.
          </Body2>
        </StyledAlert>
        <TextField
          label="Election Filing Link"
          fullWidth
          required
          error={showError('electionFilingLink')}
          endAdornments={[<FilingLinkInfoIcon key="filing-info-icon" />]}
          value={getStringValue(electionFilingLink)}
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
            error: showError('address'),
            dropdownClassName: 'texting-compliance-address-dropdown',
          }}
        />
        <TextField
          label="Filing Email"
          placeholder="jane@gmail.com"
          fullWidth
          required
          error={showError('email')}
          value={getStringValue(email)}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
        <TextField
          label="Filing Phone"
          placeholder="(555) 555-5555"
          required
          fullWidth
          error={showError('phone')}
          value={getStringValue(phone)}
          onChange={(e) => handleChange({ phone: e.target.value })}
        />
        <div className="h-32"></div>
      </TextingComplianceForm>
      <TextingComplianceFooter>
        <Button
          size="large"
          disabled={loading}
          loading={loading}
          onClick={handleOnSubmit}
        >
          Submit
        </Button>
      </TextingComplianceFooter>
    </>
  )
}

export default TextingComplianceRegistrationForm
