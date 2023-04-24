import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { dateUsHelper } from 'helpers/dateHelper';
import contentfulHelper from 'helpers/contentfulHelper';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import pageMetaData from 'helpers/metadataHelper';

async function fetchContent() {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'privacyPage',
  };
  return await gpFetch(api, payload, 3600);
}

const meta = pageMetaData({
  title: 'Privacy Policy | GOOD PARTY',
  description:
    'This Privacy Policy explains how Good Party collects, uses, and disclose information that you may provide while visiting our website',
  slug: '/privacy',
});
export const metadata = meta;

export default async function Page(params) {
  const { content } = await fetchContent();
  return (
    <MaxWidth>
      <h1
        className="mt-6 text-center text-3xl lg:text-4xl font-black"
        data-cy="privacy-title"
      >
        {content.title}
      </h1>
      <div className="flex justify-center items-center mt-2 text-sm">
        <div>Last Revision &nbsp; | &nbsp;</div>
        <div>{dateUsHelper(content.lastModified)}</div>
      </div>
      <div className="my-5">
        <CmsContentWrapper>
          {contentfulHelper(content.pageContent)}
        </CmsContentWrapper>
      </div>
    </MaxWidth>
  );
}
