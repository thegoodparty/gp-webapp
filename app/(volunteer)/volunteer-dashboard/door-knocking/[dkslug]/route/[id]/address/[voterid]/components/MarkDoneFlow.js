'use client';
import { Drawer } from '@mui/material';
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation';
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
    const api = gpApi.doorKnocking.survey.complete;

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
  '5 - Enthusiastic Supporter',
  '4 - Somewhat Interested',
  '3 - Neutral',
  '2 - Skeptical',
  '1 - Not Interested',
];

export default function MarkDoneFlow(props) {
  const { routeId, voter, dkSlug } = props;
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState(false);
  const [note, setNote] = useState('');
  const router = useRouter();

  const canSave = () => {
    return (selected || note !== '') && !processing;
  };

  const handleSave = async () => {
    setProcessing(true);
    setTimeout(async () => {
      const data = { resolution: selected, note };
      const { nextVoter, isRouteCompleted } = await setDone(
        routeId,
        voter.id,
        data,
      );
      if (isRouteCompleted) {
        window.location.href = `/volunteer-dashboard/door-knocking/${dkSlug}/route/${routeId}`;
      } else if (nextVoter) {
        router.push(
          `/volunteer-dashboard/door-knocking/${dkSlug}/route/${routeId}/address/${nextVoter}`,
        );
      } else {
        setProcessing(false);
      }
    }, 1000);
  };
  return (
    <>
      <div className="p-4">
        <PrimaryButton
          fullWidth
          onClick={() => {
            setOpen(true);
          }}
        >
          Mark as done
        </PrimaryButton>
      </div>
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
            <H5 className="text-center pb-4">How was your visit?</H5>

            {options.map((op) => (
              <div key={op} className="mt-4">
                <SecondaryButton
                  fullWidth
                  size="medium"
                  variant={selected === op ? 'contained' : 'outlined'}
                  onClick={() => setSelected(op)}
                  className="text-left"
                >
                  {op}
                </SecondaryButton>
              </div>
            ))}
            <div className="my-8">
              <TextField
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
              Complete Household
            </PrimaryButton>
          </div>
        </Drawer>
        {processing ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[1201] flex items-center justify-center bg-black bg-opacity-25">
            <div className="w-64 h-64">
              <CheckmarkAnimation />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
