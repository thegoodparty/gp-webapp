'use client';

import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

import PortalWrapper from '../../shared/PortalWrapper';
import TextField from '@shared/inputs/TextField';
import PortalPanel from '@shared/layouts/PortalPanel';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { revalidateCandidate } from 'helpers/cacheHelper';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';

const fields = [
  {
    label: 'Show on Homepage?',
    key: 'isOnHomepage',
    initialValue: false,
    isCheckbox: true,
  },
  {
    label: 'Is Active',
    key: 'isActive',
    initialValue: true,
    isCheckbox: true,
  },
  {
    label: 'Did Win?',
    key: 'didWin',
    isRadio: true,
    options: ['Yes', 'No'],
  },
  { label: 'Term (if won)', key: 'term', initialValue: '' },
  { label: 'Votes Received', key: 'votesReceived', initialValue: 0 },
  { label: 'Followers Offset', key: 'followersOffset', initialValue: 0 },
  { label: 'Votes Needed', key: 'votesNeeded', initialValue: 0 },
  { label: 'Likely Voters', key: 'likelyVoters', initialValue: 0 },
  { label: 'TikTok Followers', key: 'tiktokFollowers', initialValue: 0 },
  {
    label: 'Should likely voters override social followers?',
    key: 'overrideFollowers',
    initialValue: false,
    isCheckbox: true,
  },
  { label: 'hubspot company id', key: 'hubspotId', initialValue: '' },
  { label: 'Pulsar Search ID', key: 'pulsarSearchId', initialValue: '' },
  {
    label: 'This campaign is claimed',
    key: 'isClaimed',
    initialValue: false,
    isCheckbox: true,
  },
];

const saveCandidate = async (candidate) => {
  const api = gpApi.campaign.update;
  const payload = { id: candidate.id, candidate };
  return await gpFetch(api, payload);
};
const approveClaimCallback = async (email, candidateId) => {
  const api = gpApi.campaign.approveClaim;
  const payload = { email, candidateId };
  return await gpFetch(api, payload);
};

export default function PortalAdminPage(props) {
  const { candidate } = props;

  const snackbarState = useHookstate(globalSnackbarState);

  const [claimEmail, setClaimEmail] = useState('');

  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = field.initialValue;
  });
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (candidate) {
      const newState = {};
      fields.forEach((field) => {
        newState[field.key] = candidate[field.key]
          ? candidate[field.key]
          : field.initialValue;
        // if (field.key === 'didWin' && candidate[field.key]) {
        //   console.log('didWin', candidate[field.key]);
        //   newState[field.key] = candidate[field.key] === 'Yes'; // didWin returns as yes or no
        // }
      });
      newState.isActive = candidate.isActive;
      console.log('newState', newState);
      setState(newState);
    }
  }, [candidate]);

  const onChangeField = (key, value, type = 'text') => {
    setState({
      ...state,
      [key]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const canSubmit = () => {
    return state.likelyVoters >= 0 && state.votesNeeded >= 0;
  };

  const approveClaim = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await approveClaimCallback(claimEmail, candidate.id);
    await revalidateCandidate(fields);
    window.location.reload();
  };

  const handleSave = async (fields) => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await saveCandidate(fields);
    await revalidateCandidate(fields);
    window.location.reload();
  };

  return (
    <PortalWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        {fields.map((field) => (
          <div className="my-3" key={field.key}>
            {field.isCheckbox ? (
              <div>
                <Checkbox
                  checked={state[field.key]}
                  onChange={(e) => onChangeField(field.key, e.target.checked)}
                />
                &nbsp; &nbsp; {field.label}
              </div>
            ) : (
              <>
                {field.isRadio ? (
                  <>
                    {console.log('field.key', field.key)}
                    {console.log('tate[field.key]', state[field.key])}
                    <div>
                      {field.label} {state[field.key]}
                    </div>
                    <RadioGroup
                      row
                      name={field.label}
                      label={field.label}
                      value={state[field.key] || null}
                      onChange={(e) => onChangeField(field.key, e.target.value)}
                    >
                      {field.options.map((op) => (
                        <FormControlLabel
                          value={op}
                          key={op}
                          control={<Radio />}
                          label={op}
                        />
                      ))}
                    </RadioGroup>{' '}
                  </>
                ) : (
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.label}
                    value={state[field.key]}
                    type={field.initialValue === 0 ? 'number' : 'text'}
                    onChange={(e) =>
                      onChangeField(
                        field.key,
                        e.target.value,
                        field.initialValue === 0 ? 'number' : 'text',
                      )
                    }
                  />
                )}
              </>
            )}
          </div>
        ))}
        <div className="text-right">
          <BlackButtonClient
            fullWidth
            onClick={() => {
              handleSave({ ...candidate, ...state });
            }}
            disabled={!canSubmit()}
          >
            <strong>Save</strong>
          </BlackButtonClient>
        </div>
      </PortalPanel>
      {!candidate.isClaimed && (
        <PortalPanel color="#FF00DA">
          <form noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center justify-center">
              <EmailInput
                hideIcon
                value={claimEmail}
                onChangeCallback={(e) => {
                  setClaimEmail(e.target.value);
                }}
              />
              <BlackButtonClient
                disabled={!isValidEmail(claimEmail)}
                onClick={approveClaim}
                type="submit"
                style={{
                  marginLeft: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                <strong>Approve Claim</strong>
              </BlackButtonClient>
            </div>
          </form>
        </PortalPanel>
      )}
    </PortalWrapper>
  );
}
