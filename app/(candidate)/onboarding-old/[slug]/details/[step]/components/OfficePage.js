'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import OnboardingWrapper from 'app/(candidate)/onboarding-old/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from 'app/(candidate)/onboarding-old/shared/ajaxActions';
import { savingState } from 'app/(candidate)/onboarding-old/shared/OnboardingPage';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import RenderInputField from '@shared/inputs/RenderInputField';
import { flatStates } from 'helpers/statesHelper';
import BallotRaces from './BallotRaces';

const fields = [
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: flatStates,
    hidden: true,
    showKey: 'knowRun',
    showCondition: ['yes'],
    required: true,
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
    label: 'District (if applicable)',
    type: 'text',
    hidden: true,
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
  {
    key: 'city',
    label: 'City/Town',
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
];

export default function OfficePage({ campaign, nextPath, slug, ...props }) {
  const [state, setState] = useState({
    knowRun: campaign.details?.knowRun || null,
    state: campaign.details?.state || '',
    office: campaign.details?.office || '',
    officeTermLength: campaign.details?.officeTermLength || '',
    otherOffice: campaign.details?.otherOffice || '',
    district: campaign.details?.district || '',
    city: campaign.details?.city || '',
    ballotOffice: campaign.details?.ballotOffice || false,
  });

  const router = useRouter();

  useEffect(() => {
    savingState.set(() => false);
  }, []);

  const canSave = () => {
    if (state.knowRun === 'yes') {
      return (
        state.state !== '' &&
        state.office !== '' &&
        state.officeTermLength !== ''
      );
    }
    if (state.knowRun === 'no') {
      return !!state.ballotOffice;
    }
    return false;
  };

  const onChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleSave = async (ballotOffice) => {
    const updated = campaign;
    if (state.knowRun === 'no' && ballotOffice) {
      const { position, election } = ballotOffice;
      updated.details = {
        ...campaign.details,
        positionId: position.id,
        electionId: election.id,
        state: election.state,
        office: 'Other',
        otherOffice: position.name,
      };
    } else {
      console.log('without office');
      updated.details = {
        ...campaign.details,
        ...state,
        positionId: null,
        electionId: null,
        ballotOffice: null,
      };
    }

    await updateCampaign(updated);
    let path = nextPath;

    savingState.set(() => true);

    setTimeout(() => {
      router.push(`/onboarding/${slug}${path}`);
    }, 200);
  };

  const canShowField = (field) => {
    if (state.knowRun === 'no') {
      return false;
    }
    const { showKey, showCondition } = field;
    return showCondition.includes(state[showKey]);
  };

  const handleBallotOffice = async (office) => {
    if (office) {
      onChange('ballotOffice', office);
      // need to wait for state to update
      await handleSave(office);
    } else {
      onChange('ballotOffice', false);
    }
  };

  const selectedOffice = campaign.details?.positionId
    ? {
        position: { id: campaign.details.positionId },
        election: { id: campaign.details.electionId },
      }
    : false;

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <div className="max-w-[640px] mx-auto">
        <div className="mb-4 flex justify-center flex-col items-center">
          <RadioGroup
            row
            value={state.knowRun}
            onChange={(e) => onChange('knowRun', e.target.value)}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes, I do"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="I need help"
            />
          </RadioGroup>
        </div>
        {fields.map((field) => (
          <>
            {(!field.hidden || canShowField(field)) && (
              <RenderInputField
                field={field}
                key={field.key}
                value={state[field.key]}
                onChangeCallback={onChange}
              />
            )}
          </>
        ))}
        {state.knowRun === 'no' ? (
          <BallotRaces
            campaign={campaign}
            selectedOfficeCallback={handleBallotOffice}
            selectedOffice={selectedOffice}
          />
        ) : null}
        <div className="flex justify-center mb-8">
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            <div className="font-black">NEXT</div>
          </BlackButtonClient>
        </div>
      </div>
    </OnboardingWrapper>
  );
}
