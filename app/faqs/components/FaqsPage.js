import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Categories from './Categories';
import Hero from './Hero';

const breadcrumbsLinks = [
  { href: '/', label: 'Good Party' },
  {
    label: 'Frequently asked questions',
  },
];

export default function FaqsPage({ content }) {
  return (
    <>
      <Hero />
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <Categories content={content} />
      </MaxWidth>
    </>
  );
}
