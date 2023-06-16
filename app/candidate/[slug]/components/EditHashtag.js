'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { campaignHash, candidateHash } from 'helpers/candidateHelper';
import { useState } from 'react';

export default function EditHashtag(props) {
  const { candidate, saveCallback, isStaged, campaign } = props;
  let hashtag;
  if (isStaged) {
    hashtag = campaignHash(campaign);
  } else {
    hashtag = candidateHash(candidate);
  }

  const [state, setState] = useState(hashtag);

  const save = () => {
    if (isStaged) {
      saveCallback({
        ...campaign,
        hashtag: state,
      });
    } else {
      saveCallback({
        ...candidate,
        hashtag: state,
      });
    }
  };

  return (
    <div className="w-full my-3">
      <TextField
        fullWidth
        value={state}
        error={state === ''}
        onChange={(e) => {
          setState(e.target.value);
        }}
      />
      <div className="mt-3" onClick={save}>
        <PrimaryButton disabled={state === hashtag || state === ''}>
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}
