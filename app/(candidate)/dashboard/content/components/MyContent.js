'use client';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { camelToKebab } from 'helpers/stringHelper';
import { useEffect, useMemo, useState } from 'react';
import Table from '@shared/utils/Table';
import Actions from './Actions';
import { dateWithTime } from 'helpers/dateHelper';
import Link from 'next/link';
import { IoDocumentText } from 'react-icons/io5';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import LoadingList from '@shared/utils/LoadingList';
import { debounce } from '/helpers/debounceHelper';
import NewContentFlow from './NewContentFlow';
import { generateAIContent } from 'helpers/generateAIContent';
import {
  AI_CONTENT_SUB_SECTION_KEY,
  buildAiContentSections,
} from 'helpers/buildAiContentSections';
import { trackEvent } from 'helpers/fullStoryHelper';

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
  const snackbarState = useHookstate(globalSnackbarState);

  let tableVersion = true;

  const onSelectPrompt = (key, additionalPrompts, inputValues) => {
    setJobStarting(true);
    trackEvent('ai_content_generation_start', { key });
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
    data.sort((a, b) => a.updatedAt - b.updatedAt);
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
      const campaignPlanObj = campaignObj[AI_CONTENT_SUB_SECTION_KEY];
      setCampaignPlan(campaignPlanObj);
      const [sectionsObj, jobsProcessing] = buildAiContentSections(
        campaignObj,
        AI_CONTENT_SUB_SECTION_KEY,
      );
      setSections(sectionsObj);
      setLoading(false);

      if (jobsProcessing) {
        handleJobProcessing();
      }
    }
  }

  const handleJobProcessing = () => {
    aiTotalCount++;
    debounce(getUserCampaign, 10000);

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
      createAIContent({
        section,
        initialChat,
        initialValues,
      });
    }
  }, [campaignPlan, section]);

  const createAIContent = async ({
    section = '',
    initialChat = false,
    initialValues = {},
  }) => {
    const { chatResponse, status } = await generateAIContent(
      section,
      initialChat,
      initialValues,
    );

    if (!chatResponse && status === 'processing') {
      if (jobStarting === true) {
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
          <LoadingList />
        </div>
      ) : (
        <>
          <NewContentFlow
            {...props}
            onSelectCallback={onSelectPrompt}
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
