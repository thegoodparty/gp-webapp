import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import JobPage from '../components/JobPage';
import pageMetaData from 'helpers/metadataHelper';

export const fetchJob = async (slug) => {
  const api = gpApi.jobs.find;
  const payload = {
    id: slug,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { job } = await fetchJob(slug);

  const meta = pageMetaData({
    title: `${job.title} | Good Party Jobs`,
    description: job.descriptionPlain.slice(0, 150) + '...',
    slug: `/work-with-us/${slug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  if (!slug) {
    notFound();
  }

  const { job } = await fetchJob(slug);
  if (!job) {
    notFound();
  }

  const childProps = {
    slug,
    job,
  };

  return (
    <>
      <JobPage {...childProps} />
    </>
  );
}
