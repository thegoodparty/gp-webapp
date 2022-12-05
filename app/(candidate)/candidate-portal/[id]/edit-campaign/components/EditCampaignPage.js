'use client';
import { isValidUrl } from 'helpers/linkhelper';
import { flatStates } from 'helpers/statesHelper';
import { Fragment, Suspense, useEffect, useState } from 'react';
import PortalPanel from '../../shared/PortalPanel';
import PortalWrapper from '../../shared/PortalWrapper';
import CampaignColorPicker from './CampaignColorPicker';
import Select from '@mui/material/Select';
import { partyResolver } from 'helpers/candidateHelper';
import JoditEditorWrapper from '@shared/inputs/JoditEditorWrapper';
import YouTubeInput from '@shared/inputs/YouTubeInput';
import TextField from '@shared/inputs/TextField';
import PhoneInput from '@shared/inputs/PhoneInput';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fields = [
  { label: 'First Name', key: 'firstName', required: true },
  { label: 'Last Name', key: 'lastName', required: true },
  { label: 'Zip Code', key: 'zip' },

  { label: 'Twitter', key: 'twitter', isUrl: true },
  { label: 'Facebook', key: 'facebook', isUrl: true },
  { label: 'YouTube', key: 'youtube', isUrl: true },
  { label: 'LinkedIn', key: 'linkedin', isUrl: true },
  { label: 'Snap', key: 'snap', isUrl: true },
  { label: 'TikTok', key: 'tiktok', isUrl: true },
  { label: 'Instagram', key: 'instagram', isUrl: true },
  { label: 'Twitch', key: 'twitch', isUrl: true },
  { label: 'Website', key: 'website', isUrl: true },
];

export const fields2 = [
  {
    label: 'Political party affiliation',
    key: 'party',
    type: 'select',
    options: ['I', 'GP', 'L', 'W', 'F', 'U', 'Other'],
    required: true,
  },

  { label: 'Other Party', key: 'otherParty', isHidden: true },
  {
    label: 'State ',
    key: 'state',
    columns: 'col-span-6',
    type: 'select',
    options: flatStates,
    required: true,
  },
  {
    label: 'Office ',
    key: 'office',
    columns: 'col-span-6',
    type: 'select',
    withGroups: true,
    options: [
      {
        group: 'Federal',
        options: ['President', 'US Senate', 'US House of Representatives'],
      },
      {
        group: 'State',
        options: [
          'Governor',
          'Lieutenant Governor',
          'Attorney General',
          'Comptroller',
          'Treasurer',
          'Secretary of State',
          'State Supreme Court Justice',
          'State Senate',
          'State House of Representatives',
        ],
      },
      {
        group: 'Local',
        options: [
          'County Executive',
          'Mayor',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council Member',
          'School Board',
        ],
      },
    ],
    required: true,
  },
  {
    label: 'District (if applicable)',
    columns: 'col-span-6',
    key: 'district',
    type: 'number',
  },
  {
    label: 'Counties served',
    key: 'counties',
    columns: 'col-span-6',
  },
  {
    label: 'Date of election ',
    key: 'raceDate',
    isDate: true,
    required: true,
  },
  {
    label: 'Ballot filing deadline ',
    key: 'ballotDate',
    isDate: true,
    columns: 'col-span-6',
  },
  {
    label: 'Early voting date',
    key: 'earlyVotingDate',
    isDate: true,
    columns: 'col-span-6',
  },
  { label: 'Headline', key: 'headline', required: true },
  { label: 'Summary', key: 'about', isRichText: true, required: true },
  { label: 'Committee name', key: 'committeeName' },
  {
    label: 'Campaign Video (YouTube Id)',
    key: 'heroVideo',
    type: 'youtubeInput',
  },

  { label: 'Why I am running', key: 'whyRunning' },
  { label: 'Why I am an independent', key: 'whyIndependent' },
  { label: 'Prior experience', key: 'experience' },

  { label: 'Home Town & State', key: 'hometown' },
  { label: 'Current occupation', key: 'occupation' },
  { label: 'Fun fact', key: 'funFact' },
];

export const fields3 = [
  { label: 'First Name ', key: 'contactFirstName' },
  { label: 'Last Name ', key: 'contactLastName' },
  { label: 'Email ', key: 'contactEmail', type: 'email' },
  { label: 'Phone ', key: 'contactPhone', type: 'phone' },
];

export const panels = [
  { fields, label: 'Candidate Information' },
  { fields: fields2, label: 'Campaign Information' },
  { fields: fields3, label: 'Contact Information' },
];

export const updateCandidateCallback = async (id, candidate) => {
  const api = gpApi.campaign.update;
  const payload = {
    id,
    candidate,
  };
  return await gpFetch(api, payload);
};

export const fetchCandidate = async (id) => {
  const api = gpApi.campaign.find;
  const payload = { id };
  return gpFetch(api, payload);
};

export default function EditCampaignPage(props) {
  const [candidate, setCandidate] = useState(props.candidate);
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const [updateImage, setUpdateImage] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [s3Url, setS3Url] = useState(false);

  const updateCandidate = async () => {
    await updateCandidateCallback(candidate.id, state);
    const res = await fetchCandidate(candidate.id);
    setCandidate(res.candidate);
  };

  useEffect(() => {
    const newState = {};
    const newErrors = {};
    panels.forEach((panel) => {
      panel.fields.forEach((field) => {
        newState[field.key] = candidate[field.key] || '';
        if (
          field.isUrl &&
          candidate[field.key] &&
          candidate[field.key] !== ''
        ) {
          if (!isValidUrl(candidate[field.key])) {
            newErrors[field.key] = 'invalid URL';
          }
        }
      });
    });
    setState(newState);
    setErrors(newErrors);
    if (candidate.party === 'Other') {
      setShowHidden(true);
    }
  }, [candidate]);

  const onChangeField = (key, value, isUrl, isRequired) => {
    setState({
      ...state,
      [key]: value,
    });
    if (key === 'party' && value === 'Other') {
      setShowHidden(true);
    }
    if (key === 'party' && value !== 'Other') {
      setShowHidden(false);
    }
    if (key === 'office') {
      if (
        value === 'US House of Representatives' ||
        value === 'State Senate' ||
        value === 'State House of Representatives' ||
        value === 'County Commissioner ' ||
        value === 'Council Member' ||
        value === 'School Board'
      ) {
        fields2[4].required = true; // district
      } else {
        fields2[4].required = false; // district
      }
    }

    let urlFailed = false;
    if (isUrl) {
      if (value !== '' && !isValidUrl(value)) {
        urlFailed = true;
        setErrors({ ...errors, [key]: 'invalid URL' });
      } else {
        setErrors({ ...errors, [key]: false });
      }
    }

    if (!urlFailed) {
      // don't override the non valid error
      if (isRequired && value === '') {
        setErrors({ ...errors, [key]: 'This field is required' });
      } else {
        setErrors({ ...errors, [key]: false });
      }
    }
  };

  const handleUpload = (url) => {
    uploadImageCallback(candidate.id, url);
    setUpdateImage(false);
  };

  const canSubmit = () => {
    let valid = true;
    try {
      panels.forEach((panel) => {
        panel.fields.forEach((field) => {
          const val = state[field.key];
          if (field.isUrl && val && val !== '') {
            if (!isValidUrl(val)) {
              valid = false;
              throw new Error('invalid');
            }
          }
          if (field.required && val === '') {
            valid = false;
            throw new Error('invalid');
          }
        });
      });
    } catch (_) {
      return false;
    }

    return valid;
  };

  return (
    <PortalWrapper {...props}>
      <Suspense fallback="loading">
        <CampaignColorPicker candidate={candidate} />
      </Suspense>

      {panels.map((panel, index) => (
        <PortalPanel
          color="#EE6C3B"
          key={panel.label}
          data-cy="campaign-manage-panel"
        >
          <div className="w-full lg:w-[60%]">
            <h3 className="font-black text-2xl mb-11" data-cy="panel-title">
              {panel.label}
            </h3>
            <div className="grid gap-4 grid-cols-12">
              {panel.fields.map((field) => (
                <Fragment key={field.key}>
                  {(!field.isHidden || showHidden) && (
                    <div
                      className={`col-span-12 ${
                        field.columns ? 'lg:col-span-6' : 'lg:col-span-12'
                      }`}
                      data-cy="panel-field"
                    >
                      {field.isRichText && (
                        <>
                          {field.label}
                          <br />
                          <JoditEditorWrapper
                            onChangeCallback={(value) =>
                              onChangeField(field.key, value)
                            }
                            initialText={state[field.key]}
                          />
                          {errors[field.key] && <Err>{errors[field.key]}</Err>}
                          <br />
                        </>
                      )}
                      {field.type === 'select' && (
                        <>
                          <Select
                            native
                            value={state[field.key]}
                            fullWidth
                            variant="outlined"
                            required={field.required}
                            error={field.required && state[field.key] === ''}
                            onChange={(e) =>
                              onChangeField(
                                field.key,
                                e.target.value,
                                false,
                                field.required,
                              )
                            }
                          >
                            <option value="">Select {field.label}</option>
                            {field.withGroups ? (
                              <>
                                {field.options.map((op) => (
                                  <optgroup label={op.group} key={op}>
                                    {op.options.map((sub) => (
                                      <option value={sub} key={sub}>
                                        {partyResolver(sub)}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </>
                            ) : (
                              <>
                                {field.options.map((op) => (
                                  <option value={op} key={op}>
                                    {partyResolver(op)}
                                  </option>
                                ))}
                              </>
                            )}
                          </Select>
                          {errors[field.key] && (
                            <div className="text-red-600 mt-2">
                              {errors[field.key]}
                            </div>
                          )}
                        </>
                      )}
                      {field.type === 'youtubeInput' && (
                        <YouTubeInput
                          initialId={state[field.key] || ''}
                          onChangeCallback={(value, id) => {
                            onChangeField(field.key, id);
                          }}
                        />
                      )}

                      {field.type !== 'select' &&
                        !field.isRichText &&
                        field.type !== 'youtubeInput' &&
                        field.type !== 'phone' && (
                          <TextField
                            style={{ width: '100%' }}
                            label={field.label}
                            name={field.label}
                            value={state[field.key] || ''}
                            initialValue={state[field.key]}
                            type={
                              field.isDate
                                ? 'date'
                                : field.type === 'email'
                                ? 'email'
                                : field.type === 'number'
                                ? 'number'
                                : 'text'
                            }
                            onChange={(e) =>
                              onChangeField(
                                field.key,
                                e.target.value,
                                field.isUrl,
                                field.required,
                              )
                            }
                            inputProps={{ maxLength: field.maxLength || 200 }}
                            InputLabelProps={{
                              shrink: !!state[field.key] || field.isDate,
                            }}
                            error={
                              (field.required && state[field.key] === '') ||
                              !!errors[field.key]
                            }
                            helperText={
                              errors[field.key] ? errors[field.key] : ''
                            }
                            required={field.required}
                          />
                        )}

                      {field.type === 'phone' && (
                        <PhoneInput
                          value={state[field.key] || ''}
                          onChangeCallback={(phone) =>
                            onChangeField('contactPhone', phone)
                          }
                          hideIcon
                        />
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
              {index === 1 && (
                <div className="col-span-12">
                  <div className="my-6" style={{ maxWidth: '250px' }}>
                    Campaign Photo
                    <br />
                    <br />
                    {(candidate.image || s3Url) && !updateImage ? (
                      <div>
                        <img
                          src={s3Url || candidate.image}
                          className="full-image"
                        />
                        <br />
                        <BlackButtonClient
                          onClick={() => setUpdateImage(true)}
                          fullWidth
                        >
                          <strong>Change Photo</strong>
                        </BlackButtonClient>
                      </div>
                    ) : (
                      <div>
                        <strong>Upload an Image</strong>
                        <br />
                        {/* <ImageUploadContainer
                              uploadCallback={handleUpload}
                              maxFileSize={1000000}
                            /> */}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {index === 0 && (
            <div className="text-right py-5">
              <BlackButtonClient
                onClick={() => updateCandidate()}
                className="sticky-el"
                disabled={!canSubmit()}
              >
                <strong>SAVE</strong>
              </BlackButtonClient>
            </div>
          )}
        </PortalPanel>
      ))}
    </PortalWrapper>
  );
}
