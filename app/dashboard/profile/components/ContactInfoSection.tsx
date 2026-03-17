'use client'

import { useState, useEffect } from 'react'
import PhoneInput from '@shared/inputs/PhoneInput'
import TextField from '@shared/inputs/TextField'
import Body2 from '@shared/typography/Body2'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { updateUser } from 'helpers/userHelper'
import { useUser } from '@shared/hooks/useUser'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import type { User } from 'helpers/types'

const fetchUser = async (): Promise<User | undefined> => {
  try {
    const resp = await clientFetch<User>(apiRoutes.user.getUser)
    return resp.data
  } catch (error) {
    console.log('Error updating user', error)
    return undefined
  }
}

interface ContactInfoState {
  phone?: string
  zip?: string
}

interface ContactInfoSectionProps {
  user: User | null
}

const ContactInfoSection = ({
  user,
}: ContactInfoSectionProps): React.JSX.Element => {
  const [, setUserState] = useUser()
  const [saving, setSaving] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  const buildState = (currentUser?: User | null): ContactInfoState => ({
    phone: currentUser?.phone || '',
    zip: currentUser?.zip || '',
  })

  const [state, setState] = useState<ContactInfoState>(buildState(user))

  useEffect(() => {
    refetchUser()
  }, [])

  useEffect(() => {
    if (!state.phone && !state.zip) {
      setState(buildState(user))
    }
  }, [user])

  const refetchUser = async () => {
    const updated = await fetchUser()
    if (updated) {
      setUserState(updated)
    }
  }

  const onChangeField = (key: keyof ContactInfoState, val: string) => {
    setState({ ...state, [key]: val })
  }

  const canSave =
    (state.phone === '' || isPhoneValid) && state.zip?.length === 5

  const submit = async () => {
    trackEvent(EVENTS.Settings.PersonalInfo.ClickSave)
    const fields = { ...state }
    if (fields.phone) {
      fields.phone = fields.phone.replace(/\D+/g, '')
    }
    setSaving(true)
    try {
      const updatedUser = await updateUser(fields)
      if (updatedUser) {
        setUserState(updatedUser)
      }
      if (fields.zip) {
        await updateCampaign([{ key: 'details.zip', value: fields.zip }])
      }
    } catch (error) {
      console.log('Error updating user', error)
    }
    setSaving(false)
  }

  return (
    <Paper className="mt-4">
      <H2>Contact Information</H2>
      <Body2 className="text-gray-600 mb-8">
        Update your contact details.
      </Body2>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6">
            <PhoneInput
              value={state.phone || ''}
              onChangeCallback={(phone, isValid) => {
                onChangeField('phone', phone)
                setIsPhoneValid(isValid)
              }}
              hideIcon
              shrink
              required
              label="Mobile Number"
              data-testid="personal-phone"
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <TextField
              value={state.zip || ''}
              fullWidth
              variant="outlined"
              label="Zip Code"
              onChange={(e) => onChangeField('zip', e.target.value)}
              required
              style={{ marginBottom: '16px' }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'data-testid': 'personal-zip', maxLength: 5 }}
            />
          </div>
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

export default ContactInfoSection
