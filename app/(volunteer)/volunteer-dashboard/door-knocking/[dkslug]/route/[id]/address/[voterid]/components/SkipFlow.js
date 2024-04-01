'use client';
import { Drawer, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import TextField from '@shared/inputs/TextField';
import H5 from '@shared/typography/H5';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function setDone(routeId, voterId, data) {
  try {
    const api = gpApi.doorKnocking.survey.skip;

    const payload = {
      routeId,
      voterId,
      data,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at acceptInvitation', e);
    return false;
  }
}

const options = [
  'Refused to Engage',
  'Engaging',
  'Informative',
  'Locked interest',
];

export default function SkipFlow(props) {
  const { routeId, voter, dkSlug } = props;
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [homeStatus, setHomeStatus] = useState(null);
  const [note, setNote] = useState('');
  const router = useRouter();

  const canSave = () => {
    return homeStatus !== null && !processing;
  };

  const handleSave = async () => {
    setProcessing(true);
    const data = { atHome: homeStatus, skipNote: note };
    const { nextVoter, isRouteCompleted } = await setDone(
      routeId,
      voter.id,
      data,
    );
    if (isRouteCompleted) {
      router.push(
        `/volunteer-dashboard/door-knocking/${dkSlug}/route/${routeId}`,
      );
    } else if (nextVoter) {
      router.push(
        `/volunteer-dashboard/door-knocking/${dkSlug}/route/${routeId}/address/${nextVoter}`,
      );
    } else {
      setProcessing(false);
    }
  };
  return (
    <>
      <PrimaryButton
        fullWidth
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Skip
      </PrimaryButton>
      <div>
        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            style: { backgroundColor: 'transparent' },
          }}
        >
          <div className="p-4 rounded-t-lg bg-white">
            <H5 className="text-center pb-6">
              Why are you skipping this household?
            </H5>
            Was the voter home?
            <RadioGroup
              row
              value={homeStatus}
              onChange={(e) => setHomeStatus(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            <div className="my-8">
              <TextField
                autoFocus
                fullWidth
                label="Add Note"
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <PrimaryButton fullWidth disabled={!canSave()} onClick={handleSave}>
              Skip Household
            </PrimaryButton>
          </div>
        </Drawer>
      </div>
    </>
  );
}
