'use client'
/**
 *
 * PersonalSection
 *
 */
import { useEffect, useState } from 'react'
import TextField from '@shared/inputs/TextField'
import { isValidEmail } from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import Body2 from '@shared/typography/Body2'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { updateUser } from 'helpers/userHelper'
import { useUser } from '@shared/hooks/useUser'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import ImageSection from './ImageSection'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

async function refreshUser() {
  try {
    const resp = await clientFetch(apiRoutes.user.getUser)
    return resp.data
  } catch (error) {
    console.log('Error updating user', error)
  }
}

export const USER_SETTING_FIELDS = [
  {
    key: 'firstName',
    label: 'First Name',
    initialValue: '',
    maxLength: 20,
    required: true,
    dataTestid: 'personal-first-name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    initialValue: '',
    maxLength: 20,
    required: true,
    dataTestid: 'personal-last-name',
  },
  {
    key: 'email',
    label: 'Email',
    initialValue: '',
    maxLength: 30,
    type: 'email',
    cols: 12,
    required: true,
    dataTestid: 'personal-email',
  },
  {
    key: 'phone',
    label: 'Mobile Number',
    initialValue: '',
    maxLength: 12,
    type: 'phone',
    required: true,
    dataTestid: 'personal-phone',
  },
  {
    key: 'zip',
    label: 'Zip Code',
    initialValue: '',
    maxLength: 5,
    required: true,
    dataTestid: 'personal-zip',
  },
]

// TODO: stop prop-drilling down the user object. Use the useUser hook instead
function PersonalSection({ user }) {
  const [_, setUserState] = useUser()
  const [saving, setSaving] = useState(false)

  const updatedState = {}
  if (user) {
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = user[field.key] || field.initialValue
    })
  }
  const [state, setState] = useState(updatedState)
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    refetchUser()
  }, [])

  useEffect(() => {
    if (!state.email) {
      setState(user)
    }
  }, [user])

  const refetchUser = async () => {
    const updated = await refreshUser()

    setUserState(updated)
  }

  async function updateUserCallback(updatedFields) {
    try {
      setUserState(await updateUser(updatedFields))
      updatedFields.zip &&
        (await updateCampaign([
          {
            key: 'details.zip',
            value: updatedFields.zip,
          },
        ]))
    } catch (error) {
      console.log('Error updating user', error)
    }
  }

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    })
  }

  const cancel = () => {
    const updatedState = {}
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = user[field.key] || field.initialValue
    })
    setState(updatedState)
    setIsPhoneValid(true)
  }

  // TODO: This should only be true if the user has made changes
  const canSave = !(
    (state.phone !== '' && !isPhoneValid) ||
    state.name === '' ||
    state.zip === '' ||
    (state.email === '' && state.phone === '') ||
    (state.email !== '' && !isValidEmail(state.email)) ||
    (state.zip !== '' && state.zip.length !== 5)
  )

  const submit = async () => {
    trackEvent(EVENTS.Settings.PersonalInfo.ClickSave)
    const fields = { ...state }
    if (fields.phone) {
      fields.phone = fields.phone.replace(/\D+/g, '')
    }
    setSaving(true)
    await updateUserCallback(fields)
    setSaving(false)
  }

  return (
    <Paper className="mt-4">
      <H2>Personal Information</H2>
      <Body2 className="text-gray-600 mb-8">
        Update your personal information.
      </Body2>
      <ImageSection />
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-12 gap-3">
          {USER_SETTING_FIELDS.map((field) => (
            <div
              key={field.key}
              className={`col-span-12 ${
                field.cols === 12 ? '' : 'lg:col-span-6'
              }`}
            >
              {field.type === 'phone' ? (
                <div>
                  <PhoneInput
                    value={state[field.key]}
                    onChangeCallback={(phone, isValid) => {
                      onChangeField(field.key, phone)
                      setIsPhoneValid(isValid)
                    }}
                    hideIcon
                    shrink
                    required
                    label={field.label}
                    data-testid={field.dataTestId}
                  />
                </div>
              ) : (
                <TextField
                  key={field.label}
                  value={state[field.key]}
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  onChange={(e) => onChangeField(field.key, e.target.value)}
                  required={field.required}
                  style={{ marginBottom: '16px' }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 'data-testid': field.dataTestid }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PrimaryButton
            disabled={!canSave}
            loading={saving}
            type="submit"
            onClick={submit}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </Paper>
  )
}

export default PersonalSection
