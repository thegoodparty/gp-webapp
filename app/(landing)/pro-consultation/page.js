import ProConsultationPage from './components/ProConsultationPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Good Party Pro Consultation',
  description: 'Learn more about Good Party Pro',

  slug: '/pro-consultation',
  image: 'https://assets.goodparty.org/get-a-demo.png',
});
export const metadata = meta;

export default async function Page() {
  return <ProConsultationPage />;
}
