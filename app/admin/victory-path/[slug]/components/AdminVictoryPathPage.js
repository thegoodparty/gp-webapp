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
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';
import H3 from '@shared/typography/H3';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { dateUsHelper } from 'helpers/dateHelper';

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
        label: 'Voter Projection - Victory Meter',
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
  {
    title: 'Dashboard',
    fields: [
      { key: 'voterMap', label: 'Voter Map', type: 'text', fullRow: true },
    ],
  },
  {
    title: 'Results',
    fields: [
      {
        key: 'finalVotes',
        label: 'Final Votes count (post election)',
        type: 'number',
        fullRow: true,
      },
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
  const { campaign } = props;

  const [state, setState] = useState({
    ...initialState,
    ...campaign.pathToVictory,
  });
  const snackbarState = useHookstate(globalSnackbarState);

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
    const updated = {
      ...campaign,
      pathToVictory: state,
      p2vStatus: 'Complete',
    };
    try {
      // only send mail the first time we update pathToVictory
      if (!campaign.pathToVictory) {
        await sendVictoryMail(updated.slug);
      }
      await updateCampaign(updated, false, true);

      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saved',
          isError: false,
        };
      });
      await revalidateCandidates();
      await revalidatePage('/admin/victory-path/[slug]');
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

  const office =
    campaign?.details?.office === 'Other'
      ? `${campaign?.details?.otherOffice} (Other)`
      : campaign?.details?.office;

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="mt-8">
          <H2>
            Slug: <strong>{campaign?.slug}</strong>
            <br />
            Name:{' '}
            <strong>
              {campaign?.details?.firstName || 'N/A'}{' '}
              {campaign?.details?.lastName || ''}
            </strong>
            .
          </H2>
          <H4 className="my-8">
            Office: <strong>{office || 'N/A'}</strong>. State:{' '}
            <strong>{campaign?.details?.state || 'N/A'}</strong>. District:{' '}
            <strong>{campaign?.details?.district || 'N/A'}</strong>.{' '}
            <strong>{campaign?.details?.city || 'N/A'}</strong>. ElectionDate:{' '}
            <strong>
              {dateUsHelper(campaign?.goals?.electionDate) || 'N/A'}
            </strong>
          </H4>
          {/* {selected.user && (
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
          )} */}
          {sections.map((section) => (
            <div className="mb-12" key={section.title}>
              <h2 className="font-black text-2xl mb-8">{section.title}</h2>
              <div className="grid grid-cols-12 gap-4">
                {section.fields.map((field) => (
                  <div
                    className={`col-span-12 ${
                      field.fullRow ? '' : 'lg:col-span-6'
                    }`}
                    key={field.key}
                  >
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
      </PortalPanel>
    </AdminWrapper>
  );
}
