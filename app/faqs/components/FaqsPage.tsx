import MaxWidth from '@shared/layouts/MaxWidth'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import Categories from './Categories'

interface FaqsPageProps {
  content: Record<string, string | number | boolean | object | null>
}

const breadcrumbsLinks = [
  { href: '/', label: 'GoodParty.org' },
  {
    href: '',
    label: 'Frequently asked questions',
  },
]

export default function FaqsPage({ content }: FaqsPageProps): React.JSX.Element {
  return (
    <>
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <Categories content={content} />
      </MaxWidth>
    </>
  )
}
