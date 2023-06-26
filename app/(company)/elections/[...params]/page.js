import { notFound, redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionPage from './components/ElectionPage';
import pageMetaData from 'helpers/metadataHelper';
// import ElectionSchema from './ElectionSchema';

export const fetchElection = async (slug) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'elections',
    subKey: 'slug',
    subValue: slug,
  };

  return await gpFetch(api, payload, 3600);
};

export const fetchCandidate = async (slug) => {
  try {
    const api = gpApi.candidate.find;
    const payload = {
      slug,
      allFields: true,
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
};

export async function generateMetadata({ params }) {
  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : false;
  const year = paramsList?.length > 1 ? paramsList[1] : false;
  const slug = `${city}-${year}`;
  const { content } = await fetchElection(slug);

  const meta = pageMetaData({
    title: content?.pageTitle,
    description: content?.pageDescription,
    slug: `/elections/${city}/${year}`,
  });
  return meta;
}

export default async function Page({ params }) {
  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : '';
  const year = paramsList?.length > 1 ? paramsList[1] : '';
  const slug = `${city}-${year}`;
  const { content } = await fetchElection(slug);
  if (!content) {
    notFound();
  }

  let candidates = [];
  const candidateSlugs = content?.candidates;
  for (const slug of candidateSlugs) {
    const candidate = await fetchCandidate(slug);
    // console.log('candidate', candidate);
    if (candidate != undefined) {
      candidates.push(candidate.candidate);
    }
  }
  content.candidates = candidates;

  const childProps = {
    content,
  };

  return (
    <>
      <ElectionPage {...childProps} />
    </>
  );
}
