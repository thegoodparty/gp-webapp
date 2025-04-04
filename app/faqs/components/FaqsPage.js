import MaxWidth from '@shared/layouts/MaxWidth'
import Breadcrumbs from '@shared/utils/Breadcrumbs'
import Categories from './Categories'

const breadcrumbsLinks = [
  { href: '/', label: 'GoodParty.org' },
  {
    label: 'Frequently asked questions',
  },
]

export default function FaqsPage({ content }) {
  return (
    <>
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <Categories content={content} />
      </MaxWidth>
    </>
  )
}
