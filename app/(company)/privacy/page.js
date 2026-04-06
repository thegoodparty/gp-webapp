import pageMetaData from 'helpers/metadataHelper';
import { FullContentPage } from '@shared/FullContentPage';
import { fetchContentByType } from 'helpers/fetchHelper';

const meta = pageMetaData({
  title: 'Privacy Policy | GoodParty.org',
  description:
    'This Privacy Policy explains how GoodParty.org collects, uses, and disclose information that you may provide while visiting our website',
  slug: '/privacy',
});
export const metadata = meta;

export default async function Page() {
  const content = (await fetchContentByType('privacyPage'))[0];
  return <FullContentPage content={content} />;
}
