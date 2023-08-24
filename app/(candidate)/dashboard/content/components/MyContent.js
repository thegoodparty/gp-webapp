'use client';

import { Select } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import H2 from '@shared/typography/H2';
import H6 from '@shared/typography/H6';
import Modal from '@shared/utils/Modal';
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import {
  camelToSentence,
  camelToKebab,
  kebabToCamel,
} from 'helpers/stringHelper';
import { useState, useEffect } from 'react';
import Table from '@shared/utils/Table';
import Actions from './Actions';
import { useMemo } from 'react';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Link from 'next/link';
import { IoDocumentText } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import LoadingList from '@shared/utils/LoadingList';
import { debounce } from '/helpers/debounceHelper';

const subSectionKey = 'aiContent';
let aiCount = 0;
let aiTotalCount = 0;

async function fetchUserCampaignClient() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    return await gpFetch(api, false, false);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function MyContent({ prompts }) {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('');
  const [sections, setSections] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('');
  const [campaign, setCampaign] = useState(undefined);
  const [campaignPlan, setCampaignPlan] = useState(undefined);
  const [jobStarting, setJobStarting] = useState(false);
  const versions = useVersions();
  const [updatedVersions, setUpdatedVersions] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  let tableVersion = true;

  const updateVersionsCallback = async () => {
    const { versions } = await fetchCampaignVersions();
    setUpdatedVersions(versions);
  };

  const onSelectPrompt = () => {
    if (selected !== '') {
      setJobStarting(true);
      const key = findKey();
      setSection(key);
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

  let inputData = [];
  if (sections) {
    Object.keys(sections).forEach((key) => {
      const section = sections[key];
      inputData.push({
        name: section.name,
        updatedAt: new Date(section.updatedAt),
        slug: camelToKebab(key),
        documentKey: key,
      });
    });
  }

  const data = useMemo(() => inputData);

  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => {
        if (
          row.original.updatedAt !== undefined &&
          row.original.updatedAt != 'Invalid Date'
        ) {
          return (
            <Link
              href="/dashboard/content/[slug]"
              as={`/dashboard/content/${row.original.slug}`}
            >
              <div className="flex flex-row items-center font-semibold">
                <IoDocumentText className="ml-3 text-md shrink-0" />
                <div className="ml-3">{row.original.name}</div>
              </div>
            </Link>
          );
        } else {
          return (
            // do not show link for documents that are processing.
            <div className="flex flex-row items-center font-semibold">
              <IoDocumentText className="ml-3 text-md shrink-0" />
              <div className="ml-3">{row.original.name}</div>
            </div>
          );
        }
      },
    },
    {
      Header: 'Last Modified',
      accessor: 'updatedAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        let updatedAt;
        if (row.original.updatedAt) {
          updatedAt = dateWithTime(row.original.updatedAt);
          if (updatedAt === undefined || updatedAt === 'Invalid Date') {
            updatedAt = '';
          }
        }
        return <div className="pl-[40px]">{updatedAt}</div>;
      },
    },
    {
      Header: '',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        const actionProps = {
          slug: row.original?.slug ? row.original.slug : '',
          name: row.original?.name ? row.original.name : '',
          documentKey: row.original?.documentKey
            ? row.original.documentKey
            : '',
          tableVersion,
          updatedAt: row.original.updatedAt
            ? row.original.updatedAt
            : undefined,
        };
        return <Actions {...actionProps} />;
      },
    },
  ]);

  async function getUserCampaign() {
    const campaignResponse = await fetchUserCampaignClient();
    const campaignObj = campaignResponse.campaign;
    if (campaignObj) {
      setCampaign(campaignObj);
      const campaignPlanObj = campaignObj[subSectionKey];
      setCampaignPlan(campaignPlanObj);
      const sectionsObj = campaignObj[subSectionKey] || {};

      let jobsProcessing = false;
      const statusObj = campaignObj.campaignPlanStatus || {};
      for (const statusKey in statusObj) {
        if (statusObj[statusKey] === 'processing') {
          jobsProcessing = true;
          sectionsObj[statusKey] = {
            key: statusKey,
            name: camelToSentence(statusKey),
            updatedAt: undefined,
          };
        }
      }

      setSections(sectionsObj);
      setLoading(false);

      if (jobsProcessing === true) {
        aiCount++;
        aiTotalCount++;

        debounce(getUserCampaign, undefined, 10000);

        if (aiTotalCount >= 100) {
          //fail
          snackbarState.set(() => {
            return {
              isOpen: true,
              message:
                'We are experiencing an issue creating your content. Please reach out to your campaign manager.',
              isError: true,
            };
          });
          setLoading(false);
          setIsFailed(true);
          return;
        }
      }
    }
  }

  useEffect(() => {
    getUserCampaign();
  }, []);

  useEffect(() => {
    if (
      section &&
      section != '' &&
      campaign &&
      (!campaignPlan || !campaignPlan[section])
    ) {
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
    // this is only called once now.
    const { chatResponse, status } = await generateAI(
      subSectionKey,
      section,
      regenerate,
      chat,
      editMode,
    );

    if (!chatResponse && status === 'processing') {
      // job has started.
      if (jobStarting === true) {
        console.log('job has started processing!');
        setJobStarting(false);
        setShowModal(false);
        setSelected('');
        // refresh the campaign.
        getUserCampaign();
      }
    } else {
      setJobStarting(false);
      setLoading(false);
      //fail
      snackbarState.set(() => {
        return {
          isOpen: true,
          message:
            'There was an error creating your content. Please try again.',
          isError: true,
        };
      });
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center w-full">
          {/* <CircularProgress size={50} /> */}
          <LoadingList />
        </div>
      ) : (
        <>
          <div className="mb-7 inline-block" onClick={() => setShowModal(true)}>
            <PrimaryButton>+ New Content</PrimaryButton>
          </div>

          <Table
            columns={columns}
            data={data}
            filterColumns={false}
            pagination={false}
          />
        </>
      )}

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
              <SecondaryButton disabled={jobStarting === true}>
                Cancel
              </SecondaryButton>
            </div>
            <div className="ml-3" onClick={onSelectPrompt}>
              <PrimaryButton disabled={jobStarting === true || selected === ''}>
                {jobStarting ? <CircularProgress size={20} /> : 'Create'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
