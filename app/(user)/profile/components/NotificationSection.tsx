'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'
import { Switch } from '@mui/material'
import { useUser } from '@shared/hooks/useUser'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { UserMetaData } from 'helpers/types'

interface NotificationField {
  key: keyof NotificationSettings
  label: string
  subTitle: string
}

interface NotificationSettings {
  notificationEmails?: boolean
  textNotifications?: boolean
  marketingEmails?: boolean
  weeklyNewsletter?: boolean
}

const fields: NotificationField[] = [
  {
    key: 'notificationEmails',
    label: 'Campaign Emails',
    subTitle: 'Receive notification about your campaign action items',
  },
  {
    key: 'textNotifications',
    label: 'SMS Messages',
    subTitle: 'Receive text notification about your campaign action items',
  },
  {
    key: 'marketingEmails',
    label: 'Marketing Emails',
    subTitle: 'Receive marketing emails from GoodParty.org',
  },
  {
    key: 'weeklyNewsletter',
    label: 'Weekly Newsletter',
    subTitle: "Receive GoodParty.org's weekly newsletter.",
  },
]

const NotificationSection = (): React.JSX.Element => {
  const [user, setUser] = useUser()
  const [state, setState] = useState<NotificationSettings>({})
  const [initialUpdate, setInitialUpdate] = useState(false)

  useEffect(() => {
    if (user && !initialUpdate) {
      let meta: UserMetaData = {}
      try {
        meta = user?.metaData || {}
      } catch (error) {
        console.log('Error parsing user meta', error)
      }

      setState(meta)
      setInitialUpdate(true)
    }
  }, [user])

  const updateUserCallback = async (
    updatedMeta: NotificationSettings,
  ): Promise<void> => {
    try {
      const response = await clientFetch<import('helpers/types').User>(apiRoutes.user.updateMeta, {
        meta: updatedMeta,
      })
      if (response.data && response.data.id) {
        setUser(response.data)
      }
    } catch (error) {
      console.log('Error updating user', error)
    }
  }

  const handleChange = (
    key: keyof NotificationSettings,
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const updatedState = {
      ...state,
      [key]: event.target.checked,
    }
    trackEvent(EVENTS.Settings.Notifications.ToggleEmail, {
      email: key,
      enabled: event.target.checked,
    })
    setState(updatedState)
    setInitialUpdate(false)
    updateUserCallback(updatedState)
  }

  return (
    <Paper className="mt-4">
      <H2>Notification Settings</H2>
      <Body2 className="text-gray-600 mb-8">
        Manage your notification preferences.
      </Body2>
      {fields.map((field) => (
        <div className="flex justify-between mb-5 items-center" key={field.key}>
          <div>
            <H5>{field.label}</H5>
            <Body2>{field.subTitle}</Body2>
          </div>
          <div>
            <Switch
              onChange={(e) => {
                handleChange(field.key, e)
              }}
              //
              checked={state[field.key]}
              sx={{
                '&.MuiSwitch-root .MuiSwitch-switchBase': {
                  color: '#F9F9F9',
                },

                '&.MuiSwitch-root .Mui-checked': {
                  color: '#0D1528',
                },
              }}
            />
          </div>
        </div>
      ))}
    </Paper>
  )
}

export default NotificationSection
