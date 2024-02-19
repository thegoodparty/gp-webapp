'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { states } from 'helpers/statesHelper';
import { Fragment, useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@shared/inputs/Checkbox';
import TextField from '@shared/inputs/TextField';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { trimObject } from 'helpers/stringHelper';
import { useRouter } from 'next/navigation.js';
import RichEditor from 'app/shared/utils/RichEditor';

export const createCandidateCallback = async (candidate) => {
  const api = gpApi.candidate.create;
  const trimmed = trimObject(candidate);
  const payload = { candidate: trimmed };
  return await gpFetch(api, payload);
};

const partyOptions = [
  { key: 'GP', value: 'Green Party' },
  { key: 'L', value: 'Libertarian' },
  { key: 'LI', value: 'Liberation' },
  { key: 'I', value: 'Independent' },
  { key: 'W', value: 'Working Families Party' },
  { key: 'S', value: 'SAM' },
  { key: 'U', value: 'Unity' },
];

const statesOptions = states.map((state) => ({
  key: state.abbreviation,
  value: state.name,
}));

const fields = [
  {
    label: 'Is Active',
    key: 'isActive',
    initialValue: true,
    isCheckbox: true,
  },
  { label: 'First Name', key: 'firstName', initialValue: '' },
  { label: 'Last Name', key: 'lastName', initialValue: '' },
  { label: 'Hero Video (YouTube id)', key: 'heroVideo', initialValue: '' },
  { label: 'Headline', key: 'headline', initialValue: '' },

  { label: 'Race (Office Seeking)', key: 'race', initialValue: '' },
  {
    label: 'State',
    key: 'state',
    initialValue: '',
    isSelect: true,
    options: statesOptions,
    emptySelectLabel: 'Select A State',
  },
  {
    label: 'Party',
    key: 'party',
    initialValue: '',
    isSelect: true,
    options: partyOptions,
    emptySelectLabel: 'Select A Party',
  },
  { label: 'Facebook', key: 'facebook', initialValue: '' },
  { label: 'Twitter', key: 'twitter', initialValue: '' },
  { label: 'TikTok', key: 'tiktok', initialValue: '' },
  { label: 'Snap', key: 'snap', initialValue: '' },
  { label: 'Instagram', key: 'instagram', initialValue: '' },
  { label: 'YouTube', key: 'youtube', initialValue: '' },
  { label: 'Twitch', key: 'twitch', initialValue: '' },
  { label: 'Reddit', key: 'reddit', initialValue: '' },
  { label: 'Unrepresented voters', key: 'unrepVoters', initialValue: 0 },
  { label: 'Likely Voters', key: 'likelyVoters', initialValue: 0 },
  { label: 'Votes Needed', key: 'votesNeeded', initialValue: 0 },
];

export default function AddCandidatePage(props) {
  const router = useRouter();
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = field.initialValue;
  });

  const [formState, setFormState] = useState(initialState);
  const [about, setAbout] = useState('');

  const onChangeField = (key, value, type = 'text') => {
    setFormState({
      ...formState,
      [key]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const canSubmit = () => {
    return formState.firstName !== '' && formState.lastName !== '';
  };

  const createCandidate = async () => {
    await createCandidateCallback({
      ...formState,
      about,
    });
    router.push('/admin/candidates');
  };

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        {fields.map((field) => (
          <Fragment key={field.key}>
            {field.isSelect ? (
              <FormControl style={{ width: '100%' }}>
                <InputLabel id={field.key}>{field.label}</InputLabel>
                <Select
                  native
                  value={formState[field.key]}
                  labelId={field.key}
                  onChange={(e) => onChangeField(field.key, e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ width: '100%', margin: '12px 0' }}
                >
                  <option value="">{field.emptySelectLabel}</option>
                  {field.options?.map((item) => (
                    <option value={item.key} key={item.key}>
                      {item.value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : field.isCheckbox ? (
              <>
                <div>
                  <Checkbox
                    checked={formState[field.key]}
                    onChange={(e) => onChangeField(field.key, e.target.checked)}
                  />
                  &nbsp; &nbsp; {field.label}
                </div>
              </>
            ) : (
              <TextField
                style={{ width: '100%', margin: '12px 0' }}
                label={field.label}
                name={field.label}
                value={formState[field.key]}
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
          </Fragment>
        ))}
        <div className="mt-8 mb-4">About</div>
        <RichEditor
          onChangeCallback={(value) => setAbout(value)}
          initialText={about}
        />
        <br />
        <br />
        <BlackButtonClient
          onClick={createCandidate}
          disabled={!canSubmit()}
          className="w-full font-black"
        >
          SAVE
        </BlackButtonClient>
      </PortalPanel>
    </AdminWrapper>
  );
}
