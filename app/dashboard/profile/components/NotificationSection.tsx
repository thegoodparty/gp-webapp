'use client'

import { useState, useEffect } from 'react'
import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'
import { Switch } from '@styleguide'
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
      const response = await clientFetch<import('helpers/types').User>(
        apiRoutes.user.updateMeta,
        {
          meta: updatedMeta,
        },
      )
      if (response.data && response.data.id) {
        setUser(response.data)
      }
    } catch (error) {
      console.log('Error updating user', error)
    }
  }

  const handleChange = (
    key: keyof NotificationSettings,
    checked: boolean,
  ): void => {
    const updatedState = {
      ...state,
      [key]: checked,
    }
    trackEvent(EVENTS.Settings.Notifications.ToggleEmail, {
      email: key,
      enabled: checked,
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
              onCheckedChange={(checked) => handleChange(field.key, checked)}
              checked={state[field.key] ?? false}
            />
          </div>
        </div>
      ))}
    </Paper>
  )
}

export default NotificationSection
