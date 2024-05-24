'use client';

import {
  fetchCampaignVersions,
  getCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons';
import { camelToSentence, camelToKebab } from 'helpers/stringHelper';
import { useState, useEffect } from 'react';
import Table from '@shared/utils/Table';
import Actions from './Actions';
import { useMemo } from 'react';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Link from 'next/link';
import { IoDocumentText } from 'react-icons/io5';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import LoadingList from '@shared/utils/LoadingList';
import { debounce } from '/helpers/debounceHelper';
import NewContentFlow from './NewContentFlow';

const subSectionKey = 'aiContent';
let aiTotalCount = 0;
const excludedKeys = [
  'why',
  'aboutMe',
  'slogan',
  'policyPlatform',
  'communicationsStrategy',
  'messageBox',
  'mobilizing',
];

export default function MyContent(props) {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('');
  const [sections, setSections] = useState(undefined);
  const [initialChat, setInitialChat] = useState(false);
  const [initialValues, setInitialValues] = useState({});
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

  const onSelectPrompt = (key, additionalPrompts, inputValues) => {
    setJobStarting(true);
    if (additionalPrompts) {
      setInitialChat(additionalPrompts);
    }
    if (inputValues) {
      setInitialValues(inputValues);
    }
    setSection(key);
  };

  let data = [];
  if (sections) {
    Object.keys(sections).forEach((key) => {
      const section = sections[key];
      if (excludedKeys.includes(key) || !section.name) {
        return;
      }
      data.push({
        name: section.name,
        updatedAt: new Date(section.updatedAt),
        slug: camelToKebab(key),
        documentKey: key,
      });
    });
    data.sort((a, b) => b.updatedAt - a.updatedAt);
  }

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
      accessor: (data) => {
        return data.updatedAt ? new Date(data.updatedAt) : new Date();
      },
      sortType: 'datetime',
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
          status:
            row.original.updatedAt && row.original.updatedAt != 'Invalid Date'
              ? undefined
              : 'processing',
        };
        return <Actions {...actionProps} />;
      },
    },
  ]);

  async function getUserCampaign() {
    const campaignResponse = await getCampaign();
    const campaignObj = campaignResponse.campaign;
    if (campaignObj) {
      setCampaign(campaignObj);
      const campaignPlanObj = campaignObj[subSectionKey];
      setCampaignPlan(campaignPlanObj);
      let sectionsObj = campaignObj[subSectionKey] || {};

      let jobsProcessing = false;
      const statusObj = campaignObj[subSectionKey]?.generationStatus || {};
      for (const statusKey in statusObj) {
        if (statusObj[statusKey]['status'] === 'processing') {
          jobsProcessing = true;
          if (sectionsObj[statusKey] === undefined) {
            sectionsObj[statusKey] = {};
          }
          sectionsObj[statusKey]['key'] = statusKey;
          sectionsObj[statusKey]['name'] = camelToSentence(statusKey);
          sectionsObj[statusKey]['updatedAt'] = undefined;
          sectionsObj[statusKey]['status'] = 'processing';
        }
      }
      setSections(sectionsObj);
      setLoading(false);

      if (jobsProcessing) {
        handleJobProcessing();
      }
    }
  }

  const handleJobProcessing = () => {
    aiTotalCount++;
    debounce(getUserCampaign, undefined, 10000);

    if (aiTotalCount >= 100) {
      //fail
      snackbarState.set(() => {
        return {
          isOpen: true,
          message:
            'We are experiencing an issue creating your content. Please report an issue using the Feedback bar on the right.',
          isError: true,
        };
      });
      setLoading(false);
      setIsFailed(true);
      return;
    }
  };

  useEffect(() => {
    initCampaign();
  }, []);

  const initCampaign = async () => {
    await getUserCampaign();
  };

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

  async function generateAI(key, regenerate, chat, editMode, inputValues = {}) {
    try {
      const api = gpApi.campaign.ai.create;
      return await gpFetch(api, {
        key,
        regenerate,
        chat,
        editMode,
        inputValues,
      });
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  const createInitialAI = async (
    regenerate,
    chat,
    editMode,
    inputValues = {},
  ) => {
    // this is only called once now.
    const resolvedChat = chat || initialChat;
    const resolvedInitialValues =
      (inputValues && Object.keys(inputValues) > 0) || initialValues;
    const { chatResponse, status } = await generateAI(
      section,
      regenerate,
      resolvedChat,
      editMode,
      resolvedInitialValues,
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
            'There was an error creating your content. Please Report an issue on the feedback bar on the right.',
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
            forceOpenModal={props.forceOpenModal}
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
