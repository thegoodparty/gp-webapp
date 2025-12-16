import MaxWidth from '@shared/layouts/MaxWidth'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import Categories from './Categories'

interface Article {
  id: number | string
  title: string
}

interface CategoryFields {
  name: string
}

interface Category {
  id: number | string
  fields: CategoryFields
  articles?: Article[]
}

interface FaqsPageProps {
  content?: Category[]
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
