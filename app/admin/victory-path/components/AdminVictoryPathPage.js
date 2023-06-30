'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useEffect, useState } from 'react';
import { Select } from '@mui/material';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import RenderInputField from 'app/(candidate)/onboarding/shared/RenderInputField';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates } from 'helpers/cacheHelper';

export async function sendVictoryMail(slug) {
  try {
    const api = gpApi.admin.victoryMail;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const sections = [
  {
    title: 'Vote Goal',
    fields: [
      {
        key: 'totalRegisteredVoters',
        label: 'Total Registered Voters',
        type: 'number',
      },
      { key: 'projectedTurnout', label: 'Projected Turnout', type: 'number' },
      { key: 'winNumber', label: 'Win Number', type: 'number', formula: true },
      { key: 'voterContactGoal', label: 'Voter Contact Goal', type: 'number' },
    ],
  },

  {
    title: 'Registered Voters',
    fields: [
      { key: 'republicans', label: 'Republicans', type: 'number' },
      { key: 'democrats', label: 'Democrats', type: 'number' },
      { key: 'indies', label: 'Indies', type: 'number' },
      {
        key: 'averageTurnout',
        label: 'Average % turnout from past 3 races',
        type: 'number',
      },
    ],
  },

  {
    title: 'Voter Demographics',
    fields: [
      { key: 'allAvailVoters', label: 'All avail voters', type: 'number' },
      { key: 'availVotersTo35', label: '18-35 avail voters', type: 'number' },
      { key: 'women', label: 'Women', type: 'number' },
      { key: 'men', label: 'Men', type: 'number' },
      { key: 'africanAmerican', label: 'African American', type: 'number' },
      { key: 'white', label: 'White', type: 'number' },
      { key: 'asian', label: 'Asian', type: 'number' },
      { key: 'hispanic', label: 'Hispanic', type: 'number' },
    ],
  },
  {
    title: 'Goals',
    fields: [
      { key: 'voteGoal', label: 'Vote Goal', type: 'number' },
      {
        key: 'voterProjection',
        label: 'Voter Projection (Likely Voters)',
        type: 'number',
      },
    ],
  },
  {
    title: 'Budget',
    fields: [
      { key: 'budgetLow', label: 'Budget Low', type: 'number' },
      { key: 'budgetHigh', label: 'Budget High', type: 'number' },
    ],
  },
];

const initialState = {};
const keys = [];

sections.forEach((section) => {
  section.fields.forEach((field) => {
    if (field.initialValue) {
      initialState[field.key] = field.initialValue;
    } else {
      if (field.type === 'number') {
        initialState[field.key] = 0;
      } else {
        initialState[field.key] = '';
      }
    }
    keys.push(field.key);
  });
});

export default function AdminVictoryPathPage(props) {
  const [selected, setSelected] = useState(false);
  const [campaignsBySlug, setCampaignsBySlug] = useState(false);
  const [state, setState] = useState(initialState);
  const snackbarState = useHookstate(globalSnackbarState);
  console.log('props.campaigns', props.campaigns);
  useEffect(() => {
    const bySlug = {};
    props.campaigns.forEach((campaign) => {
      bySlug[campaign.slug] = campaign;
    });
    setCampaignsBySlug(bySlug);
  }, []);

  const { campaigns } = props;

  const onSelectCallback = (e) => {
    const campaign = campaignsBySlug[e.target.value];
    setSelected(campaign);
    if (campaign.data.pathToVictory) {
      setState({
        ...state,
        ...campaign.data.pathToVictory,
      });
    }
  };

  const onChangeField = (key, value) => {
    let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
    if (key === 'projectedTurnout') {
      winNumber = Math.round(value * 0.51);
    }
    setState({
      ...state,
      [key]: value,
      winNumber,
    });
  };

  const save = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    const campaign = {
      ...selected.data,
      pathToVictory: state,
    };
    try {
      await updateCampaign(campaign, false, true);
      await sendVictoryMail(campaign.slug);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saved',
          isError: false,
        };
      });
      await revalidateCandidates();
      window.location.reload();
    } catch (e) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error saving campaign',
          isError: true,
        };
      });
    }
  };

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Select
          native
          fullWidth
          variant="outlined"
          onChange={onSelectCallback}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <option value="">Select a Campaign</option>
          {campaigns.map((op) => (
            <option value={op.slug} key={op.slug}>
              {op.slug} (User: {op.user?.name}, Office:{' '}
              {op.data?.details?.office || 'N/A'}, State:{' '}
              {op.data?.details?.state || 'N/A'}, District:{' '}
              {op.data?.details?.district || 'N/A'})
            </option>
          ))}
        </Select>
        {selected && (
          <div className="mt-8">
            <h2 className="my-6 text-xl">
              Office: <strong>{selected.data?.details?.office || 'N/A'}</strong>
              . State: <strong>{selected.data?.details?.state || 'N/A'}</strong>
              . District:{' '}
              <strong>{selected.data?.details?.district || 'N/A'}</strong>
            </h2>
            {selected.user && (
              <div className="p-4 border border-gray-500 rounded-md mb-5 max-w-xl">
                <h2 className="mb-6 text-xl font-black">User</h2>
                <div className="pb-2 border-b border-gray-300 mb-2">
                  id: <strong>{selected.user.id}</strong>
                </div>
                <div className="pb-2 border-b border-gray-300 mb-2">
                  Name: <strong>{selected.user.name}</strong>
                </div>
                <div className="pb-2 border-b border-gray-300 mb-2">
                  Email:{' '}
                  <strong>
                    <a href={`mailto:${selected.user.email}`}>
                      {selected.user.email}
                    </a>
                  </strong>
                </div>
              </div>
            )}
            {sections.map((section) => (
              <div className="mb-12" key={section.title}>
                <h2 className="font-black text-2xl mb-8">{section.title}</h2>
                <div className="grid grid-cols-12 gap-4">
                  {section.fields.map((field) => (
                    <div className="col-span-12 lg:col-span-6" key={field.key}>
                      {field.formula ? (
                        <div>
                          <TextField
                            label={field.label}
                            fullWidth
                            disabled
                            value={state[field.key]}
                          />
                        </div>
                      ) : (
                        <RenderInputField
                          field={field}
                          onChangeCallback={onChangeField}
                          value={state[field.key]}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <BlackButtonClient onClick={save}>
                <strong>Save</strong>
              </BlackButtonClient>
            </div>
          </div>
        )}
      </PortalPanel>
    </AdminWrapper>
  );
}
