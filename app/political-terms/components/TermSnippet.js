import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import { slugify } from 'helpers/articleHelper'
import contentfulHelper from 'helpers/contentfulHelper'
import { TermTitleLink } from './TermTitleLink'

export const termLink = (term) => termLinkByTitle(term?.title)

export const termLinkByTitle = (title) =>
  `/political-terms/${slugify(title, true)}`

export default function TermSnippet({ item, last }) {
  const { title, description } = item

  return (
    <div
      className="text-lg lg:flex  pb-4 mb-4 border-b border-b-neutral-300"
      style={last ? { border: 'none' } : {}}
    >
      <h2 className="mb-1 lg:mb-0 lg:basis-1/3">
        <strong>
          <TermTitleLink title={title} />
        </strong>
      </h2>
      <div
        className="leading-8 max-h-[60px] block w-full overflow-hidden"
        style={{
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'text-overflow': 'ellipsis',
        }}
      >
        <CmsContentWrapper>{contentfulHelper(description)}</CmsContentWrapper>
      </div>
    </div>
  )
}
