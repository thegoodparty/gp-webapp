'use client';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput.js';
import MaxWidth from '@shared/layouts/MaxWidth';

import { useHookstate } from '@hookstate/core';
import { passwordRegex } from 'helpers/userHelper.js';
import { useState } from 'react';
import { globalSnackbarState } from '@shared/utils/Snackbar.js';
import { createCampaign } from 'app/(company)/run-for-office/components/RunCampaignButton';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';

export default function SetNamePage() {
  const [state, setState] = useState({
    name: '',
    processing: false,
  });

  const snackbarState = useHookstate(globalSnackbarState);

  const enableSubmit = () => !state.processing && state.name !== '';

  const handleSubmit = async () => {
    if (enableSubmit()) {
      setState({ ...state, processing: true });
      await createCampaign(state.name);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error creating campaign',
          isError: true,
        };
      });
    }
  };

  const onChangeField = (value, key) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <MaxWidth>
      <div className="flex justify-center min-h-[calc(100vh-56px)]">
        <div className="grid py-6 max-w-lg w-[75vw]">
          <div className="text-center mb-8 pt-8">
            <H1>Before we start, please provide your name</H1>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
              }}
              id="set-name-page-form"
            >
              <div className="flex mt-12">
                <TextField
                  onChange={(e) => onChangeField(e.target.value, 'name')}
                  fullWidth
                  value={state.name}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Name"
                />
              </div>

              <div className="flex mt-5 justify-center" onClick={handleSubmit}>
                <PrimaryButton disabled={!enableSubmit()} type="submit">
                  Next
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
