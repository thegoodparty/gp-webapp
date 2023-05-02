import { FaHeart, FaRegLightbulb, FaStar } from 'react-icons/fa';
import { BsFillMegaphoneFill } from 'react-icons/bs';
import { detailFieldsCount } from '../../details/[step]/detailsFields';
import { goalsFieldsCount } from '../../goals/[step]/goalsFields';

const campaignSteps = [
  {
    key: 'details',
    title: (
      <>
        Fill Candidate
        <br />
        Info
      </>
    ),
    plainTitle: 'Fill Candidate Info',
    subTitle: 'Who you are and your positions on key issues',
    stepNum: 1,
    connectedLine: true,
  },
  {
    key: 'goals',
    title: (
      <>
        Provide
        <br />
        Election Details
      </>
    ),
    plainTitle: 'Provide Election Details',
    subTitle: 'Purpose of your campaign, and measurable targets and milestones',
    stepNum: 2,
  },
  { key: 'gap1', type: 'gap' },
  {
    key: 'campaignPlan',
    title: (
      <>
        Generate
        <br />
        Campaign Plan
      </>
    ),
    plainTitle: 'Generate Campaign Plan',
    subTitle:
      'The overall strategy, tactics, and budget for achieving your campaign goals',
    link: '/campaign-plan',
    stepNum: 3,
    aiIcon: true,
    connectedLine: true,
  },
  {
    key: 'profile',
    type: 'incentive',
    title: 'Campaign Profile',
    icon: <FaStar />,
    connectedLine: true,
  },
  {
    key: 'support',
    type: 'incentive',
    title: 'Expert Campaign Support',
    icon: <FaHeart />,
  },
  {
    key: 'team',
    title: (
      <>
        Build
        <br />
        Campaign Team
      </>
    ),
    plainTitle: 'Build Campaign Team',
    subTitle:
      'Connect with skilled volunteers, passionate advocates, & top professionals',
    stepNum: 4,
    connectedLine: true,
    link: '/team',
  },
  {
    key: 'social',
    title: (
      <>
        Online Presence
        <br />
        &amp; Social Media
      </>
    ),
    plainTitle: 'Online Presence & Social Media',
    subTitle:
      'A tailored Social Strategy leveraging our insights to engage voters & drive support',
    stepNum: 5,
    connectedLine: true,
    comingSoon: true,
  },
  {
    key: 'socialSupport',
    type: 'incentive',
    title: 'Expert Social Media Support',
    icon: <BsFillMegaphoneFill />,
  },
  {
    key: 'finance',
    title: (
      <>
        Financial Management
        <br />
        &amp; Fundraising
      </>
    ),
    plainTitle: 'Financial Management & Fundraising',
    subTitle:
      'A tailored Fundraising Strategy and tools to secure vital financial support efficiently',
    stepNum: 6,
    connectedLine: true,
  },
  {
    key: 'launch',
    title: (
      <>
        Launch Your
        <br />
        &amp; Campaign
      </>
    ),
    plainTitle: 'Launch Your Campaign',
    subTitle: 'Effortlessly launch your campaign with our comprehensive guide',
    stepNum: 7,
    connectedLine: true,
  },
  {
    key: 'financeSupport',
    type: 'incentive',
    title: 'Expert Field & Mobilization Support',
    icon: <FaHeart />,
  },
];

export default campaignSteps;

export const generateCampaignStatus = (campaign) => {
  const status = {
    details: {
      status: 'notStarted',
      completedSteps: 0,
      totalSteps: detailFieldsCount,
    },
    goals: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: goalsFieldsCount,
    },
    campaignPlan: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 11,
    },
    profile: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 1,
    },
    support: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 1,
    },
    team: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 1,
    },
    social: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 5,
    },
    socialSupport: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 5,
    },

    finance: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 5,
    },
    launch: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 1,
    },
    financeSupport: {
      status: 'locked',
      completedSteps: 0,
      totalSteps: 5,
    },
  };
  if (!campaign) {
    return status;
  }

  Object.keys(status).forEach((key, index) => {
    const step = status[key];
    const value = campaign[key];
    if (value) {
      const completedSteps = Object.keys(value).length || 0;
      if (completedSteps > 0) {
        step.status = 'inProgress';
      }
      if (completedSteps >= step.totalSteps) {
        step.status = 'completed';
      }
      if (step.key === 'campaignPlan' && completedSteps === 4) {
        // details has 4 steps.
        step.status = 'notStarted';
      }
      step.completedSteps = completedSteps;
    }

    // if the previous step is completed and current step is locked
    // then set status to notStarted
    if (index > 0 && step.status === 'locked') {
      const keys = Object.keys(status);
      const prevStatus = status[keys[index - 1]];
      if (prevStatus.status === 'completed') {
        step.status = 'notStarted';
      }
    }
  });

  // set incentive status
  if (status.campaignPlan.status === 'completed') {
    status.support.status = 'completed';
    status.profile.status = 'completed';
    if (status.team.status === 'locked') {
      status.team.status = 'notStarted';
    }
  } else {
    status.support.status = 'locked';
    status.profile.status = 'locked';
  }

  if (status.social.status === 'completed') {
    status.socialSupport.status = 'completed';
    if (status.finance.status === 'locked') {
      status.finance.status = 'notStarted';
    }
  } else {
    status.socialSupport.status = 'locked';
  }

  if (status.finance.status === 'completed') {
    status.financeSupport.status = 'completed';
    status.launch.status = 'noStarted';
  } else {
    status.financeSupport.status = 'locked';
  }

  return status;
};
