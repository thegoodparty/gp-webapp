'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import { subscribeEmail } from '@shared/inputs/EmailForm';
import { isValidEmail } from '@shared/inputs/EmailInput';
import { isValidPhone } from '@shared/inputs/PhoneInput';
import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import RenderInputField from '@shared/inputs/RenderInputField';
import { getUserCookie } from 'helpers/cookieHelper';
import { useEffect, useState } from 'react';

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'phone',
  },
  {
    key: 'email',
    label: 'Email',
    required: true,
    type: 'email',
  },
  {
    key: 'sms_opt_in_out',
    label:
      'I would like to receive text messages about GoodParty.org, opportunities to get involved, and appointment reminders. You will receive no more than 1 message per day and can unsubscribe at any time.',
    type: 'checkbox',
    columns: 12,
  },
];
export default function HeroForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const user = getUserCookie(true);
    if (user) {
      setState({
        ...state,
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, []);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return (
      state.firstName !== '' &&
      state.lastName !== '' &&
      isValidEmail(state.email) &&
      (state.phone === '' || isValidPhone(state.phone))
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      return;
    }
    const payload = {
      ...state,
      sms_opt_in_out: state.sms_opt_in_out ? 'Yes' : 'No',
      uri: window.location.href,
      pageName: 'ads2023',
      formId: 'c7d78873-1ed0-4202-ab01-76577e57352c',
    };

    const res = await subscribeEmail(payload);
    if (res) {
      setSubmitSuccess('success');
    } else {
      setSubmitSuccess('error');
    }
  };
  return (
    <div className="pt-20 pb-9 ">
      {submitSuccess === 'success' ? (
        <H3>Thank you! we will be in touch soon.</H3>
      ) : (
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          id="ads23-hero-form"
        >
          <div className="grid grid-cols-12 gap-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`col-span-12 ${
                  field.columns === 12 ? 'md:col-span-12' : 'md:col-span-6'
                }`}
              >
                <RenderInputField
                  field={field}
                  value={state[field.key]}
                  onChangeCallback={onChangeField}
                />
              </div>
            ))}
          </div>

          <div
            className="mt-1"
            onClick={handleSubmit}
            id="volunteer-hero-form-submit"
          >
            <PrimaryButton fullWidth disabled={!canSubmit()} type="submit">
              Start taking action
            </PrimaryButton>
          </div>
          {submitSuccess === 'error' && (
            <Body1 className="text-red mt-1">
              Error submitting your form. Please refresh and try again.
            </Body1>
          )}
        </form>
      )}
    </div>
  );
}
