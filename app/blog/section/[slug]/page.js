import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from 'app/blog/components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';

export const fetchSections = async (slug) => {
  const api = { ...gpApi.content.contentByKey };
  api.url += '?key=blogSections';
  const { content } = await gpFetch(api, false, 3600);
  let articles = [];
  let sectionTitle;
  for (let i = 0; i < content.length; i++) {
    const section = content[i];
    if (section.fields?.slug === slug) {
      articles = section.articles;
      sectionTitle = section.fields.title;
      break;
    }
  }

  return {
    sections: content,
    sectionSlug: slug,
    articles,
    sectionTitle,
  };
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { sections, sectionSlug, articles, sectionTitle } = await fetchSections(
    slug,
  );

  const meta = pageMetaData({
    title: `${sectionTitle} | Good Party Blog`,
    description: `Good Part Blog ${sectionTitle} Section`,
    slug: `/blog/section/${sectionSlug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  if (!slug) {
    notFound();
  }

  const { sections, sectionSlug, articles, sectionTitle } = await fetchSections(
    slug,
  );

  const childProps = {
    sections,
    sectionSlug,
    articles,
    sectionTitle,
  };

  return (
    <>
      <BlogPage {...childProps} />
    </>
  );
}

export async function generateStaticParams() {
  const api = { ...gpApi.content.contentByKey };
  api.url += `?key=blogSections&deleteKey=articles`;

  const { content } = await gpFetch(api, false);

  return content.map((section) => {
    return {
      slug: section.fields.slug,
    };
  });
}
