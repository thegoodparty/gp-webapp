'use client';

import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import TextField from '@shared/inputs/TextField';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { candidateHash } from 'helpers/candidateHelper';
import { isValidUrl } from 'helpers/linkhelper';
import { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import SocialSection, { channels } from './SocialSection';

const channelsWithWebsite = [
  ...channels,
  { label: 'Website', key: 'website' },
  { label: 'Hashtag', key: 'hashtag' },
];

export default function EditSocialSection(props) {
  const { candidate, campaign } = props;
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState({
    hashtag: '',
    website: '',
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    snap: '',
    twitch: '',
  });
  const handleEditMode = () => {
    setEdit(true);
  };

  useEffect(() => {
    if (candidate) {
      const updated = { ...state };
      channelsWithWebsite.forEach((channel) => {
        updated[channel.key] = candidate[channel.key] || '';
      });
      if (!candidate.hashtag) {
        updated.hashtag = candidateHash(candidate);
      }

      setState(updated);
      console.log('updated', updated);
    }
  }, [candidate]);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSave = () => {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      if (state[channel.key] !== '' && !isValidUrl(state[channel.key])) {
        return false;
      }
      return true;
    }
  };

  const handleSave = async () => {
    await updateCampaign({
      ...campaign,
      ...state,
    });
    window.location.reload();
  };
  return (
    <>
      {edit ? (
        <section className="bg-white  my-3 rounded-2xl p-6 ">
          <h3 className="font-bold mt-5 mb-3 text-xl">Edit Social Section</h3>
          {channelsWithWebsite.map((channel) => (
            <div key={channel.key} className="mb-3">
              <TextField
                label={channel.label}
                name={channel.label}
                value={state[channel.key]}
                className="w-full"
                onChange={(e) => onChangeField(channel.key, e.target.value)}
              />
            </div>
          ))}
          <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
            Save
          </BlackButtonClient>
        </section>
      ) : (
        <div className="relative">
          <div
            className="absolute z-20 right-1 top-1/2"
            onClick={handleEditMode}
          >
            <div className="h-12 w-12 inline-flex items-center justify-center bg-slate-50 rounded-full cursor-pointer">
              <FaPencilAlt />
            </div>
          </div>
          <SocialSection {...props} />
        </div>
      )}
    </>
  );
}
