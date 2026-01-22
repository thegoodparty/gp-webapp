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
import type { User } from 'helpers/types'

const refreshUser = async (): Promise<User | undefined> => {
  try {
    const resp = await clientFetch<User>(apiRoutes.user.getUser)
    return resp.data
  } catch (error) {
    console.log('Error updating user', error)
    return undefined
  }
}

type UserSettingsKey = 'firstName' | 'lastName' | 'email' | 'phone' | 'zip'

interface UserSettingsField {
  key: UserSettingsKey
  label: string
  initialValue: string
  maxLength: number
  required: boolean
  dataTestid?: string
  dataTestId?: string
  cols?: number
  type?: 'email' | 'phone'
}

interface UserSettingsState {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  zip?: string
  name?: string
}

export const USER_SETTING_FIELDS: UserSettingsField[] = [
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

interface PersonalSectionProps {
  user: User | null
}

// TODO: stop prop-drilling down the user object. Use the useUser hook instead
const PersonalSection = ({ user }: PersonalSectionProps): React.JSX.Element => {
  const [_, setUserState] = useUser()
  const [saving, setSaving] = useState(false)

  const buildUserState = (currentUser?: User | null): UserSettingsState => {
    const updatedState: UserSettingsState = {
      name: currentUser?.name ?? undefined,
    }
    USER_SETTING_FIELDS.forEach((field) => {
      updatedState[field.key] = currentUser?.[field.key] || field.initialValue
    })
    return updatedState
  }
  const [state, setState] = useState<UserSettingsState>(buildUserState(user))
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    refetchUser()
  }, [])

  useEffect(() => {
    if (!state.email) {
      setState(buildUserState(user))
    }
  }, [user])

  const refetchUser = async () => {
    const updated = await refreshUser()
    if (updated) {
      setUserState(updated)
    }
  }

  const updateUserCallback = async (updatedFields: UserSettingsState) => {
    try {
      const updatedUser = await updateUser(updatedFields)
      if (updatedUser) {
        setUserState(updatedUser)
      }
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

  const onChangeField = (key: UserSettingsKey, val: string) => {
    setState({
      ...state,
      [key]: val,
    })
  }

  // TODO: This should only be true if the user has made changes
  const canSave = !(
    (state.phone !== '' && !isPhoneValid) ||
    state.name === '' ||
    (state.zip || '') === '' ||
    (state.email === '' && state.phone === '') ||
    (state.email !== '' && !isValidEmail(state.email || '')) ||
    ((state.zip || '') !== '' && (state.zip || '').length !== 5)
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
                    value={state[field.key] || ''}
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
                  value={state[field.key] || ''}
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
