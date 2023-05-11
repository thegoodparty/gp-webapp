'use client';
import { Checkbox } from '@mui/material';
import YellowButton from '@shared/buttons/YellowButton';
import YellowButtonClient from '@shared/buttons/YellowButtonClient';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { BsMegaphone } from 'react-icons/bs';
import { CgWebsite } from 'react-icons/cg';
import { FiCamera } from 'react-icons/fi';
import { RiRocketLine } from 'react-icons/ri';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { useRouter } from 'next/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import Confetti from './Confetti';

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

const fields = [
  {
    title: 'Website',
    key: 'website',
    icon: <CgWebsite />,
    items: [
      'Finalize website and publish on launch day',
      'Test online fundraising',
    ],
  },
  {
    title: 'Media',
    key: 'media',
    icon: <FiCamera />,
    items: [
      'Finalize online/print media lists',
      'Create and send teaser pitch',
      'Send out media alert/embargoed press release',
      'Send out press release',
      'Media tracker with links to stories/interviews',
    ],
  },
  {
    title: 'Social Media',
    key: 'socialMedia',
    icon: <BsMegaphone />,
    items: ['Launch video', 'Social media written content announcing launch'],
  },
  {
    title: 'Email',
    key: 'email',
    icon: <AiOutlineMail />,
    items: [
      'Email teaser close friends/supporters',
      'Broader email launch announcement',
    ],
  },
  {
    title: 'Launch Event',
    key: 'launchEvent',
    icon: <RiRocketLine />,
    items: [
      'Book venue',
      'Order campaign collateral (stickers/banners)',
      'Podium + Audio/Visual',
      'Invitation to friends and family',
      'Media advisory/invitations to press',
      'Event run of show',
      'Write and practice launch speech',
      'Social media content promoting launch event',
      'Social media content live-covering launch event (Twitter/FB live, etc)',
    ],
  },
];

const initialState = {};
fields.forEach((field) => {
  field.items.forEach((item, index) => {
    initialState[`${field.key}-${index}`] = false;
  });
});

export async function launchCampaign() {
  try {
    const api = gpApi.campaign.onboarding.launch;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return {};
  }
}

export default function LaunchChecklist({ campaign }) {
  const { slug, launched, candidateSlug } = campaign;
  const [selected, setSelected] = useState(false);
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const snackbarState = useHookstate(globalSnackbarState);

  useEffect(() => {
    if (campaign.launch) {
      setState(campaign.launch);
    }
  }, []);

  const handleSelect = (index) => {
    if (selected === index) {
      setSelected(false);
    } else {
      setSelected(index);
    }
  };

  const onChangeField = async (key, value) => {
    const updated = {
      ...state,
      [key]: value,
    };
    setState(updated);

    const trueOnly = {};
    for (const [key, value] of Object.entries(updated)) {
      if (value) {
        trueOnly[key] = true;
      }
    }

    await updateCampaign({
      ...campaign,
      launch: trueOnly,
    });
  };

  const canSave = () => {
    const keys = Object.keys(state);
    for (let i = 0; i < keys.length; i++) {
      if (!state[keys[i]]) {
        return false;
      }
    }
    return true;
  };
  const handleSave = async () => {
    if (launched && candidateSlug) {
      router.push(`/candidate/${candidateSlug}`);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saving...',
          isError: false,
        };
      });
      const { slug } = await launchCampaign();
      if (slug) {
        router.push(`/candidate/${slug}`);
      } else {
        snackbarState.set(() => {
          return {
            isOpen: true,
            message: 'Error launching your campaign',
            isError: true,
          };
        });
      }
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-5">Launch announcement</h2>
      {fields.map((field) => (
        <div key={field.key} className="bg-white py-6 px-8 rounded-lg mb-4">
          <div className="flex items-center mb-5">
            <div className="rounded-lg bg-black bg-opacity-5 h-8 w-8 flex items-center justify-center">
              {field.icon}
            </div>
            <h3 className="ml-3 font-semibold text-lg">{field.title}</h3>
          </div>
          <div>
            {field.items.map((item, index) => (
              <div
                key={`${field.key}-${index}`}
                className="mb-3 ml-6 flex items-center"
              >
                <Checkbox
                  sx={{
                    '&.Mui-checked': { color: '#000' },
                    '& .MuiSvgIcon-root': { fontSize: 36 },
                  }}
                  checked={state[`${field.key}-${index}`]}
                  onChange={(e) =>
                    onChangeField(`${field.key}-${index}`, e.target.checked)
                  }
                />
                <div className="ml-3 text-lg font-semibold">{item}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center mt-14 mb-10">
        <a
          href={`/onboarding/${slug}/dashboard`}
          className="bg-black bg-opacity-5 py-5 px-8 rounded-lg mr-4"
        >
          BACK TO DASHBOARD
        </a>
        <Confetti
          button={
            <YellowButtonClient disabled={!canSave()} onClick={handleSave}>
              <strong>
                {launched ? 'VIEW YOUR PROFILE' : 'LAUNCH YOUR PROFILE'}
              </strong>
            </YellowButtonClient>
          }
        />
      </div>
    </div>
  );
}
