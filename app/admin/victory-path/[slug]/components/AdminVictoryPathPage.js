'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useState } from 'react';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import RenderInputField from '@shared/inputs/RenderInputField';
import TextField from '@shared/inputs/TextField';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper';
import H3 from '@shared/typography/H3';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { dateUsHelper } from 'helpers/dateHelper';
import Checkbox from '@shared/inputs/Checkbox';
import VoterFileSection from './VoterFileSection';
import ProFieldsSection from './ProFieldsSection';

async function fetchCampaignBySlug(slug) {
  try {
    const api = gpApi.campaign.findBySlug;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

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
  const [campaign, setCampaign] = useState(props.campaign);
  const { pathToVictory, details } = campaign;

  const [state, setState] = useState({
    ...initialState,
    ...pathToVictory,
  });
  const [notNeeded, setNotNeeded] = useState(
    pathToVictory?.p2vNotNeeded || false,
  );
  const snackbarState = useHookstate(globalSnackbarState);

  const onChangeField = (key, value) => {
    let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
    if (key === 'projectedTurnout') {
      winNumber = Math.round(value * 0.51);
    }
    let val = value;
    if (keys[key] === 'number') {
      val = parseInt(value);
    }

    setState({
      ...state,
      [key]: val,
      winNumber,
    });
  };

  const refreshCampaign = async () => {
    const { campaign } = await fetchCampaignBySlug(campaign.slug);

    setCampaign(campaign);
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
      ...pathToVictory,
      ...state,
      p2vStatus: 'Complete',
    };
    try {
      // only send mail the first time we update pathToVictory
      if (!pathToVictory) {
        await sendVictoryMail(updated.slug);
      }
      // send only the keys that changed
      const keysToUpdate = keys.filter(
        (key) => state[key] != pathToVictory[key],
      );

      const attr = keysToUpdate.map((key) => {
        return {
          key: `pathToVictory.${key}`,
          value: state[key],
        };
      });
      attr.push({ key: 'pathToVictory.p2vStatus', value: 'Complete' });

      await updateCampaign(attr, campaign.slug);

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
    details?.office === 'Other'
      ? `${details?.otherOffice} (Other)`
      : details?.office;

  const handleNotNeeded = async (e) => {
    setNotNeeded(e.target.checked);

    await updateCampaign([
      {
        key: 'pathToVictory',
        value: { ...state, p2vNotNeeded: e.target.checked },
      },
    ]);
  };
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="mt-8">
          <H2>
            Slug: <strong>{campaign?.slug}</strong>
          </H2>
          {!notNeeded && (
            <VoterFileSection
              campaign={campaign}
              refreshCampaignCallback={refreshCampaign}
            />
          )}
          <H3 className="mt-12 mb-6 flex items-center">
            <Checkbox
              value={notNeeded}
              defaultChecked={notNeeded}
              onChange={handleNotNeeded}
            />
            <div>Mark campaign as not needing Path to Victory</div>
          </H3>{' '}
          <ProFieldsSection
            {...props}
            refreshCampaignCallback={refreshCampaign}
          />
          <H4 className="my-8">
            Office: <strong>{office || 'N/A'}</strong>. State:{' '}
            <strong>{details?.state || 'N/A'}</strong>. District:{' '}
            <strong>{details?.district || 'N/A'}</strong>.{' '}
            <strong>{details?.city || 'N/A'}</strong>. ElectionDate:{' '}
            <strong>{dateUsHelper(details?.electionDate) || 'N/A'}</strong>.
            Primary Election Date:{' '}
            <strong>
              {dateUsHelper(details?.primaryElectionDate) || 'N/A'}
            </strong>
          </H4>
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
