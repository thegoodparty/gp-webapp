import { FaRegLightbulb } from 'react-icons/fa';
import { SlRocket } from 'react-icons/sl';
import { MdHowToVote } from 'react-icons/md';
import { detailFieldsCount } from '../../details/[step]/detailsFields';
import { goalsFieldsCount } from '../../goals/[step]/goalsFields';

const campaignSteps = [
  {
    key: 'preLaunch',
    preTitle: 'Build Your Campaign Plan',
    title: 'Pre Launch',
    subTitle:
      "Establish your campaign's goals, messaging, strategy, and organization before officially announcing your candidacy.",
    icon: <FaRegLightbulb size={30} />,
    steps: [
      {
        key: 'details',
        title: 'Candidate Details',
        subTitle:
          'Brief bio, your experience, and positions on key issues, providing voters with a clear understanding of who you are.',
        steps: detailFieldsCount,
      },
      {
        key: 'goals',
        title: 'Goals & Objectives',
        subTitle:
          'Purpose of your campaign, as well as specific, measurable targets and milestones that the campaign aims to achieve.',
        steps: goalsFieldsCount,
      },
      {
        key: 'campaignPlan',
        title: 'Your Campaign Plan',
        subTitle:
          "The overall strategy, tactics, and budget for achieving the campaign's goals and objectives.",
        steps: 0,
        link: '/campaign-plan',
      },
      {
        key: 'incentive',
        steps: 0,
        customCard: 'UnlockJared',
      },
    ],
  },
  {
    key: 'launch',
    title: 'Launch',
    subTitle:
      'Officially announce your candidacy and kick off the campaign with a well-planned event that generates momentum and media coverage.',
    icon: <SlRocket size={30} />,
    steps: [],
  },
  {
    key: 'run',
    title: 'Run',
    subTitle:
      'Execute the strategy and tactics developed in earlier phases, including fundraising, canvassing, advertising, and public appearances.',
    icon: <MdHowToVote size={30} />,
    steps: [],
  },
];

export default campaignSteps;

export const generateCampaignStatus = (campaign) => {
  const status = {
    preLaunch: { status: 'Not Started', completedSteps: 0 },
    launch: { status: 'Not Started', completedSteps: 0 },
    run: { status: 'Not Started', completedSteps: 0 },
    nextStep: {
      sectionIndex: 0,
      step: 1,
    },
  };
  if (!campaign) {
    return status;
  }
  const { details, goals, campaignPlan } = campaign;
  const preLaunchSections = [
    { key: 'details', value: details, count: detailFieldsCount },
    { key: 'goals', value: goals, count: goalsFieldsCount },
    { key: 'campaignPlan', value: campaignPlan, count: 1 },
  ];

  preLaunchSections.forEach((section) => {
    if (section) {
      status.preLaunch[section.key] = {};
      status.preLaunch[section.key].status = 'In Progress';
      const completedSteps = section.value
        ? Object.keys(section.value).length
        : 0;
      if (completedSteps === 0) {
        status.preLaunch[section.key].status = 'Not Started';
        if (section.key === 'details') {
          status.preLaunch.status = 'Not Started';
        }
      } else {
        status.preLaunch.status = 'In Progress';
      }
      status.preLaunch[section.key].completedSteps = completedSteps;
      if (completedSteps >= section.count) {
        status.preLaunch[section.key].status = 'Completed';
        status.preLaunch.completedSteps++;
        status.nextStep.step++;
      }
    }
  });

  return status;
};
