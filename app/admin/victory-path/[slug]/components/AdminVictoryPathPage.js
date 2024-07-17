'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { use, useEffect, useState } from 'react';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import RenderInputField from '@shared/inputs/RenderInputField';
import TextField from '@shared/inputs/TextField';
import { Select } from '@mui/material';
import { Autocomplete } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import H3 from '@shared/typography/H3';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { dateUsHelper } from 'helpers/dateHelper';
import Checkbox from '@shared/inputs/Checkbox';
import VoterFileSection from './VoterFileSection';
import AdditionalFieldsSection from 'app/admin/victory-path/[slug]/components/AdditionalFieldsSection';
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign';
import { P2VProSection } from 'app/admin/victory-path/[slug]/components/P2VProSection';

export async function sendVictoryMail(slug) {
  try {
    const api = gpApi.admin.victoryMail;
    return await gpFetch(api, { slug });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

// todo: This could be populated dynamically by state using ElectionType model.
// Which would further reduce choices by state but we'd also need to
// append certain federal and state choices to the list.
const electionTypeChoices = [
  'US_Congressional_District',
  'State_Senate_District',
  'State_House_District',
  'State_Legislative_District',
  'County',
  'Precinct',
  'County_Legislative_District',
  'City',
  'City_Council_Commissioner_District',
  'County_Commissioner_District',
  'County_Supervisorial_District',
  'City_Mayoral_District',
  'Town_District',
  'Town_Council',
  'Village',
  'Township',
  'Borough',
  'Hamlet_Community_Area',
  'City_Ward',
  'Town_Ward',
  'Township_Ward',
  'Village_Ward',
  'Borough_Ward',
  'Board_of_Education_District',
  'Board_of_Education_SubDistrict',
  'City_School_District',
  'College_Board_District',
  'Community_College_Commissioner_District',
  'Community_College_SubDistrict',
  'County_Board_of_Education_District',
  'County_Board_of_Education_SubDistrict',
  'County_Community_College_District',
  'County_Superintendent_of_Schools_District',
  'County_Unified_School_District',
  'District_Attorney',
  'Education_Commission_District',
  'Educational_Service_District',
  'Election_Commissioner_District',
  'Elementary_School_District',
  'Elementary_School_SubDistrict',
  'Exempted_Village_School_District',
  'High_School_District',
  'High_School_SubDistrict',
  'Judicial_Appellate_District',
  'Judicial_Circuit_Court_District',
  'Judicial_County_Board_of_Review_District',
  'Judicial_County_Court_District',
  'Judicial_District',
  'Judicial_District_Court_District',
  'Judicial_Family_Court_District',
  'Judicial_Jury_District',
  'Judicial_Juvenile_Court_District',
  'Judicial_Magistrate_Division',
  'Judicial_Sub_Circuit_District',
  'Judicial_Superior_Court_District',
  'Judicial_Supreme_Court_District',
  'Middle_School_District',
  'Municipal_Court_District',
  'Proposed_City_Commissioner_District',
  'Proposed_Elementary_School_District',
  'Proposed_Unified_School_District',
  'Regional_Office_of_Education_District',
  'School_Board_District',
  'School_District',
  'School_District_Vocational',
  'School_Facilities_Improvement_District',
  'School_Subdistrict',
  'Service_Area_District',
  'Superintendent_of_Schools_District',
  'Unified_School_District',
  'Unified_School_SubDistrict',
];

const sections = [
  {
    title: 'Voter File Settings',
    fields: [
      {
        key: 'electionType',
        label: 'Election Type',
        type: 'text',
        options: electionTypeChoices,
        autocomplete: false,
      },
      {
        key: 'electionLocation',
        label: 'Election Location',
        type: 'text',
        options: electionTypeChoices,
        autocomplete: true,
      },
    ],
  },
  {
    title: 'Vote Goal',
    fields: [
      {
        key: 'totalRegisteredVoters',
        label: 'Total Registered Voters',
        type: 'number',
      },
      {
        key: 'projectedTurnout',
        label: 'Projected Turnout number',
        type: 'number',
      },
      {
        key: 'projectedTurnout',
        label: 'Projected Turnout number',
        type: 'number',
      },
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
        label: 'Average turnout number from past 3 races',
        label: 'Average turnout number from past 3 races',
        type: 'number',
      },
      {
        key: 'averageTurnoutPercent',
        label: 'Average Turnout Percent',
        type: 'number',
        formula: true,
      },
      {
        key: 'averageTurnoutPercent',
        label: 'Average Turnout Percent',
        type: 'number',
        formula: true,
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
  const [campaign, _, refreshCampaign] = useAdminCampaign();
  const { pathToVictory, details } = campaign;
  const [locations, setLocations] = useState([]);
  const [state, setState] = useState({
    ...initialState,
    ...pathToVictory,
  });

  async function getVoterLocations(electionType, state) {
    try {
      const api = gpApi.voterData.locations;
      const locationResp = await gpFetch(api, { electionType, state });
      const items = locationResp?.locations || [];
      setLocations(items);
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  useEffect(() => {
    console.log(`getting voter locations for ${state.electionType}`);
    getVoterLocations(state.electionType, campaign.details.state);
  }, [state.electionType, campaign.details.state]);

  const [notNeeded, setNotNeeded] = useState(
    pathToVictory?.p2vNotNeeded || false,
  );
  const snackbarState = useHookstate(globalSnackbarState);

  useEffect(() => {
    if (!state.winNumber || !state.averageTurnoutPercent) {
      let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
      let averageTurnoutPercent = Math.round(
        (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
      );
      setState({
        ...state,
        winNumber,
        averageTurnoutPercent,
      });
    }
  }, [state.winNumber, state.averageTurnoutPercent]);

  const onChangeField = (key, value) => {
    let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
    let averageTurnoutPercent = Math.round(
      (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
    );
    if (key === 'projectedTurnout') {
      winNumber = Math.round(value * 0.51);
    }
    if (key === 'averageTurnout') {
      averageTurnoutPercent = Math.round(
        (value / state.totalRegisteredVoters) * 100,
      );
    }

    if (key === 'averageTurnout') {
      averageTurnoutPercent = Math.round(
        (value / state.totalRegisteredVoters) * 100,
      );
    }

    let val = value;
    if (keys[key] === 'number') {
      val = parseInt(value);
    }

    setState({
      ...state,
      [key]: val,
      winNumber,
      averageTurnoutPercent,
      averageTurnoutPercent,
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
      ...pathToVictory,
      ...state,
      p2vStatus: 'Complete',
    };
    try {
      // only send mail the first time we update pathToVictory
      if (!pathToVictory) {
        await sendVictoryMail(campaign.slug);
      }
      // send only the keys that changed
      let keysToUpdate = [];
      if (pathToVictory) {
        keysToUpdate = keys.filter((key) => state[key] != pathToVictory[key]);
      } else {
        keysToUpdate = keys;
      }

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
      await revalidatePage('/admin/victory-path/[slug]');
      window.location.reload();
    } catch (e) {
      console.log('error in p2v save', e);
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
    details?.office === 'Other' ? `${details?.otherOffice}` : details?.office;

  const handleNotNeeded = async (e) => {
    setNotNeeded(e.target.checked);

    await updateCampaign(
      [
        {
          key: 'pathToVictory.p2vNotNeeded',
          value: e.target.checked,
        },
      ],
      campaign.slug,
    );
    await refreshCampaign();
  };

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="mt-8">
          <H2>
            Slug: <strong>{campaign?.slug}</strong>
          </H2>
          {!notNeeded && <VoterFileSection />}
          <H3 className="mt-12 mb-6 flex items-center">
            <Checkbox
              value={notNeeded}
              defaultChecked={notNeeded}
              onChange={handleNotNeeded}
            />
            <div>Mark campaign as not needing Path to Victory</div>
          </H3>{' '}
          <AdditionalFieldsSection />
          <P2VProSection />
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
                          disabled
                          value={state[field.key]}
                        />
                      </div>
                    ) : field.key === 'electionType' ? (
                      <div>
                        <Autocomplete
                          options={field.options}
                          value={state[field.key]}
                          onChange={(e, value) => {
                            onChangeField(field.key, value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={field.label}
                              required
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                style: { borderRadius: '4px' },
                              }}
                            />
                          )}
                        />
                      </div>
                    ) : field.key === 'electionLocation' &&
                      locations.length > 0 ? (
                      <div>
                        <Autocomplete
                          options={locations}
                          value={state[field.key]}
                          onChange={(e, value) => {
                            onChangeField(field.key, value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={field.label}
                              required
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                style: { borderRadius: '4px' },
                              }}
                            />
                          )}
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
