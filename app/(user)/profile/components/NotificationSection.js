'use client';
/**
 *
 * PersonalSection
 *
 */

import { useState, useEffect } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/RegisterOrProfile';
import { getUserCookie, setUserCookie } from 'helpers/cookieHelper';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import { TbMailPlus } from 'react-icons/tb';
import H5 from '@shared/typography/H5';
import { Switch } from '@mui/material';

async function updateUserCallback(updatedMeta) {
  try {
    const api = gpApi.notification.updatePreferences;
    const payload = {
      metaData: JSON.stringify(updatedMeta),
    };

    const response = await gpFetch(api, payload);
    const { user } = response;
    setUserCookie(user);
  } catch (error) {
    console.log('Error updating user', error);
  }
}

const fields = [
  {
    key: 'notificationEmails',
    label: 'Notification Emails',
    subTitle: 'Get notification about your campaign action items',
  },
  {
    key: 'textNotification',
    label: 'SMS Notification',
    subTitle: 'Get text notification about your campaign action items',
  },
];

export default function NotificationSection() {
  const user = getUserCookie(true);
  const [state, setState] = useState({});
  const [initialUpdate, setInitialUpdate] = useState(false);

  useEffect(() => {
    if (user && !initialUpdate) {
      const meta = user.metaData !== '' ? JSON.parse(user.metaData) : {};
      setState(meta);
      setInitialUpdate(true);
    }
  }, [user]);

  const handleChange = (key, event) => {
    const updatedState = {
      ...state,
      [key]: event.target.checked,
    };
    setState(updatedState);
    setInitialUpdate(false);
    updateUserCallback(updatedState);
  };

  console.log('state', state);

  return (
    <section className="py-4 border-b border-slate-300 flex">
      <div className="shrink-0 pr-3 text-indigo-50 pt-[6px]">
        <TbMailPlus />
      </div>
      <div className="flex-1">
        <H4>Emails &amp; Notification</H4>
        <Body2 className="text-indigo-200 mb-6">
          Update your email and notification preferences here
        </Body2>
        {fields.map((field) => (
          <div
            className="flex justify-between mb-5 items-center"
            key={field.key}
          >
            <div>
              <H5>{field.label}</H5>
              <Body2>{field.subTitle}</Body2>
            </div>
            <div>
              <Switch
                onChange={(e) => {
                  handleChange(field.key, e);
                }}
                //
                checked={state[field.key]}
                sx={{
                  '&.MuiSwitch-root .MuiSwitch-switchBase': {
                    color: '#F54966',
                  },

                  '&.MuiSwitch-root .Mui-checked': {
                    color: '#0EB66F',
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
