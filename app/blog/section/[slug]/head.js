import GpHead from '@shared/layouts/GpHead';
import { fetchSections } from './page';

export default async function Head({ params }) {
  const { slug } = params;
  const { sections, sectionSlug, articles, sectionTitle } = await fetchSections(
    slug,
  );
  return (
    <GpHead
      title={`${sectionTitle} | Good Party Blog`}
      description={`Good Part Blog ${sectionTitle} Section`}
    />
  );
}
