'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { isValidEmail } from '@shared/inputs/EmailInput';
import { isValidPhone } from '@shared/inputs/PhoneInput';
import { getUserCookie } from 'helpers/cookieHelper';
import PasswordInput, { isValidPassword } from '@shared/inputs/PasswrodInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from './RenderInputField';
import { register } from '@shared/inputs/RegisterAnimated';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const inputFields = [
  { key: 'firstName', label: 'First Name', required: true, type: 'text' },
  { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'phone', label: 'Phone', required: true, type: 'phone' },
  { key: 'zip', label: 'Zip Code', required: true, type: 'text', maxLength: 5 },
  {
    key: 'citizen',
    label: 'Are you a citizen of the United States?',
    required: true,
    type: 'radio',
  },
  { key: 'dob', label: 'Date of Birth', required: true, type: 'date' },
  {
    key: 'party',
    label: 'Political Party Affiliation (select one)',
    required: true,
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian',
      'SAM',
      'Forward',
      'Other',
    ],
  },
  {
    key: 'office',
    label: 'What office are you running for (please include district/state)',
    required: true,
    type: 'text',
  },
  {
    key: 'appointed',
    label: 'Have you ever been appointed to or elected for office before?',
    required: true,
    type: 'radio',
  },
  {
    key: 'registered',
    label: 'Have you ever been a registered member of a political party?',
    required: true,
    type: 'radio',
  },
  { type: 'positionsSelector', key: 'positions', initialValue: [] },
];

const initialState = {
  password: '',
  passwordConf: '',
};

inputFields.map((field) => {
  if (field.initialValue) {
    initialState[field.key] = field.initialValue;
  } else {
    initialState[field.key] = '';
  }
});

async function createCampaign(payload) {
  try {
    const api = gpApi.campaign.onboarding.create;
    return await gpFetch(api, { data: payload });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function OnboardingPage(props) {
  const user = getUserCookie(true);
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const userState = useHookstate(globalUserState);
  const snackbarState = useHookstate(globalSnackbarState);
  const router = useRouter();
  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  useEffect(() => {
    checkCampaigns();
  }, [user]);

  const checkCampaigns = async () => {
    if (user) {
      const { campaign } = await fetchUserCampaign();
      if (campaign) {
        const { slug } = campaign;
        if (campaign.pledge) {
          router.push(`/onboarding/${slug}/goals/why`);
        } else {
          router.push(`/onboarding/${slug}/pledge`);
        }
      }
    }
  };

  const checkForCampaign = async () => {};

  const canSubmit = () => {
    if (loading) {
      return false;
    }
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        const val = state[field.key];
        if (field.initialValue && val === initialValue) {
          return false;
        } else if (val === '') {
          return false;
        }
      }
    }
    if (
      !user &&
      (state.password !== state.passwordConf ||
        !isValidPassword(state.password))
    ) {
      return false;
    }
    if (!isValidEmail(state.email)) {
      return false;
    }
    if (!isValidPhone(state.phone)) {
      return false;
    }
    return true;
  };

  const checkErrors = () => {
    const newErrors = {};
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i];
      if (field.required) {
        const val = state[field.key];
        if (field.initialValue && val === initialValue) {
          newErrors[field.key] = true;
        } else if (val === '') {
          newErrors[field.key] = true;
        }
      }
    }
    if (
      !user &&
      (state.password !== state.passwordConf ||
        !isValidPassword(state.password))
    ) {
      newErrors.password = true;
    }
    if (!isValidEmail(state.email)) {
      newErrors.email = true;
    }
    if (!isValidPhone(state.phone)) {
      newErrors.phone = true;
    }
    if (!validateZip(state.zip)) {
      newErrors.zip = true;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    setLoading(true);
    checkErrors();
    if (!user) {
      const newUser = await register({
        email: state.email,
        name: `${state.firstName} ${state.lastName}`,
        zip: state.zip,
        password: state.password,
        phone: state.phone,
      });
      if (newUser) {
        userState.set(() => user);
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Your account is created. Creating campaign...',
            isError: false,
          };
        });
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Error creating your account',
            isError: true,
          };
        });
        return false;
      }
    }
    const stateNoPassword = { ...state };
    delete stateNoPassword.password;
    delete stateNoPassword.passwordConf;

    const { slug } = await createCampaign(stateNoPassword);
    if (slug) {
      router.push(`/onboarding/${slug}`);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error creating your campaign',
          isError: true,
        };
      });
    }
    setLoading(false);
  };

  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">
          Now, let's start putting your campaign together.
        </h3>
        <h4 className="font-black italic mb-6">Basic Information</h4>
        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}

        {!user && (
          <div>
            <div className="font-black mt-12 mb-6">Account password</div>
            <PasswordInput
              value={state.password}
              onChangeCallback={(pwd) => onChangeField('password', pwd)}
              className="mb-10"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <PasswordInput
              label="Re-enter password"
              helperText=""
              className="mb-10"
              value={state.passwordConf}
              onChangeCallback={(pwd) => onChangeField('passwordConf', pwd)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}

        <BlackButtonClient
          className="w-full uppercase font-black mt-10"
          disabled={!canSubmit()}
          onClick={handleSubmit}
        >
          Create my campaign
        </BlackButtonClient>
      </PortalPanel>
    </OnboardingWrapper>
  );
}
