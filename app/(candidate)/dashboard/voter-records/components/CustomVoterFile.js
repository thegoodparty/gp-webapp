import {
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Overline from '@shared/typography/Overline';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';

const fields = [
  {
    id: 'channel',
    label: 'Channel',
    options: ['Direct Mail', 'Door Knocking', 'SMS Texting', 'Telemarketing'],
  },
  {
    id: 'purpose',
    label: 'Purpose',
    options: ['GOTV', 'Persuasion', 'Voter ID'],
  },
];

const audienceOptions = [
  'All',
  // 'DIVIDER',
  'Super Voters (75% +)',
  'Likely Voters (50%-75%)',
  'Unreliable Voters (25%-50%)',
  'Unlikely Voters (0%-25%)',
  'First Time Voters',
  // 'DIVIDER',
  'Male',
  'Female',
  'Unknown',
  // 'DIVIDER',
  '18-25',
  '25-35',
  '35-50',
  '50+',
  // 'DIVIDER',
  'Democrat',
  'Independent / Non-Partisan',
  'Republican',
];

export default function CustomVoterFile({ campaign }) {
  const [open, setOpen] = useState(true);
  const { office, otherOffice } = campaign?.details;
  const resolvedOffice = office === 'Other' ? otherOffice : office;

  const [state, setState] = useState({
    channel: '',
    purpose: '',
    audience: [],
  });

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleChangeAudience = (event) => {
    console.log('e', event);
    const {
      target: { value },
    } = event;
    setState({
      ...state,
      // On autofill we get a stringified value.
      audience: value,
    });
  };

  console.log('state', state);
  return (
    <div className="col-span-12 md:col-span-6 md:flex md:justify-end md:items-center">
      <PrimaryButton
        onClick={() => {
          setOpen(true);
        }}
      >
        Create custom voter file
      </PrimaryButton>
      <Modal closeCallback={() => setOpen(false)} open={open}>
        <div className="w-[90vw] max-w-xl p-2 md:p-8">
          <div className=" text-center">
            <H1 className="mb-4">Voter File Assistant</H1>
            <Body2>
              Make your selections to get your custom election data for:
              <br />
              <strong>{resolvedOffice}</strong>
            </Body2>
            <Overline className=" text-error my-4">
              All fields are required
            </Overline>
          </div>
          <div className="mt-8 grid grid-cols-12 gap-4">
            {fields.map((field) => (
              <div key={field.id} className="col-span-12 md:col-span-6">
                <InputLabel id={field.id}>{field.label}</InputLabel>
                <Select
                  fullWidth
                  labelId={field.id}
                  value={state[field.id]}
                  label={field.label}
                  onChange={(e) => {
                    handleChange(field.id, e.target.value);
                  }}
                >
                  {field.options.map((option) => (
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ))}
            <div className="col-span-12">
              <InputLabel id="audience">Audience</InputLabel>
              <Select
                fullWidth
                multiple
                labelId="audience"
                value={state.audience}
                label="Audience"
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                onChange={handleChangeAudience}
              >
                {audienceOptions.map((option, index) => (
                  // <div key={index}>
                  //   {option === 'DIVIDER' ? (
                  //     <Divider />
                  //   ) : (
                  <MenuItem value={option} key={option}>
                    <Checkbox checked={state.audience.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                  // )}
                  // </div>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
