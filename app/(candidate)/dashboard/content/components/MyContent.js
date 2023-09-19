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
import { fetchUserCampaignClient } from '/helpers/campaignHelper';
import NewContentFlow from './NewContentFlow';

const subSectionKey = 'aiContent';
let aiCount = 0;
let aiTotalCount = 0;

export default function MyContent(props) {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('');
  const [sections, setSections] = useState(undefined);
  const [initialChat, setInitialChat] = useState(false);
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

  const onSelectPrompt = (key, additionalPrompts) => {
    setJobStarting(true);
    if (additionalPrompts) {
      setInitialChat(additionalPrompts);
    }
    setSection(key);
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
      accessor: (data) =>
        data.updatedAt ? data.updatedAt.getTime() : new Date().getTime(),
      sortType: 'date',
      Cell: ({ row }) => {
        let updatedAt;
        if (row.original.updatedAt) {
          updatedAt = dateWithTime(row.original.updatedAt);
          if (updatedAt === undefined || updatedAt === 'Invalid Date') {
            const now = new Date();
            updatedAt = dateWithTime(now);
          }
        }
        return updatedAt;
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

      if (jobsProcessing) {
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
    const resolvedChat = chat || initialChat;
    const { chatResponse, status } = await generateAI(
      subSectionKey,
      section,
      regenerate,
      resolvedChat,
      editMode,
    );

    if (!chatResponse && status === 'processing') {
      // job has started.
      if (jobStarting === true) {
        console.log('job has started processing!');

        // refresh the campaign.
        await getUserCampaign();
        setJobStarting(false);
        setInitialChat(false);
      }
    } else {
      setJobStarting(false);
      setLoading(false);
      setInitialChat(false);
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
          <NewContentFlow
            {...props}
            onSelectCallback={onSelectPrompt}
            sections={sections}
            isProcessing={jobStarting}
          />

          <Table
            columns={columns}
            data={data}
            filterColumns={false}
            pagination={false}
            initialSortById="updatedAt"
          />
        </>
      )}
    </div>
  );
}
