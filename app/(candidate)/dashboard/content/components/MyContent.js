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
import { useState } from 'react';

const subSectionKey = 'aiContent';

export default function MyContent({ campaign, prompts }) {
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
      return selected;
    }
    for (let i = 2; i < 20; i++) {
      if (!sections[`${selected}${i}`]) {
        return `${selected}${i}`;
      }
    }
    return `${selected}21`;
  };

  return (
    <div>
      <div className="mb-7 inline-block" onClick={() => setShowModal(true)}>
        <PrimaryButton>+ New Content</PrimaryButton>
      </div>
      {Object.keys(sections).map((key) => (
        <CampaignPlanSection
          key={key}
          section={sections[key]}
          campaign={campaign}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
          subSectionKey={subSectionKey}
        />
      ))}

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
