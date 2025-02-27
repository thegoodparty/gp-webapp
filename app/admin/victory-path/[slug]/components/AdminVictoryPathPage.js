'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useEffect, useState, useMemo } from 'react';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import RenderInputField from '@shared/inputs/RenderInputField';
import TextField from '@shared/inputs/TextField';
import { Autocomplete } from '@mui/material';
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
import { useSnackbar } from 'helpers/useSnackbar';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

export async function sendVictoryMail(id) {
  try {
    return await clientFetch(apiRoutes.admin.campaign.victoryMail, { id });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

// todo: This could be populated dynamically by state using ElectionType model.
// Which would further reduce choices by state but we'd also need to
// append certain federal and state choices to the list.

const electionTypeChoices = [
  { id: '', title: 'Entire State' },
  { id: 'US_Congressional_District', title: 'US Congressional District' },
  { id: 'State_Senate_District', title: 'State Senate District' },
  { id: 'State_House_District', title: 'State House District' },
  { id: 'County', title: 'County' },
  { id: 'Precinct', title: 'Precinct' },
  { id: 'City', title: 'City' },
  {
    id: 'City_Council_Commissioner_District',
    title: 'City Council Commissioner District',
  },
  { id: 'County_Commissioner_District', title: 'County Commissioner District' },
  {
    id: 'County_Supervisorial_District',
    title: 'County Supervisorial District',
  },
  { id: 'City_Mayoral_District', title: 'City Mayoral District' },
  { id: 'Town_District', title: 'Town District' },
  { id: 'Town_Council', title: 'Town Council' },
  { id: 'Village', title: 'Village' },
  { id: 'Township', title: 'Township' },
  { id: 'Borough', title: 'Borough' },
  { id: 'Hamlet_Community_Area', title: 'Hamlet Community Area' },
  { id: 'City_Ward', title: 'City Ward' },
  { id: 'Town_Ward', title: 'Town Ward' },
  { id: 'Township_Ward', title: 'Township Ward' },
  { id: 'Village_Ward', title: 'Village Ward' },
  { id: 'Borough_Ward', title: 'Borough Ward' },
  { id: 'Board_of_Education_District', title: 'Board of Education District' },
  {
    id: 'Board_of_Education_SubDistrict',
    title: 'Board of Education SubDistrict',
  },
  { id: 'City_School_District', title: 'City School District' },
  { id: 'College_Board_District', title: 'College Board District' },
  {
    id: 'Community_College_Commissioner_District',
    title: 'Community College Commissioner District',
  },
  {
    id: 'Community_College_SubDistrict',
    title: 'Community College SubDistrict',
  },
  {
    id: 'County_Board_of_Education_District',
    title: 'County Board of Education District',
  },
  {
    id: 'County_Board_of_Education_SubDistrict',
    title: 'County Board of Education SubDistrict',
  },
  {
    id: 'County_Community_College_District',
    title: 'County Community College District',
  },
  {
    id: 'County_Superintendent_of_Schools_District',
    title: 'County Superintendent of Schools District',
  },
  {
    id: 'County_Unified_School_District',
    title: 'County Unified School District',
  },
  { id: 'District_Attorney', title: 'District Attorney' },
  {
    id: 'Education_Commission_District',
    title: 'Education Commission District',
  },
  { id: 'Educational_Service_District', title: 'Educational Service District' },
  {
    id: 'Election_Commissioner_District',
    title: 'Election Commissioner District',
  },
  { id: 'Elementary_School_District', title: 'Elementary School District' },
  {
    id: 'Elementary_School_SubDistrict',
    title: 'Elementary School SubDistrict',
  },
  {
    id: 'Exempted_Village_School_District',
    title: 'Exempted Village School District',
  },
  { id: 'High_School_District', title: 'High School District' },
  { id: 'High_School_SubDistrict', title: 'High School SubDistrict' },
  { id: 'Judicial_Appellate_District', title: 'Judicial Appellate District' },
  {
    id: 'Judicial_Circuit_Court_District',
    title: 'Judicial Circuit Court District',
  },
  {
    id: 'Judicial_County_Board_of_Review_District',
    title: 'Judicial County Board of Review District',
  },
  {
    id: 'Judicial_County_Court_District',
    title: 'Judicial County Court District',
  },
  { id: 'Judicial_District', title: 'Judicial District' },
  {
    id: 'Judicial_District_Court_District',
    title: 'Judicial District Court District',
  },
  {
    id: 'Judicial_Family_Court_District',
    title: 'Judicial Family Court District',
  },
  { id: 'Judicial_Jury_District', title: 'Judicial Jury District' },
  {
    id: 'Judicial_Juvenile_Court_District',
    title: 'Judicial Juvenile Court District',
  },
  { id: 'Judicial_Magistrate_Division', title: 'Judicial Magistrate Division' },
  {
    id: 'Judicial_Sub_Circuit_District',
    title: 'Judicial Sub Circuit District',
  },
  {
    id: 'Judicial_Superior_Court_District',
    title: 'Judicial Superior Court District',
  },
  {
    id: 'Judicial_Supreme_Court_District',
    title: 'Judicial Supreme Court District',
  },
  { id: 'Middle_School_District', title: 'Middle School District' },
  { id: 'Municipal_Court_District', title: 'Municipal Court District' },
  {
    id: 'Proposed_City_Commissioner_District',
    title: 'Proposed City Commissioner District',
  },
  {
    id: 'Proposed_Elementary_School_District',
    title: 'Proposed Elementary School District',
  },
  {
    id: 'Proposed_Unified_School_District',
    title: 'Proposed Unified School District',
  },
  {
    id: 'Regional_Office_of_Education_District',
    title: 'Regional Office of Education District',
  },
  { id: 'School_Board_District', title: 'School Board District' },
  { id: 'School_District', title: 'School District' },
  { id: 'School_District_Vocational', title: 'School District Vocational' },
  {
    id: 'School_Facilities_Improvement_District',
    title: 'School Facilities Improvement District',
  },
  { id: 'School_Subdistrict', title: 'School Subdistrict' },
  { id: 'Service_Area_District', title: 'Service Area District' },
  {
    id: 'Superintendent_of_Schools_District',
    title: 'Superintendent of Schools District',
  },
  { id: 'Unified_School_District', title: 'Unified School District' },
  { id: 'Unified_School_SubDistrict', title: 'Unified School SubDistrict' },
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
    title: 'Viability Score',
    fields: [
      {
        key: 'viability.level',
        label: 'Election Level',
        type: 'select',
        options: ['', 'local', 'city', 'county', 'state', 'federal'],
      },
      {
        key: 'viability.isPartisan',
        label: 'Is Partisan',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      {
        key: 'viability.isIncumbent',
        label: 'Is Incumbent',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      {
        key: 'viability.isUncontested',
        label: 'Is Uncontested',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      { key: 'viability.candidates', label: 'Candidates', type: 'number' },
      { key: 'viability.seats', label: 'Seats', type: 'number' },
      {
        key: 'viability.candidatesPerSeat',
        label: 'Candidates Per Seat',
        type: 'number',
        formula: true,
      },
      { key: 'viability.score', label: 'Score', type: 'number', formula: true },
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
        type: 'number',
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
const keyTypes = {};

sections.forEach((section) => {
  section.fields.forEach((field) => {
    keyTypes[field.key] = field.type;
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
  const { pathToVictory: p2vObject, details } = campaign;
  const pathToVictory = useMemo(() => p2vObject?.data || {}, [p2vObject]);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [state, setState] = useState({
    ...initialState,
    ...pathToVictory,
  });

  async function getVoterLocations(electionType, state) {
    try {
      setLoadingLocations(true);
      const locationResp = await clientFetch(apiRoutes.voters.locations, {
        electionType,
        state,
      });
      const items = locationResp?.data || [];
      setLocations(items);
      setLoadingLocations(false);
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
  }

  useEffect(() => {
    if (
      state.electionType &&
      state.electionType !== '' &&
      state.electionType !== null &&
      campaign.details?.state &&
      campaign.details?.state !== '' &&
      campaign.details?.state !== null
    ) {
      console.log(`getting voter locations for ${state.electionType}`);
      getVoterLocations(state.electionType, campaign.details?.state);
    }
  }, [state.electionType, campaign.details?.state]);

  const [notNeeded, setNotNeeded] = useState(
    pathToVictory?.p2vNotNeeded || false,
  );
  const { successSnackbar, errorSnackbar } = useSnackbar();

  useEffect(() => {
    if (!state.winNumber || !state.averageTurnoutPercent) {
      let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
      let averageTurnoutPercent = Math.round(
        (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
      );
      setState((state) => ({
        ...state,
        winNumber,
        averageTurnoutPercent,
      }));
    }
  }, [
    state.winNumber,
    state.averageTurnoutPercent,
    state.averageTurnout,
    state.projectedTurnout,
    state.totalRegisteredVoters,
  ]);

  useEffect(() => {
    if (pathToVictory?.viability) {
      for (let key in pathToVictory.viability) {
        let value = pathToVictory.viability[key];
        if (value === 'true' || value === 'false') {
          value = value === 'true';
        } else if (value !== '' && isNumeric(value)) {
          value = parseFloat(value);
        }
        pathToVictory[`viability.${key}`] = value;
      }
    }
    setState((prevState) => {
      return {
        ...prevState,
        ...pathToVictory,
      };
    });
  }, [pathToVictory]);

  const onChangeField = (key, value) => {
    let winNumber = Math.round(state.projectedTurnout * 0.51 || 0);
    let averageTurnoutPercent = Math.round(
      (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
    );

    if (key === 'averageTurnout') {
      averageTurnoutPercent = Math.round(
        (value / state.totalRegisteredVoters) * 100,
      );
    }

    let val = value;
    if (keyTypes[key] === 'number' && value !== '') {
      val = parseFloat(value);
    } else if (keyTypes[key] === 'select' && value !== '') {
      if (value === 'true' || value === 'false') {
        val = value === 'true';
      }
    } else {
      val = value;
    }

    let candidatesPerSeat;
    if (key === 'viability.seats' && value > 0) {
      candidatesPerSeat = Math.ceil(state['viability.candidates'] / value);
    } else if (key === 'viability.candidates' && value > 0) {
      candidatesPerSeat = Math.ceil(value / state['viability.seats']);
    } else {
      candidatesPerSeat = state['viability.candidatesPerSeat'];
    }

    let score = calculateViabilityScore({
      level: key === 'viability.level' ? val : state['viability.level'],
      isPartisan:
        key === 'viability.isPartisan' ? val : state['viability.isPartisan'],
      isIncumbent:
        key === 'viability.isIncumbent' ? val : state['viability.isIncumbent'],
      isUncontested:
        key === 'viability.isUncontested'
          ? val
          : state['viability.isUncontested'],
      candidates:
        key === 'viability.candidates' && val !== ''
          ? parseInt(val)
          : state['viability.candidates'],
      candidatesPerSeat,
    });

    console.log('saving key', key, 'value', val, 'typeof', typeof val);

    setState({
      ...state,
      [key]: val,
      winNumber,
      averageTurnoutPercent,
      'viability.candidatesPerSeat': candidatesPerSeat,
      'viability.score': score,
    });
  };

  const onChangeLocation = async (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
    let attr = [];
    attr.push({ key: 'pathToVictory.electionLocation', value });
    attr.push({
      key: 'pathToVictory.electionType',
      value: state['electionType'],
    });
    await updateCampaign(attr, campaign.slug);
    successSnackbar('Saved Election Location.');
  };

  const onChangeElectionType = async (key, value) => {
    // we only want to update the election type if the location set
    // now we clear the location options when the election type changes
    setState({
      ...state,
      [key]: value,
      ['electionLocation']: '',
    });
  };

  const calculateViabilityScore = (viability) => {
    const {
      level,
      isPartisan,
      isIncumbent,
      isUncontested,
      candidates,
      candidatesPerSeat,
    } = viability;

    let score = 0;
    if (level) {
      if (level === 'city' || level === 'local') {
        score += 1;
      } else if (viability.level === 'county') {
        score += 1;
      } else if (viability.level === 'state') {
        score += 0.5;
      }
    }

    console.log('typeof isPartisan', typeof isPartisan);
    if (typeof isPartisan === 'boolean') {
      if (isPartisan) {
        score += 0.25;
      } else {
        score += 1;
      }
    }

    if (typeof isIncumbent === 'boolean') {
      if (isIncumbent) {
        score += 1;
      } else {
        score += 0.5;
      }
    }

    if (typeof isUncontested === 'boolean') {
      if (isUncontested) {
        score += 5;
        return score;
      }
    }

    if (typeof candidates === 'number') {
      if (candidates > 0) {
        if (candidatesPerSeat <= 2) {
          score += 0.75;
        } else if (candidatesPerSeat === 3) {
          score += 0.5;
        } else if (candidatesPerSeat >= 4) {
          score += 0.25;
        }
      } else {
        score += 0.25;
      }
    }

    return score;
  };

  const save = async () => {
    successSnackbar('Saving...');

    try {
      // only send mail the first time we update pathToVictory
      if (!pathToVictory) {
        await sendVictoryMail(campaign.id);
      }
      // send only the keys that changed
      let keysToUpdate = [];
      if (pathToVictory) {
        keysToUpdate = keys.filter((key) => state[key] != pathToVictory[key]);
      } else {
        keysToUpdate = keys;
      }

      let attr = keysToUpdate.map((key) => {
        return {
          key: `pathToVictory.${key}`,
          value: state[key],
        };
      });
      attr.push({ key: 'pathToVictory.p2vStatus', value: 'Complete' });

      await updateCampaign(attr, campaign.slug);
      successSnackbar('Saved');
      await revalidatePage('/admin/victory-path/[slug]');
      window.location.reload();
    } catch (e) {
      console.log('error in p2v save', e);
      errorSnackbar('Error saving campaign');
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
          <H3 className="mt-12 mb-6 flex items-center">
            <Checkbox defaultChecked={notNeeded} onChange={handleNotNeeded} />
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
                          getOptionLabel={(option) => option.title}
                          // value={state[field.key]}
                          value={
                            field.options.find(
                              (option) => option.id === state[field.key],
                            ) || null
                          }
                          onChange={(e, value) => {
                            onChangeElectionType(
                              field.key,
                              value ? value.id : null,
                            );
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
                        <>
                          <Autocomplete
                            options={locations}
                            value={state[field.key]}
                            onChange={(e, value) => {
                              onChangeLocation(field.key, value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                disabled={
                                  state?.electionType === undefined ||
                                  state.electionType === ''
                                }
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
                          {!notNeeded && <VoterFileSection />}
                        </>
                      </div>
                    ) : field.key === 'electionLocation' &&
                      locations.length === 0 ? (
                      <div>
                        {loadingLocations ? (
                          <div role="status" className="animate-pulse w-full">
                            <div className="h-10 bg-gray-200 rounded-[4px] dark:bg-gray-700 w-full"></div>
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <TextField
                            label={field.label}
                            disabled
                            value="No locations available"
                          />
                        )}
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
