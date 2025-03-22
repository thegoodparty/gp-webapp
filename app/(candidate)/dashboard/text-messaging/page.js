import pageMetaData from 'helpers/metadataHelper';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import TextMessagingPage from './components/TextMessagingPage';
import { adminAccessOnly } from 'helpers/permissionHelper';

const meta = pageMetaData({
  title: 'Text Messaging | GoodParty.org',
  description: 'Text Messaging',
  slug: '/dashboard/text-messaging',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await adminAccessOnly();

  const [campaign] = await Promise.all([fetchUserCampaign()]);

  const textCampaignRequest = {
    budget: 100,
    audience: {
      audience_superVoters: true,
      audience_likelyVoters: false,
      audience_unreliableVoters: false,
      audience_unlikelyVoters: false,
      audience_firstTimeVoters: false,
      party_independent: true,
      party_democrat: false,
      party_republican: false,
      age_18_25: true,
      age_25_35: true,
      age_35_50: true,
      'age_50+': true,
      gender_male: true,
      gender_female: true,
      gender_unknown: true,
    },
    script: `Hi, I'm Josh Stell, candidate for Minooka Village Trustee. Some candidates make promises, but I have already been putting in the work. I've been standing up for taxpayers in board meetings and starting work to bring fast, fiber-optic internet to Minooka that will save residents money.  

Reply STOP to opt out. Paid for by Joshawa Stell.`,
    date: '2025-06-01',
    message: 'test',
    type: 'sms',
    image:
      'https://assets.goodparty.org/scheduled-campaign/kathryn-thomas/sms/2025-05-08/FINAL.png',
  };

  const childProps = {
    pathname: '/dashboard/text-messaging',
    campaign,
    textCampaignRequest,
  };

  return <TextMessagingPage {...childProps} />;
}
