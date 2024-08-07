import pageMetaData from 'helpers/metadataHelper';
import { FullContentPage } from '@shared/FullContentPage';
import { fetchContent } from 'helpers/fetchContent';

const meta = pageMetaData({
  title: 'Terms of Service | GoodParty.org',
  slug: '/terms-of-service',
});
export const metadata = meta;

export default async function Page() {
  const { content } = await fetchContent('termsOfService');
  return <FullContentPage content={content} />;
}
