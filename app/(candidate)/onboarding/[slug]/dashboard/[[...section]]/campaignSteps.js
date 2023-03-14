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
      'Good Party will be with you every step of the way so you can run a successful campaign.',
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
        key: 'plan',
        title: 'Your Campaign Plan',
        subTitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
        steps: 0,
        link: '/campaign-plan',
      },
      {
        key: 'incentive',
        title: 'Unlock somthing',
        subTitle:
          'Unlock a one-on-one session with our Political Director, Rob Booth!',
        steps: 0,
        customCard: 'unlockRob',
      },
    ],
  },
  {
    key: 'launch',
    title: 'Launch',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
    icon: <SlRocket size={30} />,
    steps: [],
  },
  {
    key: 'run',
    title: 'Run',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut neque orci.',
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
  const { details, goals, strategy, team, social } = campaign;
  const preLaunchSections = [
    { key: 'details', value: details, count: detailFieldsCount },
    { key: 'goals', value: goals, count: goalsFieldsCount },
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
