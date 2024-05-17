import ProConsultationPage from './components/ProConsultationPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'GoodParty.org Pro Consultation',
  description: 'Learn more about GoodParty.org Pro',

  slug: '/pro-consultation',
  image: 'https://assets.goodparty.org/get-a-demo.png',
});
export const metadata = meta;

export default async function Page() {
  return <ProConsultationPage />;
}
