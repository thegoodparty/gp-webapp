'use client';
import ResourceCard from '@shared/cards/ResourceCard';

export default function ResourceWrapper({ articlesBySlug, resource }) {
  let { title, slug, type, description, file } = resource;
  let articleSlug = '';
  let link = file;
  if (type === 'blog') {
    const content = articlesBySlug[slug];
    if (!content) {
      return null;
    }
    title = content.title;
    description = content.summary;
    articleSlug = content.slug;
    link = `/blog/article/${articleSlug}`;
  }

  return <ResourceCard title={title} description={description} link={link} />;
}
