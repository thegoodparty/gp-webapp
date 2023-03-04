import { FaRegLightbulb } from 'react-icons/fa';
import { SlRocket } from 'react-icons/sl';
import { MdHowToVote } from 'react-icons/md';
import { detailFieldsCount } from '../../details/[step]/detailsFields';
import { goalsFieldsCount } from '../../goals/[step]/goalsFields';
import { strategyFieldsCount } from '../../strategy/[step]/strategyFields';
import { teamFieldsCount } from '../../team/[step]/teamFields';

const campaignSteps = [
  {
    key: 'preLaunch',
    title: 'Pre Launch',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <FaRegLightbulb size={30} />,
    steps: [
      {
        key: 'details',
        title: 'Candidate Details',
        subTitle:
          'details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: detailFieldsCount,
      },
      {
        key: 'goals',
        title: 'Goals & Objectives',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: goalsFieldsCount,
      },
      {
        key: 'strategy',
        title: 'Campaign Message & Strategy',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: strategyFieldsCount,
      },
      {
        key: 'team',
        title: 'Build a Campaign Team',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: teamFieldsCount,
      },
      {
        key: 'social',
        title: 'Social Media',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: 3,
      },
      {
        key: 'budget',
        title: ' Budget & Fundraising Plan',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: 6,
      },
    ],
  },
  {
    key: 'launch',
    title: 'Launch',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <SlRocket size={30} />,
    steps: [
      {
        key: 'details',
        title: 'Candidate Details',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: detailFieldsCount,
      },
    ],
  },
  {
    key: 'run',
    title: 'Run',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <MdHowToVote size={30} />,
    steps: [
      {
        key: 'details',
        title: 'Candidate Details',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: detailFieldsCount,
      },
    ],
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
  const { details, goals, strategy, team } = campaign;
  const preLaunchSections = [
    { key: 'details', value: details, count: detailFieldsCount },
    { key: 'goals', value: goals, count: goalsFieldsCount },
    { key: 'strategy', value: strategy, count: strategyFieldsCount },
    { key: 'team', value: team, count: teamFieldsCount },
  ];

  preLaunchSections.forEach((section) => {
    if (section) {
      status.preLaunch.status = 'In Progress';
      status.preLaunch[section.key] = {};
      status.preLaunch[section.key].status = 'In Progress';
      const completedSteps = section.value
        ? Object.keys(section.value).length
        : 0;
      if (completedSteps === 0) {
        status.preLaunch[section.key].status = 'Not Started';
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
