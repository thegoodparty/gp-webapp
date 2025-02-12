import pageMetaData from 'helpers/metadataHelper';
import ServePage from './components/ServePage';

const meta = pageMetaData({
  title: 'Serve| GOOD PARTY',
  description: 'Serve',
  slug: '/serve',
});
export const metadata = meta;

export default async function Page({ searchParams }) {
  const childProps = {
    pathname: '/sales/add-campaign',
    title: 'Add a new Campaign',
  };

  return <ServePage pathname="/serve" />;
}
