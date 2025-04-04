'use client'

import { useState, useEffect } from 'react'
import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'
import { Switch } from '@mui/material'
import { useUser } from '@shared/hooks/useUser'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

const fields = [
  {
    key: 'notificationEmails',
    label: 'Campaign Emails',
    subTitle: 'Receive notification about your campaign action items',
  },
  {
    key: 'textNotification',
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

export default function NotificationSection() {
  const [user, setUser] = useUser()
  const [state, setState] = useState({})
  const [initialUpdate, setInitialUpdate] = useState(false)

  useEffect(() => {
    if (user && !initialUpdate) {
      let meta = {}
      try {
        meta = JSON.parse(user.metaData)
      } catch (error) {
        console.log('Error parsing user meta', error)
      }

      setState(meta)
      setInitialUpdate(true)
    }
  }, [user])

  async function updateUserCallback(updatedMeta) {
    try {
      const response = await clientFetch(apiRoutes.user.updateMeta, {
        meta: updatedMeta,
      })
      const user = response.data
      setUser(user)
    } catch (error) {
      console.log('Error updating user', error)
    }
  }

  const handleChange = (key, event) => {
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
