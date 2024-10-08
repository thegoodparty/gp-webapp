'use client';
import { useMemo } from 'react';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';
import ResourceCard from '@shared/cards/ResourceCard';

export default function ResourceWrapper({
  sectionTitle,
  articlesBySlug,
  resource,
}) {
  let { title, slug, type, description, file } = resource;
  let articleSlug = '';
  let link = file;

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Resource Library Link', {
        section: sectionTitle,
        title,
        type,
      }),
    [sectionTitle, title, type],
  );

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

  return (
    <ResourceCard
      title={title}
      description={description}
      link={link}
      {...trackingAttrs}
    />
  );
}
