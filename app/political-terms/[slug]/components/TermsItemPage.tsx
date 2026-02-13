import CmsContentWrapper from '@shared/content/CmsContentWrapper'
import MaxWidth from '@shared/layouts/MaxWidth'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import contentfulHelper from 'helpers/contentfulHelper'
import TermsByLetter from '../../components/TermsByLetter'
import Banner from 'app/blog/article/[slug]/components/Banner'
import Button from '@shared/buttons/Button'
import { GlossaryItem } from '../../util/glossaryItemFetching.util'

interface TermsItemPageProps {
  item?: GlossaryItem
  items?: GlossaryItem[]
  activeLetter: string
}

export default function TermsItemPage({
  item,
  items,
  activeLetter,
}: TermsItemPageProps): React.JSX.Element {
  const letter = activeLetter
  const breadcrumbsLinks = [
    { href: '/', label: 'GoodParty.org' },
    {
      href: '/political-terms',
      label: 'Glossary',
    },
    {
      href: `/political-terms/${letter.toLowerCase()}`,
      label: letter,
    },
    {
      href: '',
      label: item ? item.title : 'Not found',
    },
  ]
  if (!item) {
    return (
      <MaxWidth>
        <div className="my-9 lg:my-16">
          <h1 className="font-black text-4xl lg:text-5xl mb-4">
            No Item found
          </h1>
        </div>
      </MaxWidth>
    )
  }
  const { title, description, cta, ctaLink, banner } = item
  const isAbsolute = ctaLink && ctaLink.startsWith('http')
  return (
    <MaxWidth>
      <div className="mt-2">
        <Breadcrumbs links={breadcrumbsLinks} />
      </div>

      <div className="my-7 lg:my-14">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">
          What is {title}?
        </h1>
        <div className="text-lg mb-6">
          <CmsContentWrapper>{contentfulHelper(description)}</CmsContentWrapper>
        </div>
        {cta && ctaLink && !banner && (
          <>
            <Button href={ctaLink} size="large">
              {cta}
            </Button>
            {isAbsolute ? (
              <Button
                nativeLink
                href={ctaLink}
                rel="noopener noreferrer nofollow"
                target="_blank"
                size="large"
              >
                {cta}
              </Button>
            ) : (
              <Button href={ctaLink} size="large">
                {cta}
              </Button>
            )}
          </>
        )}

        {banner && <Banner banner={banner} />}
      </div>
      {activeLetter && items && (
        <TermsByLetter
          letter={letter}
          items={items}
          activeLetter={activeLetter}
        />
      )}
    </MaxWidth>
  )
}
