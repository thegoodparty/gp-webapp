'use client';

import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import RenderInputField from '@shared/inputs/RenderInputField';
import { useEffect, useState } from 'react';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { CircularProgress } from '@mui/material';
import { flatStates } from 'helpers/statesHelper';

const fields = [
  {
    key: 'campaignCommittee',
    label: 'Name of Campaign Committee',
    placeholder: 'Campaign Committee',
    type: 'text',
  },
  {
    key: 'occupation',
    label: 'Occupation',
    required: true,
    type: 'text',
  },

  {
    key: 'office',
    label: 'Office',
    type: 'select',
    hidden: true,
    showKey: 'knowRun',
    requiredHidden: true,
    required: true,
    showCondition: ['yes'],
    options: [
      'City Council',
      'Mayor',
      'US Senate',
      'US House of Representatives',
      'Governor',
      'Lieutenant Governor',
      'Attorney General',
      'Comptroller',
      'Treasurer',
      'Secretary of State',
      'State Supreme Court Justice',
      'State Senate',
      'State House of Representatives',
      'County Executive',
      'District Attorney',
      'Sheriff',
      'Clerk',
      'Auditor',
      'Public Administrator',
      'Judge',
      'County Commissioner',
      'Council member',
      'School Board',
      'Other',
    ],
  },

  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: flatStates,
    required: true,
  },
  {
    key: 'otherOffice',
    label: 'Other Office',
    type: 'text',
    hidden: true,
    requiredHidden: true,
    showKey: 'office',
    showCondition: ['Other'],
  },
  // {
  //   key: 'city',
  //   label: 'City/Town',
  //   type: 'text',
  //   hidden: true,
  //   requiredHidden: true,
  //   showKey: 'office',
  //   showCondition: [
  //     'City Council',
  //     'Mayor',
  //     'US House of Representatives',
  //     'State Senate',
  //     'State House of Representatives',
  //     'County Executive',
  //     'District Attorney',
  //     'Sheriff',
  //     'Clerk',
  //     'Auditor',
  //     'Public Administrator',
  //     'Judge',
  //     'County Commissioner',
  //     'Council member',
  //     'School Board',
  //     'Other',
  //   ],
  // },
  // {
  //   key: 'district',
  //   label: 'District (if applicable)',
  //   type: 'text',
  // },
  {
    key: 'electionDate',
    label: 'Date of Election',
    type: 'date',
    validate: 'futureDateOnly',
    campaignObj: 'goals',
  },
  {
    key: 'party',
    label: 'Political Party Affiliation (select one)',
    required: true,
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian Party',
      'Forward Party',
      'Other',
    ],
    invalidOptions: ['Democratic Party', 'Republican Party'],
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'select',
    hidden: true,
    showKey: 'knowRun',
    requiredHidden: true,
    required: true,
    showCondition: ['yes'],
    options: ['2 years', '3 years', '4 years', '6 years'],
  },

  {
    key: 'website',
    label: 'Campaign website',
    type: 'text',
    validate: 'url',
    helperText: 'Please provide a full url starting with http',
  },
];

export default function CampaignSection(props) {
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.key] = '';
  });
  const [state, setState] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const { campaign } = props;
  useEffect(() => {
    if (campaign?.details && campaign?.goals) {
      const newState = {};
      fields.forEach((field) => {
        if (field.campaignObj === 'goals') {
          newState[field.key] = campaign.goals[field.key] || '';
        } else {
          newState[field.key] = campaign.details[field.key] || '';
        }
      });
      setState(newState);
    }
  }, [campaign]);
  const canSave = () => {
    let able = true;
    fields.forEach((field) => {
      if (field.required && state[field.key] === '') {
        able = false;
      }
    });
    return able;
  };

  const handleSave = async () => {
    if (canSave()) {
      setSaving(true);
      const newCampaign = {
        ...campaign,
      };
      fields.forEach((field) => {
        if (field.campaignObj === 'goals') {
          newCampaign.goals = {
            ...newCampaign.goals,
            [field.key]: state[field.key],
          };
        } else {
          newCampaign.details = {
            ...newCampaign.details,
            [field.key]: state[field.key],
          };
        }
      });
      await updateCampaign(newCampaign);
      setSaving(false);
    }
  };

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    });
  };

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Campaign Details</H3>
      <Body1 className="text-indigo-300 mt-2  pb-6 mb-12">
        Update your details so our AI can give you even more personalized tips
        and suggestions.
      </Body1>
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <div key={field.key} className="col-span-12 md:col-span-6">
            <div className="">
              <RenderInputField
                field={field}
                value={state[field.key]}
                onChangeCallback={onChangeField}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-6">
        {saving ? (
          <PrimaryButton disabled>
            <div className="px-3">
              <CircularProgress size={16} />
            </div>
          </PrimaryButton>
        ) : (
          <div onClick={handleSave}>
            <PrimaryButton disabled={!canSave()}>Save</PrimaryButton>
          </div>
        )}
      </div>
    </section>
  );
}
