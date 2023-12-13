import MaxWidth from '@shared/layouts/MaxWidth';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import { slugify } from 'helpers/articleHelper';
import Breadcrumbs from '@shared/utils/Breadcrumbs';

export default function PositionPage(props) {
  const breadcrumbsLinks = [
    { href: `/how-to-run`, label: 'How to run' },
    // {
    //   label: `how to run in ${stateName}`,
    //   href: `/how-to-run/${state}`,
    // },
    // {
    //   label: `how to run in ${countyName}`,
    // },
  ];
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <H1 className="pt-12">Position page</H1>
      </MaxWidth>
    </div>
  );
}
