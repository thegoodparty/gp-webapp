'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OnboardingWrapper from '../shared/OnboardingWrapper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { isValidEmail } from '@shared/inputs/EmailInput';
import { getUserCookie } from 'helpers/cookieHelper';
import PasswordInput, { isValidPassword } from '@shared/inputs/PasswrodInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import RenderInputField from './RenderInputField';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const inputFields = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
    cols: 6,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
    cols: 6,
  },
  { key: 'email', label: 'Email', required: true, type: 'email', cols: 12 },
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
        router.push(`/onboarding/${slug}/details/1`);
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
    // if (!user) {
    //   const newUser = await register({
    //     email: state.email,
    //     name: `${state.firstName} ${state.lastName}`,
    //     zip: state.zip,
    //     password: state.password,
    //     phone: state.phone,
    //   });
    //   if (newUser) {
    //     userState.set(() => user);
    //     snackbarState.set(() => {
    //       return {
    //         isOpen: true,
    //         message: 'Your account is created. Creating campaign...',
    //         isError: false,
    //       };
    //     });
    //   } else {
    //     snackbarState.set(() => {
    //       return {
    //         isOpen: true,
    //         message: 'Error creating your account',
    //         isError: true,
    //       };
    //     });
    //     return false;
    //   }
    // }
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
      <div className="grid grid-cols-12 gap-4">
        {inputFields.map((field) => (
          <RenderInputField
            field={field}
            onChangeCallback={onChangeField}
            error={!!errors[field.key]}
            positions={props.positions}
            value={state[field.key]}
          />
        ))}
      </div>

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
      <div className="flex justify-center mt-10 ">
        <BlackButtonClient disabled={!canSubmit()} onClick={handleSubmit}>
          NEXT
        </BlackButtonClient>
      </div>
    </OnboardingWrapper>
  );
}
