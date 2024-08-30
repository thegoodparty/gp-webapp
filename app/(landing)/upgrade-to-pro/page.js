import { redirect } from 'next/navigation';
// import UpgradeToProPage from './components/ProMeetingPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Upgrade to Pro',
  description: 'Request to meet with our team to upgrade to GoodParty.org Pro',

  slug: '/pro-consultation',
  image: 'https://assets.goodparty.org/get-a-demo.png',
});
export const metadata = meta;

export default async function Page() {
  redirect('/dashboard/upgrade-to-pro');
  // return <UpgradeToProPage />;
}
