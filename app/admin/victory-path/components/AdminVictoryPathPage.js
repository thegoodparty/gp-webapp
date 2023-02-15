'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { Select } from '@mui/material';
import RenderInputField from 'app/(candidate)/onboarding/components/RenderInputField';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { updateCampaign } from 'app/(candidate)/onboarding/[slug]/pledge/components/PledgeButton';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const sections = [
  {
    title: 'Vote Goal',
    fields: [
      { key: 'turnAround', label: '2022 Turnout', type: 'number' },
      { key: 'winNumber', label: 'Win Number', type: 'number' },
    ],
  },

  {
    title: 'Registered Voters',
    fields: [
      { key: 'republicans', label: 'Republicans', type: 'number' },
      { key: 'democrats', label: 'Democrats', type: 'number' },
      { key: 'indies', label: 'Indies', type: 'number' },
    ],
  },

  {
    title: 'Voter Demographics',
    fields: [
      { key: 'ageMin', label: 'Age Range Low', type: 'number' },
      { key: 'ageMax', label: 'Age Range Max', type: 'number' },
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
      { key: 'voterProjection', label: 'Voter Projection', type: 'number' },
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
    setState({
      ...state,
      [key]: value,
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
      await updateCampaign(campaign);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saved',
          isError: false,
        };
      });
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
              {op.slug} (User: {op.user.name})
            </option>
          ))}
        </Select>
        {selected && (
          <div className="mt-8">
            {sections.map((section) => (
              <div className="mb-12">
                <h2 className="font-black text-2xl mb-8">{section.title}</h2>
                <div className="grid grid-cols-12 gap-4">
                  {section.fields.map((field) => (
                    <div className="col-span-12 lg:col-span-6">
                      <RenderInputField
                        field={field}
                        onChangeCallback={onChangeField}
                        value={state[field.key]}
                      />
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
