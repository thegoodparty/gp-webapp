'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H6 from '@shared/typography/H6';
import RenderInputField from 'app/(candidate)/onboarding/shared/RenderInputField';
import { flatStates } from 'helpers/statesHelper';
import { useState } from 'react';
import { colors } from './CandidateColors';
import Body2 from '@shared/typography/Body2';
import { isValidUrl } from 'helpers/linkhelper';

let errorMessage = false;

export default function EditProfile(props) {
  const {
    candidate,
    isStaged,
    campaign,
    saveCallback,
    color,
    updateColorCallback,
  } = props;
  let firstName, lastName, slogan, office, otherOffice, district, website;
  if (isStaged && campaign && campaign.details) {
    ({ firstName, lastName, office, otherOffice, district, website } =
      campaign.details);
    ({ slogan } = campaign.campaignPlan);
  } else {
    ({ firstName, lastName, slogan, office, otherOffice, district, website } =
      candidate);
  }

  const [state, setState] = useState({
    firstName,
    lastName,
    state: candidate.state,
    office,
    otherOffice,
    district,
    slogan,
    color,
    website,
  });
  const [error, setError] = useState(false);

  const fields = [
    { label: 'First Name', key: 'firstName', type: 'text' },
    { label: 'Last Name', key: 'lastName', type: 'text' },
    { label: 'State', key: 'state', type: 'select', options: flatStates },
    {
      key: 'office',
      label: 'Office',
      type: 'select',
      showKey: 'knowRun',
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
      key: 'otherOffice',
      label: 'Other Office',
      type: 'text',
      hidden: true,
      requiredHidden: true,
      showKey: 'office',
      showCondition: ['Other'],
    },
    {
      key: 'district',
      label: 'Jurisdiction (City, District, etc.)',
      type: 'text',
      hidden: true,
      requiredHidden: true,
      showKey: 'office',
      showCondition: [
        'City Council',
        'Mayor',
        'US House of Representatives',
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
    { label: 'Website', key: 'website', type: 'text' },
    { label: 'Slogan', key: 'slogan', type: 'text', rows: 5 },
  ];

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canShowField = (field) => {
    const { showKey, showCondition } = field;
    return showCondition.includes(state[showKey]);
  };

  const saveColor = (col) => {
    onChangeField('color', col);
    updateColorCallback(col);
  };

  const handleEdit = async () => {
    if (!canSubmit()) {
      setError(errorMessage);
      return;
    }
    if (isStaged && campaign) {
      const stateNoSlogan = { ...state };
      delete stateNoSlogan.slogan;
      await saveCallback({
        ...campaign,
        color,
        details: {
          ...campaign.details,
          ...stateNoSlogan,
        },
        campaignPlan: {
          ...campaign.campaignPlan,
          slogan: state.slogan,
        },
      });
    } else {
      // update a real candidate
      await saveCallback({
        ...candidate,
        ...state,
      });
    }
  };

  const canSubmit = () => {
    if (state.website && state.website !== '' && !isValidUrl(state.website)) {
      errorMessage = 'Website is required and should start with http';
      return false;
    }

    if (state.firstName === '') {
      errorMessage = 'First name is required';
      return false;
    }
    if (state.lastName === '') {
      errorMessage = 'Last name is required';
      return false;
    }
    if (state.slogan === '') {
      errorMessage = 'Slogan is required';
      return false;
    }
    if (state.website && state.website !== '' && !isValidUrl(state.website)) {
      errorMessage = 'Website is required and should start with http';
      return false;
    }
    errorMessage = false;

    return true;
  };

  return (
    <div className="lg:w-[350px]">
      {fields.map((field) => (
        <div key={field.key}>
          {(!field.hidden || canShowField(field)) && (
            <RenderInputField
              value={state[field.key]}
              field={field}
              onChangeCallback={onChangeField}
            />
          )}
        </div>
      ))}

      <div className="border border-slate-500 rounded-xl py-4 px-5">
        <H6 className="mb-4">Select profile color</H6>
        <div className="flex justify-between">
          {colors.map((col) => (
            <div
              className="p-1 rounded-lg border"
              key={col}
              style={{ borderColor: col === color ? color : '#EEF3F7' }}
            >
              <div
                className="h-10 w-10 rounded-lg cursor-pointer"
                style={{ backgroundColor: col }}
                onClick={() => {
                  saveColor(col);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16" onClick={handleEdit}>
        <PrimaryButton fullWidth>Save</PrimaryButton>
      </div>
      {error && <Body2 className="mt-2 text-red text-center">{error}</Body2>}
    </div>
  );
}
