'use client';

import { Select } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H2 from '@shared/typography/H2';
import H6 from '@shared/typography/H6';
import Modal from '@shared/utils/Modal';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import CampaignPlanSection from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/CampaignPlanSection';
import { camelToSentence } from 'helpers/stringHelper';
import { useState, useEffect } from 'react';
import Table from './Table';
import Actions from './Actions';
import { useMemo } from 'react';
import { dateUsHelper } from 'helpers/dateHelper';

const subSectionKey = 'aiContent';
let aiCount = 0;
let aiTotalCount = 0;

export default function MyContent({ campaign, prompts }) {
  const [section, setSection] = useState('');
  const [sections, setSections] = useState(campaign[subSectionKey] || {});
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('');
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  const onSelectPrompt = () => {
    if (selected !== '') {
      const key = findKey();
      setSection(key);
      setSections({
        ...sections,
        [key]: {
          key,
          title: camelToSentence(key),
          icon: '/images/dashboard/slogan-icon.svg',
        },
      });

      setSelected('');
      setShowModal(false);
    }
  };

  const findKey = () => {
    if (!sections[selected]) {
      return selected.toLowerCase();
    }
    for (let i = 2; i < 20; i++) {
      if (!sections[`${selected}${i}`]) {
        return `${selected}${i}`.toLowerCase();
      }
    }
    return `${selected}21`.toLowerCase();
  };

  const mappedSections = Object.keys(sections).map((key) => {
    return {
      key,
      title: camelToSentence(key),
      icon: '/images/dashboard/slogan-icon.svg',
    };
  });

  console.log('sections', sections);

  let inputData = [];
  Object.keys(sections).forEach((key) => {
    const section = sections[key];
    inputData.push({
      name: section.name,
      updatedAt: section.updatedAt,
      slug: key,
    });
  });

  const data = useMemo(() => inputData);

  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Last Modified',
      accessor: 'updatedAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return dateUsHelper(row.original.updatedAt);
      },
    },
    {
      Header: '',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions {...row.original} />;
      },
    },
  ]);

  const campaignPlan = campaign[subSectionKey];
  const key = section.toLowerCase();

  useEffect(() => {
    console.log('section', section);
    console.log('campaignPlan', campaignPlan);
    console.log('campaignPlan[section]', campaignPlan[section]);
    if (section && section != '' && (!campaignPlan || !campaignPlan[section])) {
      console.log('Creating AI!!!');
      createInitialAI();
    }
  }, [campaignPlan, section]);

  async function generateAI(subSectionKey, key, regenerate, chat, editMode) {
    try {
      const api = gpApi.campaign.onboarding.ai.create;
      return await gpFetch(api, {
        subSectionKey,
        key,
        regenerate,
        chat,
        editMode,
      });
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  const createInitialAI = async (regenerate, chat, editMode) => {
    aiCount++;
    aiTotalCount++;
    if (aiTotalCount >= 100) {
      //fail
      setPlan(
        'Failed to generate a campaign plan. Please contact us for help.',
      );
      setLoading(false);
      setIsFailed(true);
      return;
    }

    // print out all params
    // console.log('subSectionKey', subSectionKey);
    // console.log('key', key);
    // console.log('regenerate', regenerate);
    // console.log('chat', chat);
    // console.log('editMode', editMode);
    const { chatResponse, status } = await generateAI(
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
    );
    if (!chatResponse && status === 'processing') {
      if (aiCount < 40) {
        setTimeout(async () => {
          await createInitialAI();
        }, 5000);
      } else {
        //something went wrong, we are stuck in a loop. reCreate the response
        console.log('regenerating');
        aiCount = 0;
        createInitialAI(true);
      }
    } else {
      // here, we no longer setPlan.
      // parse the chatResponse and then forward them to their new content url.
      console.log('chatResponse', chatResponse);
      aiCount = 0;
      // setPlan(chatResponse);
      // setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-7 inline-block" onClick={() => setShowModal(true)}>
        <PrimaryButton>+ New Content</PrimaryButton>
      </div>

      <Table columns={columns} data={data} />

      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Create content
          </H2>
          <H6 className="mt-14 mb-2">Select a template</H6>
          <Select
            native
            value={selected}
            required
            variant="outlined"
            fullWidth
            onChange={(e) => {
              setSelected(e.target.value);
            }}
          >
            <option value="">Select an option</option>
            {prompts.map((prompt) => (
              <option key={prompt.key} value={prompt.key}>
                {prompt.title}
              </option>
            ))}
          </Select>
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowModal(false);
              }}
            >
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
            <div className="ml-3" onClick={onSelectPrompt}>
              <PrimaryButton disabled={selected === ''}>Create</PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
