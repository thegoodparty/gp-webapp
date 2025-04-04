import MaxWidth from '@shared/layouts/MaxWidth'
import { dateUsHelper } from 'helpers/dateHelper'
import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import contentfulHelper from 'helpers/contentfulHelper'

export const FullContentPage = ({ content = {} }) => (
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
)
